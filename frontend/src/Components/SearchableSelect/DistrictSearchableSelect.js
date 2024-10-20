import React, { useState, useRef, useEffect } from 'react';

const DistrictSearchableSelect = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Search...",
  id,
  label,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);
  
  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.district_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get display value
  const selectedOption = options.find(option => option.district_name === value);
  const displayValue = selectedOption ? selectedOption.district_name : '';

  return (
    <div className="form-group" ref={wrapperRef}>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <div className="position-relative">
        <div
          className="form-select shadow-sm d-flex justify-content-between align-items-center"
          onClick={() => setIsOpen(!isOpen)}
          style={{ cursor: 'pointer' }}
        >
          <span className={!displayValue ? 'text-muted' : ''}>
            {displayValue || 'Select'}
          </span>
          <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'}`}></i>
        </div>
        
        {isOpen && (
          <div className="position-absolute w-100 mt-1 shadow bg-white border rounded z-3">
            <div className="p-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`px-3 py-2 cursor-pointer ${
                      option.district_name === value ? 'bg-light' : ''
                    }`}
                    onClick={() => {
                      onChange(option.district_name);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => e.target.classList.add('bg-light')}
                    onMouseLeave={(e) => 
                      option.district_name !== value && e.target.classList.remove('bg-light')
                    }
                  >
                    {option.district_name}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-muted">No results found</div>
              )}
            </div>
          </div>
        )}
        
        {/* Hidden input for form validation */}
        <input
          type="hidden"
          id={id}
          value={value}
          required={required}
        />
      </div>
    </div>
  );
};

export default DistrictSearchableSelect;