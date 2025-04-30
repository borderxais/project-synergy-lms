import React, { useState } from 'react';

interface SelectProps {
  options: Array<{ value: string; label: string }>;
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
  allowCustom?: boolean;
}

export function Select({ options, value, onChange, className = '', allowCustom = false }: SelectProps) {
  const [customValue, setCustomValue] = useState('');

  const handleCheckboxChange = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customValue.trim() && !value.includes(customValue.trim())) {
      onChange([...value, customValue.trim()]);
      setCustomValue('');
    }
  };

  // Get custom options (values that aren't in the predefined options)
  const customOptions = value.filter(
    (v) => !options.find((opt) => opt.value === v)
  );

  return (
    <div className={`overflow-y-auto border border-gray-300 rounded-md bg-white ${className}`}>
      <div className="max-h-60 overflow-y-auto">
        {/* Predefined options */}
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-center px-3 py-2.5 cursor-pointer border-b border-gray-100 transition-colors ${value.includes(option.value) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
          >
            <input
              type="checkbox"
              checked={value.includes(option.value)}
              onChange={() => handleCheckboxChange(option.value)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-offset-0"
            />
            <span className="ml-3 text-sm text-gray-900 font-medium">{option.label}</span>
          </label>
        ))}
        
        {/* Custom options */}
        {customOptions.map((customValue) => (
          <label
            key={customValue}
            className={`flex items-center px-3 py-2.5 cursor-pointer border-b border-gray-100 transition-colors bg-blue-50 group`}
          >
            <input
              type="checkbox"
              checked={true}
              onChange={() => handleCheckboxChange(customValue)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-offset-0"
            />
            <span className="ml-3 text-sm text-gray-900 font-medium flex-1">{customValue}</span>
            <span className="text-xs text-gray-500 mr-2 group-hover:text-gray-700">(Custom)</span>
          </label>
        ))}
      </div>
      
      {allowCustom && (
        <form onSubmit={handleCustomSubmit} className="p-2 border-t border-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              placeholder="Add custom interest..."
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!customValue.trim()}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
