

export interface Resident {
  value: string
  label: string
}

interface ResidentSelectorProps {
  residents: Resident[];
  selectedResident: string
  onResidentChange: (resident: string) => void
  isLoading?: boolean;
}

const ResidentSelector = ({ residents, selectedResident, onResidentChange, isLoading = false }: ResidentSelectorProps) => {
  if (isLoading) {
    return <p>Cargando opciones de residentes...</p>;
  }


  return (
    <>
      <div className="card shadow-sm border-dark-subtle">
        <div className="card-header bg-primary text-white">
          <h5 className="card-title mb-0">
            <i className="bi bi-person-fill me-2"></i>
            Seleccionar Residente
          </h5>
        </div>
        <div className="card-body">
          <select
            className="form-select form-select"
            value={selectedResident}
            onChange={(e) => onResidentChange(e.target.value)}
            required
          >
            <option value="">Selecciona un residente...</option>
            {residents.map((resident) => (
              <option key={resident.value} value={resident.value}>
                {resident.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  )
}
export default ResidentSelector;