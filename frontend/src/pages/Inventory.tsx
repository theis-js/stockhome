import { useState } from "react";
import {
  Typography,
  Button,
  CircularProgress,
  Sheet,
  Table,
  Avatar,
  Chip,
  Checkbox,
} from "@mui/joy";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteSelectedProducts, getProducts } from "../utils/api/products";
import { formatDate } from "../utils/uxFncs";
import Cookies from "js-cookie";
import type { ProductRow } from "../misc/interfaces";

export const InventoryPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: productsData, isLoading: productsIsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const rows: ProductRow[] = (productsData ?? []).map(
    (product: any, index: number) => ({
      id: String(product?.uuid ?? index),
      uuid: String(product?.uuid ?? ""),
      name: product?.name ?? t("product-name"),
      description: product?.description ?? "",
      imageUrl: product?.picture ?? undefined,
      price: product?.price ? String(product.price) : "-",
      stock: `${product?.amount ?? 0} ${t("pcs")}`,
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

      <Sheet
        variant="outlined"
        className="mt-6 flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/80 shadow-sm sm:h-[calc(100vh-260px)]"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 text-slate-700">
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
            className="min-w-240 text-slate-700"
            sx={{
              "--TableCell-headBackground":
                "var(--joy-palette-background-surface)",
              "& thead": {
                position: "sticky",
                top: 0,
                zIndex: 3,
                backgroundColor: "rgb(248 250 252)",
              },
              "& thead tr": {
                backgroundColor: "rgb(248 250 252)",
              },
              "& thead th:nth-child(2)": {
                width: "40%",
              },
              "& thead th:nth-child(3)": {
                width: "14%",
              },
              "& thead th": {
                zIndex: 2,
                backgroundColor: "rgb(248 250 252)",
                backgroundImage: "none",
              },
              "& tr > *:nth-child(n+4)": { textAlign: "left" },
            }}
          >
            <thead>
              <tr className="text-slate-600">
                <th className="px-4 py-4">
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
                <th className="px-6 py-4">{t("product-name")}</th>
                <th className="px-6 py-4">{t("price")}</th>
                <th className="px-6 py-4">{t("stock")}</th>
                <th className="px-6 py-4">{t("storage-place")}</th>
                <th className="px-6 py-4">{t("expiry-date")}</th>
                <th className="px-6 py-4">{t("bottling-date")}</th>
                <th className="px-6 py-4 text-right">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const isItemSelected = selected.includes(row.id);
                const labelId = `inventory-checkbox-${index}`;
                return (
                  <tr
                    key={row.id}
                    className="border-t border-slate-200"
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                  >
                    <th scope="row" className="px-4 py-5">
                      <Checkbox
                        checked={isItemSelected}
                        slotProps={{ input: { "aria-labelledby": labelId } }}
                        sx={{ verticalAlign: "top" }}
                      />
                    </th>
                    <th id={labelId} scope="row" className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <Avatar size="lg" variant="soft" src={row.imageUrl} />
                        <div className="min-w-0">
                          <Typography
                            level="title-md"
                            className="text-slate-900"
                          >
                            {row.name}
                          </Typography>
                          <Typography
                            level="body-sm"
                            className="text-slate-500"
                          >
                            {row.description}
                          </Typography>
                        </div>
                      </div>
                    </th>
                    <td className="px-6 py-5">
                      <Typography level="title-md">{row.price}</Typography>
                      <Typography level="body-sm" className="text-slate-400">
                        {Cookies.get("currency")}
                      </Typography>
                    </td>
                    <td className="px-6 py-5">
                      <Chip
                        variant="soft"
                        color="neutral"
                        size="lg"
                        className="px-3"
                      >
                        {row.stock}
                      </Chip>
                    </td>
                    <td className="px-6 py-5">
                      <Typography level="title-md">{row.location}</Typography>
                      <Typography level="body-sm" className="text-slate-500">
                        {row.locationDetail}
                      </Typography>
                    </td>
                    <td className="px-6 py-5">
                      <Typography level="title-md">{row.expiryDate}</Typography>
                    </td>
                    <td className="px-6 py-5">
                      <Typography level="title-md">{row.refillDate}</Typography>
                    </td>
                    <td className="px-6 py-5 text-right">
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
