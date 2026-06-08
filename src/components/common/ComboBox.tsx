"use client";
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface ComboBoxProps {
  options: string[];
  placeholder: string;
  label?: string;
  className?: string;
  inputClassName?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function ComboBox({ options, placeholder, label, className = "filter-group", inputClassName = "input-field", value, onChange }: ComboBoxProps) {
  const [internalQuery, setInternalQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const query = value !== undefined ? value : internalQuery;
  
  useEffect(() => {
    if (value !== undefined) {
      setInternalQuery(value);
    }
  }, [value]);
  
  const filteredOptions = query === "" 
    ? options 
    : options.filter(opt => opt.toLowerCase().includes(query.toLowerCase()));

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (val: string) => {
    if (onChange) {
      onChange(val);
    } else {
      setInternalQuery(val);
    }
    setIsOpen(true);
  };

  const handleOptionSelect = (opt: string) => {
    if (onChange) {
      onChange(opt);
    } else {
      setInternalQuery(opt);
    }
    setIsOpen(false);
  };

  return (
    <div className={`${className} custom-combobox`} ref={wrapperRef}>
      {label && <label>{label}</label>}
      <div style={{position: 'relative', width: '100%'}}>
        <input 
          type="text" 
          className={inputClassName}
          placeholder={placeholder} 
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onClick={() => setIsOpen(true)}
          style={{paddingRight: '2rem'}}
        />
        <ChevronDown size={18} style={{position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none'}} />
      </div>
      
      {isOpen && (
        <ul className="dropdown-list">
          {filteredOptions.length > 0 ? filteredOptions.map(opt => (
            <li 
              key={opt} 
              className="dropdown-item"
              onClick={() => handleOptionSelect(opt)}
            >
              {opt}
            </li>
          )) : (
            <li className="dropdown-item" style={{color: 'var(--text-muted)'}}>Không tìm thấy kết quả</li>
          )}
        </ul>
      )}
    </div>
  );
}
