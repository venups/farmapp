import React, { InputHTMLAttributes, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (value: string) => void;
  className?: string;
}

export default function SearchInput({ value, onChange, onSubmit, className = '', ...props }: SearchInputProps) {
  const [searchValue, setSearchValue] = React.useState(value || '');
  const [debouncedValue, setDebouncedValue] = React.useState(value || '');

   useEffect(() => {
     setSearchValue(value ? String(value) : '');
   }, [value]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  useEffect(() => {
    if (onSubmit) {
      onSubmit(debouncedValue);
    }
  }, [debouncedValue, onSubmit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

   const handleClear = () => {
     setSearchValue('');
   };

  return (
    <div className="relative">
      <Search className="absolute inset-y-0 left-3 flex items-center w-5 h-5 text-slate-400" />
       <input
         type="text"
         value={searchValue}
         onChange={handleChange}
         className={`w-full pl-10 pr-10 py-2.5 rounded-lg border bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
           searchValue ? 'border-indigo-500' : 'border-slate-600'
         } ${className}`}
       />
      {searchValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-white transition-colors focus:outline-none"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
