import React, { useState, useEffect, useRef } from "react";
import type { ForwardedRef } from "react";
import TableBasic, { type columnDefinition } from "../../components/TableBasic";
import DatePicker, { registerLocale } from "react-datepicker";
import Select from "react-select";
import type { GroupBase } from "react-select";
import { es } from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../context/AuthContext";
import type { SelectInstance } from "react-select";
import {
  getAllInventory,
  deleteInventory,
  type InventoryItem,
} from "../../services/InventoryService";
import { confirmDeleteAlert, succesAlert, errorAlert } from "../../js/alerts";
import { isSameMonth, parseISO, isBefore, startOfDay, isValid, isEqual } from "date-fns";

registerLocale("es", es);

interface CustomInputProps {
  value?: string;
  onClick?: () => void;
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ value, onClick }, ref: ForwardedRef<HTMLInputElement>) => (
    <input
      className="form-control"
      onClick={onClick}
      value={value}
      readOnly
      ref={ref}
      placeholder="Seleccione un mes"
    />
  )
);

type FilterOption = {
  label: string;
  value: string;
  type: "producto" | "categoria";
  category: string;
};


const InventoryPage = () => {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showExpiredOnly, setShowExpiredOnly] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<{
    type: "producto" | "categoria";
    value: string;
  } | null>(null);
  const selectRef = useRef<SelectInstance<FilterOption>>(null);

  const { hasAuthority } = useAuth();

  useEffect(() => {
    getAllInventory()
      .then((data) => setInventoryData(data))
      .catch((err) => {
        console.error("Error cargando inventario:", err);
        errorAlert("No se pudo cargar el inventario.");
      });
  }, []);
  console.log(inventoryData);
  const handleDelete = async (id: number, name: string) => {
    const result = await confirmDeleteAlert(name);
    if (!result.isConfirmed) return;

    try {
      await deleteInventory(id);
      setInventoryData((prev) => prev.filter((item) => item.id !== id));
      succesAlert("Eliminado", "El producto fue eliminado correctamente.");
    } catch (err) {
      console.error("Error al eliminar inventario:", err);
      errorAlert("No se pudo eliminar el producto.");
    }
  };

  const toggleRow = (id: number) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedRows(newSelection);
  };


  const selectAll = (isSelected: boolean) => {
    setSelectedRows(
      isSelected ? new Set(filteredData.map((i) => i.id)) : new Set()
    );
  };

  const formatDate = (isoString: string | null): string => {
    if (!isoString) return "N/A";
    const [year, month, day] = isoString.split("-");
    return `${day}/${month}/${year}`;
  };

  const filteredData = inventoryData.filter((item) => {
    const now = startOfDay(new Date());
    const expiration = item.expirationDate ? parseISO(item.expirationDate) : null;

    const isExpired =
      expiration !== null &&
      isValid(expiration) &&
      (isBefore(expiration, now) || isEqual(expiration, now));

    const matchExpired = showExpiredOnly ? isExpired : true;

    const matchFilter = !showExpiredOnly && selectedFilter
      ? selectedFilter.type === "producto"
        ? item.product.name === selectedFilter.value
        : item.product.category === selectedFilter.value
      : true;

    const matchDate = !showExpiredOnly && selectedDate
      ? expiration && isSameMonth(expiration, selectedDate)
      : true;

    return matchExpired && matchFilter && matchDate;
  });

  const categoryOptions = Array.from(
    new Set(inventoryData.map((item) => item.product?.category ?? "Sin categoría"))
  ).map((cat) => ({
    label: cat,
    value: cat,
    type: "categoria" as const,
    category: cat,
  }));

  const uniqueProductMap = new Map<string, string>();
  inventoryData.forEach((item) => {
    const name = item.product?.name;
    const category = item.product?.category ?? "Sin categoría";
    if (!uniqueProductMap.has(name)) {
      uniqueProductMap.set(name, category);
    }
  });

  const productOptions = Array.from(uniqueProductMap.entries()).map(
    ([name, category]) => ({
      label: name,
      value: name,
      type: "producto" as const,
      category,
    })
  );

  const groupedOptions: GroupBase<{
    label: string;
    value: string;
    type: "producto";
    category: string;
  }>[] = Object.entries(
    productOptions.reduce((groups, option) => {
      if (!groups[option.category]) groups[option.category] = [];
      groups[option.category].push(option);
      return groups;
    }, {} as Record<string, typeof productOptions>)
  )
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, options]) => ({
      label,
      options: options.sort((a, b) => a.label.localeCompare(b.label)),
    }));

  const columns: columnDefinition<InventoryItem>[] = [
    {
      header: "#",
      accessor: () => "",
      Cell: (_item, index) => index + 1,
    },
    {
      header: "Producto",
      accessor: (item) => item.product?.name ?? "Producto no disponible",
    },
    {
      header: "Fecha de Vencimiento",
      accessor: (item) => item.expirationDate ?? "N/A",
      Cell: (item) => formatDate(item.expirationDate),
    },
    {
      header: "Foto",
      accessor: "photoURL",
      Cell: (item) => (
        <img
          src={`http://localhost:8080/${item.photoURL}`}
          alt="Foto proveedor"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      ),
    },
    {
      header: "Acciones",
      accessor: () => "",
      Cell: (item) => (
        <div style={{ display: "flex", gap: "0.25rem", justifyContent: "center" }}>
          {hasAuthority("PERMISSION_PRODUCTOS_VIEW") && (
            <button
              className="btn btn-info btn-sm"
              onClick={() => setSelectedItem(item)}
              title="Ver detalles"
            >
              <i className="bi bi-eye"></i>
            </button>
          )}
          {hasAuthority("PERMISSION_PRODUCTOS_DELETE") && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(item.id, item.product?.name || "Desconocido")}
              title="Eliminar"
            >
              <i className="bi bi-trash"></i>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="container mt-4">
        <h1>Inventario</h1>

        {!showExpiredOnly && (
          <div className="row mb-4">
            <div className="col-md-6">
              <Select
                ref={selectRef}
                options={groupedOptions}
                onChange={(selected) => {
                  if (selected) {
                    const categoryMatch = categoryOptions.find(
                      (opt) => opt.value.toLowerCase() === selected.value.toLowerCase()
                    );
                    if (categoryMatch) {
                      setSelectedFilter({ type: "categoria", value: categoryMatch.value });
                    } else {
                      setSelectedFilter({ type: "producto", value: selected.value });
                    }
                  } else {
                    setSelectedFilter(null);
                  }
                  setSelectedDate(null);
                }}
                isClearable
                placeholder="Buscar producto o categoría"
                filterOption={(option, inputValue) => {
                  const input = (inputValue ?? "").toLowerCase();
                  const label = (option.label ?? "").toLowerCase();
                  const category = (option.data?.category ?? "").toLowerCase();
                  return label.includes(input) || category.includes(input);
                }}

              />
            </div>
          </div>
        )}

        {!showExpiredOnly && selectedFilter && (
          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label">Filtrar por fecha de vencimiento:</label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                locale="es"
                customInput={<CustomInput />}
              />
            </div>
          </div>
        )}

        <div className="mb-3">
          {!showExpiredOnly && (
            <button
              className="btn btn-secondary me-2"
              onClick={() => {
                setSelectedFilter(null);
                setSelectedDate(null);
                setShowExpiredOnly(false);
                if (selectRef.current) {
                  selectRef.current.clearValue();
                }
              }}
            >
              Limpiar
            </button>
          )}

          <button
            className={`btn ${showExpiredOnly ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => {
              setShowExpiredOnly((prev) => !prev);
              setSelectedFilter(null);
              setSelectedDate(null);
              if (selectRef.current) {
                selectRef.current.clearValue();
              }
            }}
          >
            {showExpiredOnly ? "Limpiar" : "Vencidos o proximos"}
          </button>
        </div>

        <p className="mb-4">
          Total de productos: <strong>{filteredData.length}</strong>
        </p>

        <div className="mb-5 p-3 bg-light rounded shadow-sm">
          <TableBasic<InventoryItem>
            data={filteredData}
            columns={columns}
            selectedRows={selectedRows}
            onToggleRow={toggleRow}
            onSelectAll={selectAll}
          />
        </div>
      </div>

      {selectedItem && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalle del Producto</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedItem(null)}
                />
              </div>
              <div className="modal-body">
                <p><strong>Nombre:</strong> {selectedItem.product?.name}</p>
                <p><strong>Categoría:</strong> {selectedItem.product?.category}</p>
                <p><strong>Fecha de vencimiento:</strong> {formatDate(selectedItem.expirationDate)}</p>
                <p><strong>Proveedor:</strong> {selectedItem.product?.supplier?.name}</p>
                <p><strong>ID de compra:</strong> {selectedItem.purchase.id}</p>
                <img
                  src={`http://localhost:8080/${selectedItem.photoURL}`}
                  className="modal-img"
                />
              </div>
              <div className="modal-footer d-flex justify-content-start">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedItem(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          height: "200px",
          backgroundColor: "#f8f9fa",
          marginTop: "2rem",
          padding: "1rem",
        }}
      />
    </>
  );
};

export default InventoryPage;
