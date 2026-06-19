import React from 'react';

interface DateFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ value, onChange }) => {
  return (
    <div className="mb-3">
      <label htmlFor="dateFilter" className="form-label">
       <label className="me-2 fw-bold">Fecha de Expiracion</label>
      </label>
      <input
        type="date"
        id="dateFilter"
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default DateFilter;
