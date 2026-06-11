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

export default function ComboBox({
  options,
  placeholder,
  label,
  className = "filter-group",
  inputClassName = "input-field",
  value,
  onChange,
}: ComboBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  // searchText is only what the user types to narrow the list.
  // It is reset to "" whenever the dropdown opens or a selection is made.
  const [searchText, setSearchText] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchText("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter only when the user is actively typing
  const filteredOptions =
    searchText === ""
      ? options
      : options.filter((opt) =>
          opt.toLowerCase().includes(searchText.toLowerCase())
        );

  const handleOpen = () => {
    setSearchText(""); // clear search so all options show
    setIsOpen(true);
  };

  const handleInputChange = (val: string) => {
    setSearchText(val);
    // If user clears back to "", treat as selecting empty (pass to parent)
    if (onChange && val === "") onChange("");
    if (!isOpen) setIsOpen(true);
  };

  const handleOptionSelect = (opt: string) => {
    if (onChange) onChange(opt);
    setSearchText("");
    setIsOpen(false);
  };

  // What to show in the input box:
  // • while open and user is typing → show searchText
  // • otherwise → show the selected value (or empty)
  const displayValue = isOpen ? searchText : (value ?? "");

  return (
    <div className={`${className} custom-combobox`} ref={wrapperRef}>
      {label && <label>{label}</label>}
      <div style={{ position: "relative", width: "100%" }}>
        <input
          type="text"
          className={inputClassName}
          placeholder={placeholder}
          value={displayValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onClick={handleOpen}
          style={{ paddingRight: "2rem" }}
          readOnly={!isOpen}   /* prevent keyboard on non-focused state */
          onFocus={handleOpen}
        />
        <ChevronDown
          size={18}
          style={{
            position: "absolute",
            right: "0.75rem",
            top: "50%",
            transform: `translateY(-50%) rotate(${isOpen ? "180deg" : "0"})`,
            color: "var(--text-muted)",
            pointerEvents: "none",
            transition: "transform 0.2s",
          }}
        />
      </div>

      {isOpen && (
        <ul className="dropdown-list" style={{ maxHeight: "220px", overflowY: "auto" }}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <li
                key={opt}
                className={`dropdown-item${opt === value ? " selected" : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault(); // prevent input blur before select
                  handleOptionSelect(opt);
                }}
              >
                {opt}
              </li>
            ))
          ) : (
            <li className="dropdown-item" style={{ color: "var(--text-muted)" }}>
              Không tìm thấy kết quả
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
