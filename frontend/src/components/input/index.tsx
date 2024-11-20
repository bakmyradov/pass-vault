import React from "react";
const Input = ({ value, name, type, label, required, onChange }) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-gray-800 text-sm font-bold mb-2"
      >
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete="off"
        required={required}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
  );
};

export default Input;
