import { ChangeEvent, Fragment, MouseEvent, useEffect, useMemo, useState } from "react";
import { Button, Checkbox, Chip, CircularProgress, Input, Sheet, Table, Typography } from "@mui/joy";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ChevronDown, Plus, Search, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteSelectedProducts, getProducts } from "../utils/api/products";
import { formatDate } from "../utils/uxFncs";
import Cookies from "js-cookie";
import type { AlertInterface, ProductRow } from "../misc/interfaces";
import type { ApiError } from "../utils/api/apiError";
import { MyAlert } from "../components/MyAlert.tsx";
import { PageHeader } from "../components/PageHeader.tsx";
import { StatTiles } from "../components/StatTiles.tsx";
import { Mono } from "../components/Mono.tsx";
import { ProductStatusBar } from "../components/ProductStatusBar.tsx";
import { getExpiryDays, getProductStatus, isExpired, isExpiringSoon, isLowStock } from "../utils/productStatus";

const relativeColor = {
  expired: "var(--joy-palette-danger-solidBg)",
  "expiring-soon": "var(--joy-palette-warning-solidBg)",
  ok: "var(--joy-palette-text-tertiary)",
} as const;

// Small "in N days" / "Expired N days ago" line shown under a row's expiry date.
const ExpiryRelative = ({ expiryDate }: { expiryDate: string | null }) => {
  const { t } = useTranslation();
  const expiry = getExpiryDays(expiryDate);
  if (!expiry) {
    return null;
  }
  const text =
    expiry.status === "expired"
      ? t("days-since-expired", { count: Math.abs(expiry.days) })
      : t("days-until-expiry", { count: expiry.days });
  return (
    <Typography level="body-sm" className="normal-case font-normal" sx={{ color: relativeColor[expiry.status] }}>
      {text}
    </Typography>
  );
};

type FilterKey = "all" | "expired" | "soon" | "low";

const matchesFilter = (row: ProductRow, filter: FilterKey) => {
  if (filter === "all") return true;
  if (filter === "expired") return isExpired(row.expiryDateRaw);
  if (filter === "soon") return isExpiringSoon(row.expiryDateRaw);
  return isLowStock(Number(row.stockLabel));
};

export const InventoryPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [alert, setAlert] = useState<AlertInterface>({
    isAlert: false,
    type: "neutral",
    header: "",
    text: "",
  });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const showError = (error: unknown) => {
    const errorCode = (error as { code?: string })?.code;
    setAlert({
      isAlert: true,
      type: "danger",
      header: t("error"),
      text: errorCode ? t(errorCode) : t("unknown-error"),
    });
  };

  const {
    data: productsData,
    isLoading: productsIsLoading,
    isError: productsError,
    error: productsErrorObj,
  } = useQuery<any[], ApiError>({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  useEffect(() => {
    if (productsError && productsErrorObj) {
      showError(productsErrorObj);
    }
  }, [productsError, productsErrorObj]);

  const rows: ProductRow[] = useMemo(
    () =>
      (productsData ?? []).map((product: any, index: number) => ({
        id: String(product?.uuid ?? index),
        uuid: String(product?.uuid ?? ""),
        name: product?.name ?? t("product-name"),
        description: product?.description ?? "",
        imageUrl: product?.picture ?? undefined,
        price: product?.price ? String(product.price) : "-",
        stock: `${product?.amount ?? 0} ${t("pcs")}`,
        stockLabel: String(product?.amount ?? 0),
        stockStatus: (product?.amount ?? 0) > 0 ? "ok" : "missing",
        location: product?.storage_location_name ?? "-",
        locationDetail: "",
        expiryDate: formatDate(product?.expiry_date),
        expiryDateRaw: product?.expiry_date ?? null,
        refillDate: formatDate(product?.bottling_date),
      })),
    [productsData, t],
  );

  const stats = useMemo(
    () => ({
      expired: rows.filter((row) => isExpired(row.expiryDateRaw)).length,
      expiringSoon: rows.filter((row) => isExpiringSoon(row.expiryDateRaw)).length,
      lowStock: rows.filter((row) => isLowStock(Number(row.stockLabel))).length,
      unitsStored: rows.reduce((sum, row) => sum + Number(row.stockLabel), 0),
    }),
    [rows],
  );

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows
      .filter((row) => matchesFilter(row, filter))
      .filter(
        (row) =>
          !query ||
          row.name.toLowerCase().includes(query) ||
          row.description.toLowerCase().includes(query),
      );
  }, [rows, search, filter]);

  const groups = useMemo(() => {
    const map = new Map<string, ProductRow[]>();
    for (const row of filteredRows) {
      const bucket = map.get(row.location) ?? [];
      bucket.push(row);
      map.set(row.location, bucket);
    }
    return Array.from(map.entries()).map(([name, groupRows]) => ({
      name,
      rows: groupRows,
      units: groupRows.reduce((sum, row) => sum + Number(row.stockLabel), 0),
    }));
  }, [filteredRows]);

  const storageCount = useMemo(() => new Set(rows.map((row) => row.location)).size, [rows]);

  const toggleGroup = (name: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const [selected, setSelected] = useState<readonly string[]>([]);

  const { mutate: deleteSelection, isPending: isDeleting } = useMutation({
    mutationFn: (values: string[]) => deleteSelectedProducts(values),
    onSuccess: () => {
      setSelected([]);
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: showError,
  });

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    setSelected(event.target.checked ? filteredRows.map((row) => row.id) : []);
  };

  const handleClick = (_event: MouseEvent<unknown>, id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const filterTabs: { key: FilterKey; label: string; count: number; color: "neutral" | "danger" | "warning" }[] = [
    { key: "all", label: t("filter-all"), count: rows.length, color: "neutral" },
    { key: "expired", label: t("filter-expired"), count: stats.expired, color: "danger" },
    { key: "soon", label: t("filter-soon"), count: stats.expiringSoon, color: "warning" },
    { key: "low", label: t("filter-low"), count: stats.lowStock, color: "neutral" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("inventory")}
        subtitle={t("inventory-summary", { count: rows.length, storages: storageCount })}
        actions={
          <Button
            startDecorator={<Plus size={16} />}
            onClick={() => navigate({ to: "/app/add-product" })}
            variant="solid"
            className="btn-lift rounded-2xl"
          >
            {t("add")}
          </Button>
        }
      />

      {productsIsLoading && <CircularProgress size="sm" />}
      {alert.isAlert && <MyAlert type={alert.type} header={alert.header} text={alert.text} />}

      <StatTiles
        expired={stats.expired}
        expiringSoon={stats.expiringSoon}
        lowStock={stats.lowStock}
        unitsStored={stats.unitsStored}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("search-products")}
          startDecorator={<Search size={16} />}
          size="lg"
          variant="outlined"
          className="rounded-2xl sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {filterTabs.map((tab) => (
            <Chip
              key={tab.key}
              variant={filter === tab.key ? "solid" : "soft"}
              color={filter === tab.key ? "neutral" : tab.color}
              onClick={() => setFilter(tab.key)}
              className="cursor-pointer rounded-full px-3 transition-all duration-150 active:scale-95"
            >
              {tab.label} {tab.count}
            </Chip>
          ))}
        </div>
      </div>

      <Sheet
        variant="outlined"
        className="flex min-h-0 w-full max-w-full flex-col overflow-hidden rounded-2xl"
        sx={{ border: "1px solid", borderColor: "divider", bgcolor: "background.surface" }}
      >
        {selected.length > 0 && (
          <div
            className="flex items-center justify-between px-6 py-3"
            style={{ borderBottom: "1px solid var(--joy-palette-divider)" }}
          >
            <Typography level="body-sm" sx={{ color: "var(--joy-palette-text-secondary)" }}>
              {selected.length} {t("selected")}
            </Typography>
            <Button
              size="sm"
              color="danger"
              variant="solid"
              startDecorator={<Trash2 size={14} />}
              disabled={isDeleting}
              onClick={() => deleteSelection([...selected])}
              className="rounded-xl"
            >
              {t("delete")}
            </Button>
          </div>
        )}

        {/* Desktop: grouped table */}
        <div className="hidden overflow-auto lg:block">
          <Table
            stickyHeader
            stripe="odd"
            variant="plain"
            hoverRow
            className="w-full"
            sx={{
              tableLayout: "fixed",
              color: "var(--joy-palette-text-secondary)",
              "--TableCell-headBackground": "var(--joy-palette-background-level1)",
              "& thead th": {
                backgroundColor: "var(--joy-palette-background-level1)",
                backgroundImage: "none",
                color: "var(--joy-palette-text-secondary)",
              },
              "& thead th:nth-child(1)": { width: "40px" },
              "& thead th:nth-child(2)": { width: "26%" },
              "& thead th:nth-child(6)": { width: "8%" },
              "& tr > *:nth-child(n+3)": { textAlign: "left" },
              "& tbody tr": {
                borderTop: "1px solid var(--joy-palette-divider)",
                transition: "background-color 120ms ease",
              },
            }}
          >
            <thead>
              <tr>
                <th className="px-2 py-4">
                  <Checkbox
                    checked={filteredRows.length > 0 && selected.length === filteredRows.length}
                    indeterminate={selected.length > 0 && selected.length < filteredRows.length}
                    onChange={handleSelectAllClick}
                    slotProps={{ input: { "aria-label": "select all" } }}
                  />
                </th>
                <th className="px-3 py-4">{t("product-name")}</th>
                <th className="px-3 py-4">{t("stock")}</th>
                <th className="px-3 py-4">{t("price")}</th>
                <th className="px-3 py-4">{t("expiry-date")}</th>
                <th className="px-3 py-4 text-right">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => {
                const isCollapsed = collapsedGroups.has(group.name);
                return (
                  <Fragment key={`group-${group.name}`}>
                    <tr>
                      <td colSpan={6} className="px-3 py-3" style={{ backgroundColor: "var(--joy-palette-background-level1)" }}>
                        <button
                          type="button"
                          onClick={() => toggleGroup(group.name)}
                          className="flex items-center gap-2 font-semibold"
                          style={{ color: "var(--joy-palette-text-primary)" }}
                        >
                          <ChevronDown
                            size={16}
                            className={`shrink-0 transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`}
                          />
                          {group.name}
                          <span className="font-normal" style={{ color: "var(--joy-palette-text-tertiary)" }}>
                            {group.rows.length} {t("products")} &middot; {group.units} {t("units")}
                          </span>
                        </button>
                      </td>
                    </tr>
                    {!isCollapsed &&
                      group.rows.map((row) => {
                        const isItemSelected = selected.includes(row.id);
                        const status = getProductStatus(row.expiryDateRaw);
                        return (
                          <tr
                            key={row.id}
                            onClick={(event) => handleClick(event, row.id)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                          >
                            <td className="px-2 py-4">
                              <Checkbox checked={isItemSelected} sx={{ verticalAlign: "top" }} />
                            </td>
                            <td className="px-3 py-4">
                              <div className="flex min-w-0 items-stretch gap-3">
                                <ProductStatusBar status={status} />
                                <div className="min-w-0">
                                  <Typography level="title-md" className="truncate" sx={{ color: "var(--joy-palette-text-primary)" }}>
                                    {row.name}
                                  </Typography>
                                  <Typography level="body-sm" className="truncate normal-case font-normal" sx={{ color: "var(--joy-palette-text-tertiary)" }}>
                                    {row.description}
                                  </Typography>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-4">
                              <Typography
                                level="title-md"
                                sx={{
                                  color: isLowStock(Number(row.stockLabel))
                                    ? "var(--joy-palette-danger-solidBg)"
                                    : "var(--joy-palette-text-primary)",
                                }}
                              >
                                {row.stock}
                              </Typography>
                            </td>
                            <td className="px-3 py-4">
                              <Mono>
                                <Typography level="body-sm" sx={{ color: "var(--joy-palette-text-tertiary)" }}>
                                  {row.price === "-" ? "-" : `${row.price} ${Cookies.get("currency") ?? ""}`}
                                </Typography>
                              </Mono>
                            </td>
                            <td className="px-3 py-4">
                              <Mono>
                                <Typography level="title-md" className="truncate" sx={{ color: "var(--joy-palette-text-primary)" }}>
                                  {row.expiryDate}
                                </Typography>
                              </Mono>
                              <ExpiryRelative expiryDate={row.expiryDateRaw} />
                            </td>
                            <td className="px-3 py-4 text-right">
                              <Button
                                onClick={() => navigate({ to: `/app/view-product?product=${row.uuid}` })}
                                variant="outlined"
                                size="sm"
                                className="rounded-xl"
                              >
                                {t("details")}
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                  </Fragment>
                );
              })}
            </tbody>
          </Table>
        </div>

        {/* Mobile: grouped card list */}
        <div className="lg:hidden">
          {groups.map((group) => {
            const isCollapsed = collapsedGroups.has(group.name);
            return (
              <div key={group.name}>
                <button
                  type="button"
                  onClick={() => toggleGroup(group.name)}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left font-semibold"
                  style={{
                    backgroundColor: "var(--joy-palette-background-level1)",
                    color: "var(--joy-palette-text-primary)",
                    borderTop: "1px solid var(--joy-palette-divider)",
                  }}
                >
                  <ChevronDown
                    size={16}
                    className={`shrink-0 transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`}
                  />
                  {group.name}
                  <span className="ml-auto font-normal" style={{ color: "var(--joy-palette-text-tertiary)" }}>
                    {group.rows.length}
                  </span>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-200 ease-out"
                  style={{ gridTemplateRows: isCollapsed ? "0fr" : "1fr" }}
                >
                  <div className="overflow-hidden">
                    {group.rows.map((row) => {
                      const status = getProductStatus(row.expiryDateRaw);
                      return (
                        <button
                          key={row.id}
                          type="button"
                          onClick={() => navigate({ to: `/app/view-product?product=${row.uuid}` })}
                          className="flex w-full items-stretch gap-3 px-4 py-3 text-left"
                          style={{ borderTop: "1px solid var(--joy-palette-divider)" }}
                        >
                          <ProductStatusBar status={status} />
                          <div className="min-w-0 flex-1">
                            <Typography level="title-md" className="truncate" sx={{ color: "var(--joy-palette-text-primary)" }}>
                              {row.name}
                            </Typography>
                            <Mono>
                              <Typography level="body-sm" className="normal-case" sx={{ color: "var(--joy-palette-text-tertiary)" }}>
                                {row.expiryDate}
                              </Typography>
                            </Mono>
                          </div>
                          <Typography
                            level="title-md"
                            className="shrink-0"
                            sx={{
                              color: isLowStock(Number(row.stockLabel))
                                ? "var(--joy-palette-danger-solidBg)"
                                : "var(--joy-palette-text-primary)",
                            }}
                          >
                            {row.stockLabel} <span className="text-sm font-normal">{t("pcs")}</span>
                          </Typography>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
          <div className="p-4">
            <Button
              startDecorator={<Plus size={16} />}
              onClick={() => navigate({ to: "/app/add-product" })}
              variant="solid"
              size="lg"
              className="w-full rounded-2xl"
            >
              {t("add-product")}
            </Button>
          </div>
        </div>
      </Sheet>
    </div>
  );
};
