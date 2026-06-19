import React from 'react';
import { Form } from 'react-bootstrap';

interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ value, onChange, options }) => {
  return (
    <div className="d-flex align-items-center mb-3">
      <label className="me-2 fw-bold">Filtrar por:</label>
      <Form.Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '200px' }}
      >
        <option value="Todos">Todos</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </Form.Select>
    </div>
  );
};

export default CategoryFilter;
