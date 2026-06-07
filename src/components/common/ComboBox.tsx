"use client";
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface ComboBoxProps {
  options: string[];
  placeholder: string;
  label?: string;
  className?: string;
  inputClassName?: string;
}

export default function ComboBox({ options, placeholder, label, className = "filter-group", inputClassName = "input-field" }: ComboBoxProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
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

  return (
    <div className={`${className} custom-combobox`} ref={wrapperRef}>
      {label && <label>{label}</label>}
      <div style={{position: 'relative', width: '100%'}}>
        <input 
          type="text" 
          className={inputClassName}
          placeholder={placeholder} 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
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
              onClick={() => {
                setQuery(opt);
                setIsOpen(false);
              }}
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
