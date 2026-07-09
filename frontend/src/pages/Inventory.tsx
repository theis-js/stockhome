import { useEffect, useState } from "react";
import { Avatar, Button, Checkbox, Chip, CircularProgress, Sheet, Table, Typography, } from "@mui/joy";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteSelectedProducts, getProducts } from "../utils/api/products";
import { formatDate } from "../utils/uxFncs";
import Cookies from "js-cookie";
import type { AlertInterface, ProductRow } from "../misc/interfaces";
import type { ApiError } from "../utils/api/apiError";
import CategoryIcon from "@mui/icons-material/category";
import { MyAlert } from "../components/MyAlert.tsx";

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

  const rows: ProductRow[] = (productsData ?? []).map(
    (product: any, index: number) => ({
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
      refillDate: formatDate(product?.bottling_date),
    }),
  );

  const [selected, setSelected] = useState<readonly string[]>([]);

  const { mutate: deleteSelection, isPending: isDeleting } = useMutation({
    mutationFn: (values: string[]) => deleteSelectedProducts(values),
    onSuccess: () => {
      setSelected([]);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: showError,
  });

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(rows.map((row) => row.id));
      return;
    }
    setSelected([]);
  };

  const handleClick = (_event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  return (
    <>
      <Typography level="h2">{t("inventory")}</Typography>
      <Typography level="body-lg">{t("inventory-subtitle")}</Typography>
      <div className="mt-4 flex items-center gap-3">
        <Button
          startDecorator={<AddIcon />}
          onClick={() => navigate({ to: "/app/add-product" })}
          variant="solid"
        >
          {t("add")}
        </Button>
        {productsIsLoading && <CircularProgress size="sm" />}
      </div>
      {alert.isAlert && (
        <MyAlert type={alert.type} header={alert.header} text={alert.text} />
      )}

      <Sheet
        variant="outlined"
        className="mt-6 flex min-h-0 w-full max-w-full flex-col overflow-hidden rounded-2xl shadow-sm sm:h-[calc(100vh-260px)]"
        sx={{
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.surface",
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{
            borderBottom: "1px solid var(--joy-palette-divider)",
            color: "var(--joy-palette-text-secondary)",
          }}
        >
          <Typography level="body-lg" fontWeight="bold">
            {t("inventory")}
          </Typography>
          <Button
            size="sm"
            color="danger"
            variant="solid"
            disabled={selected.length === 0 || isDeleting}
            onClick={() => deleteSelection([...selected])}
          >
            Delete
          </Button>
        </div>
        <div className="flex-1 overflow-auto">
          <Table
            aria-labelledby="tableTitle"
            stickyHeader
            stripe="odd"
            variant="plain"
            hoverRow
            className="w-full"
            sx={{
              tableLayout: "fixed",
              color: "var(--joy-palette-text-secondary)",
              "--TableCell-headBackground":
                "var(--joy-palette-background-level1)",
              "& thead": {
                position: "sticky",
                top: 0,
                zIndex: 3,
                backgroundColor: "var(--joy-palette-background-level1)",
              },
              "& thead tr": {
                backgroundColor: "var(--joy-palette-background-level1)",
              },
              "& thead th": {
                zIndex: 2,
                backgroundColor: "var(--joy-palette-background-level1)",
                backgroundImage: "none",
                color: "var(--joy-palette-text-secondary)",
              },
              "& thead th:nth-child(1)": {
                width: "44px",
              },
              "& thead th:nth-child(2)": {
                width: "22%",
                minWidth: "160px",
              },
              "& thead th:nth-child(3)": {
                width: "9%",
                minWidth: "70px",
              },
              "& thead th:nth-child(4)": {
                width: "12%",
                minWidth: "90px",
              },
              "& thead th:nth-child(5)": {
                width: "17%",
                minWidth: "120px",
              },
              "& thead th:nth-child(6)": {
                width: "13%",
                minWidth: "100px",
              },
              "& thead th:nth-child(7)": {
                width: "13%",
                minWidth: "100px",
              },
              "& thead th:nth-child(8)": {
                width: "14%",
                minWidth: "100px",
              },
              "& tr > *:nth-child(n+4)": { textAlign: "left" },
              "& tbody tr": {
                borderTop: "1px solid var(--joy-palette-divider)",
              },
            }}
          >
            <thead>
              <tr>
                <th className="px-2 py-4">
                  <Checkbox
                    checked={rows.length > 0 && selected.length === rows.length}
                    indeterminate={
                      selected.length > 0 && selected.length < rows.length
                    }
                    onChange={handleSelectAllClick}
                    slotProps={{ input: { "aria-label": "select all" } }}
                    sx={{ verticalAlign: "sub" }}
                  />
                </th>
                <th className="px-3 py-4">{t("product-name")}</th>
                <th className="px-3 py-4">{t("price")}</th>
                <th className="px-3 py-4">{t("stock")}</th>
                <th className="px-3 py-4">{t("storage-place")}</th>
                <th className="px-3 py-4">{t("expiry-date")}</th>
                <th className="px-3 py-4">{t("bottling-date")}</th>
                <th className="px-3 py-4 text-right">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const isItemSelected = selected.includes(row.id);
                const labelId = `inventory-checkbox-${index}`;
                return (
                  <tr
                    key={row.id}
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                  >
                    <th scope="row" className="px-2 py-5">
                      <Checkbox
                        checked={isItemSelected}
                        slotProps={{ input: { "aria-labelledby": labelId } }}
                        sx={{ verticalAlign: "top" }}
                      />
                    </th>
                    <th
                      id={labelId}
                      scope="row"
                      className="px-3 py-5 overflow-hidden"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar size="lg" variant="soft" className="shrink-0">
                          <CategoryIcon />
                        </Avatar>
                        <div className="min-w-0">
                          <Typography
                            level="title-md"
                            className="truncate"
                            sx={{ color: "var(--joy-palette-text-primary)" }}
                          >
                            {row.name}
                          </Typography>
                          <Typography
                            level="body-sm"
                            className="truncate"
                            sx={{ color: "var(--joy-palette-text-tertiary)" }}
                          >
                            {row.description}
                          </Typography>
                        </div>
                      </div>
                    </th>
                    <td className="px-3 py-5 overflow-hidden">
                      <Typography level="title-md" className="truncate">
                        {row.price}
                      </Typography>
                      <Typography
                        level="body-sm"
                        className="truncate"
                        sx={{ color: "var(--joy-palette-neutral-400)" }}
                      >
                        {Cookies.get("currency")}
                      </Typography>
                    </td>
                    <td className="px-3 py-5 overflow-hidden">
                      <Chip
                        variant="soft"
                        color="neutral"
                        size="lg"
                        className="max-w-full px-3"
                      >
                        <span className="truncate">{row.stock}</span>
                      </Chip>
                    </td>
                    <td className="px-3 py-5 overflow-hidden">
                      <Typography level="title-md" className="truncate">
                        {row.location}
                      </Typography>
                      <Typography
                        level="body-sm"
                        className="truncate"
                        sx={{ color: "var(--joy-palette-text-tertiary)" }}
                      >
                        {row.locationDetail}
                      </Typography>
                    </td>
                    <td className="px-3 py-5 overflow-hidden">
                      <Typography level="title-md" className="truncate">
                        {row.expiryDate}
                      </Typography>
                    </td>
                    <td className="px-3 py-5 overflow-hidden">
                      <Typography level="title-md" className="truncate">
                        {row.refillDate}
                      </Typography>
                    </td>
                    <td className="px-3 py-5 text-right">
                      <Button
                        onClick={() =>
                          navigate({
                            to: `/app/view-product?product=${row.uuid}`,
                          })
                        }
                        variant="outlined"
                        size="sm"
                      >
                        {t("details")}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </Sheet>
    </>
  );
};
