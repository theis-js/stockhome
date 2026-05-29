import * as React from "react";
import {
  Typography,
  Button,
  CircularProgress,
  Sheet,
  Table,
  Chip,
  Avatar,
  Box,
  IconButton,
  Checkbox,
  FormControl,
  FormLabel,
  Link,
  Tooltip,
  Select,
  Option,
} from "@mui/joy";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../utils/uxFncs";
import { visuallyHidden } from "@mui/utils";
import { formatDate } from "../utils/uxFncs";

type Order = "asc" | "desc";

type ProductRow = {
  id: string;
  uuid: string;
  name: string;
  description: string;
  imageUrl?: string;
  price: string;
  stock: string;
  stockLabel: string;
  stockStatus: "ok" | "low" | "missing";
  location: string;
  locationDetail: string;
  expiryDate: string;
  refillDate: string;
};

const descendingComparator = <T,>(a: T, b: T, orderBy: keyof T) => {
  const aValue = (a[orderBy] ?? "") as string | number;
  const bValue = (b[orderBy] ?? "") as string | number;
  if (bValue < aValue) {
    return -1;
  }
  if (bValue > aValue) {
    return 1;
  }
  return 0;
};

const getComparator = (order: Order, orderBy: keyof ProductRow) => {
  return order === "desc"
    ? (a: ProductRow, b: ProductRow) => descendingComparator(a, b, orderBy)
    : (a: ProductRow, b: ProductRow) => -descendingComparator(a, b, orderBy);
};

type EnhancedTableHeadProps = {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof ProductRow,
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
};

const EnhancedTableHead = (props: EnhancedTableHeadProps) => {
  const { t } = useTranslation();

  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof ProductRow) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  const headCells: readonly {
    id: keyof ProductRow;
    label: string;
    numeric: boolean;
  }[] = [
    { id: "name", label: t("product-name"), numeric: false },
    { id: "price", label: t("price"), numeric: true },
    { id: "stock", label: t("stock"), numeric: true },
    { id: "location", label: t("storage-place"), numeric: false },
    { id: "expiryDate", label: t("expiry-date"), numeric: false },
    { id: "refillDate", label: t("bottling-date"), numeric: false },
  ];

  return (
    <thead>
      <tr className="bg-slate-50 text-slate-600">
        <th className="px-4 py-4">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            slotProps={{ input: { "aria-label": "select all products" } }}
            sx={{ verticalAlign: "sub" }}
          />
        </th>
        {headCells.map((headCell) => {
          const active = orderBy === headCell.id;
          return (
            <th
              key={headCell.id}
              className="px-6 py-4"
              aria-sort={
                active
                  ? ({ asc: "ascending", desc: "descending" } as const)[order]
                  : undefined
              }
            >
              <Link
                underline="none"
                color="neutral"
                textColor={active ? "primary.plainColor" : undefined}
                component="button"
                onClick={createSortHandler(headCell.id)}
                startDecorator={
                  headCell.numeric ? (
                    <ArrowDownwardIcon
                      sx={[active ? { opacity: 1 } : { opacity: 0 }]}
                    />
                  ) : null
                }
                endDecorator={
                  !headCell.numeric ? (
                    <ArrowDownwardIcon
                      sx={[active ? { opacity: 1 } : { opacity: 0 }]}
                    />
                  ) : null
                }
                sx={{
                  fontWeight: "lg",
                  "& svg": {
                    transition: "0.2s",
                    transform:
                      active && order === "desc"
                        ? "rotate(0deg)"
                        : "rotate(180deg)",
                  },
                  "&:hover": { "& svg": { opacity: 1 } },
                }}
              >
                {headCell.label}
                {active ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </Link>
            </th>
          );
        })}
        <th className="px-6 py-4 text-right">{t("actions")}</th>
      </tr>
    </thead>
  );
};

const EnhancedTableToolbar = ({ numSelected }: { numSelected: number }) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={[
        {
          display: "flex",
          alignItems: "center",
          py: 1,
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          borderTopLeftRadius: "var(--unstable_actionRadius)",
          borderTopRightRadius: "var(--unstable_actionRadius)",
        },
        numSelected > 0 && {
          bgcolor: "background.level1",
        },
      ]}
      className="text-slate-700"
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: "1 1 100%" }} component="div">
          {numSelected} ausgewahlt
        </Typography>
      ) : (
        <Typography level="body-lg" sx={{ flex: "1 1 100%" }} component="div">
          {t("inventory")}
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton size="sm" color="danger" variant="solid">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton size="sm" variant="outlined" color="neutral">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export const InventoryPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const labelDisplayedRows = ({
    from,
    to,
    count,
  }: {
    from: number;
    to: number;
    count: number;
  }) => `${from}-${to} ${t("of")} ${count}`;

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
      price: product?.price ?? "-",
      stock: `${product?.amount ?? 0} Stk.`,
      location: product?.storage_location_name ?? "-",
      locationDetail: "",
      expiryDate: formatDate(product?.expiry_date),
      refillDate: formatDate(product?.bottling_date),
    }),
  );

  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof ProductRow>("name");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof ProductRow,
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((row) => row.id);
      setSelected(newSelected);
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

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (_event: any, newValue: number | null) => {
    setRowsPerPage(parseInt(newValue!.toString(), 10));
    setPage(0);
  };

  const getLabelDisplayedRowsTo = () => {
    if (rows.length === -1) {
      return (page + 1) * rowsPerPage;
    }
    return rowsPerPage === -1
      ? rows.length
      : Math.min(rows.length, (page + 1) * rowsPerPage);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

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
        className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white/80 shadow-sm"
      >
        <EnhancedTableToolbar numSelected={selected.length} />
        <Table
          aria-labelledby="tableTitle"
          hoverRow
          className="min-w-240 text-slate-700"
          sx={{
            "--TableCell-headBackground": "transparent",
            "--TableCell-selectedBackground": (theme) =>
              theme.vars.palette.success.softBg,
            "& thead th:nth-child(1)": {
              width: "40px",
            },
            "& thead th:nth-child(2)": {
              width: "30%",
            },
            "& tr > *:nth-child(n+3)": { textAlign: "left" },
          }}
        >
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
          />
          <tbody>
            {[...rows]
              .sort(getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = selected.includes(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <tr
                    key={row.id}
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    className="border-t border-slate-200"
                    style={
                      isItemSelected
                        ? ({
                            "--TableCell-dataBackground":
                              "var(--TableCell-selectedBackground)",
                            "--TableCell-headBackground":
                              "var(--TableCell-selectedBackground)",
                          } as React.CSSProperties)
                        : {}
                    }
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
                        <div>
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
                        {t("currency")}
                      </Typography>
                    </td>
                    <td className="px-6 py-5">
                      <Chip
                        variant="soft"
                        color={"neutral"}
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
            {emptyRows > 0 && (
              <tr
                style={
                  {
                    height: `calc(${emptyRows} * 40px)`,
                    "--TableRow-hoverBackground": "transparent",
                  } as React.CSSProperties
                }
              >
                <td colSpan={8} aria-hidden />
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={8}>
                <Box
                  className="px-6 py-4 text-slate-600"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    justifyContent: "flex-end",
                  }}
                >
                  <FormControl orientation="horizontal" size="sm">
                    <FormLabel>{t("rows-per-page")}</FormLabel>
                    <Select
                      onChange={handleChangeRowsPerPage}
                      value={rowsPerPage}
                    >
                      <Option value={5}>5</Option>
                      <Option value={10}>10</Option>
                      <Option value={25}>25</Option>
                    </Select>
                  </FormControl>
                  <Typography sx={{ textAlign: "center", minWidth: 120 }}>
                    {labelDisplayedRows({
                      from: rows.length === 0 ? 0 : page * rowsPerPage + 1,
                      to: getLabelDisplayedRowsTo(),
                      count: rows.length === -1 ? -1 : rows.length,
                    })}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      size="sm"
                      color="neutral"
                      variant="outlined"
                      disabled={page === 0}
                      onClick={() => handleChangePage(page - 1)}
                      sx={{ bgcolor: "background.surface" }}
                    >
                      <KeyboardArrowLeftIcon />
                    </IconButton>
                    <IconButton
                      size="sm"
                      color="neutral"
                      variant="outlined"
                      disabled={
                        rows.length !== -1
                          ? page >= Math.ceil(rows.length / rowsPerPage) - 1
                          : false
                      }
                      onClick={() => handleChangePage(page + 1)}
                      sx={{ bgcolor: "background.surface" }}
                    >
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  </Box>
                </Box>
              </td>
            </tr>
          </tfoot>
        </Table>
      </Sheet>
    </>
  );
};
