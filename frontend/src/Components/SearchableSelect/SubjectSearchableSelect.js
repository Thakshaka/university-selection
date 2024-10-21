import React, { useState, useRef, useEffect } from 'react';

const SubjectSearchableSelect = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Search...",
  id,
  label,
  required = false,
  disabled = [],
  getOptionLabel = (option) => option.name,
  getOptionValue = (option) => option.id
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search term and disabled status
  const filteredOptions = options.filter(option =>
    getOptionLabel(option).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get display value
  const selectedOption = options.find(option => getOptionLabel(option) === value);
  const displayValue = selectedOption ? getOptionLabel(selectedOption) : '';

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
                autoFocus
              />
            </div>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const isDisabled = disabled.includes(getOptionLabel(option));
                  return (
                    <div
                      key={getOptionValue(option)}
                      className={`px-3 py-2 ${
                        getOptionLabel(option) === value ? 'bg-light' : ''
                      } ${isDisabled ? 'text-muted' : ''}`}
                      onClick={() => {
                        if (!isDisabled) {
                          onChange(getOptionLabel(option));
                          setIsOpen(false);
                          setSearchTerm('');
                        }
                      }}
                      style={{ 
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        backgroundColor: isDisabled ? '#f8f9fa' : undefined
                      }}
                      onMouseEnter={(e) => !isDisabled && e.target.classList.add('bg-light')}
                      onMouseLeave={(e) => 
                        !isDisabled && getOptionLabel(option) !== value && e.target.classList.remove('bg-light')
                      }
                    >
                      {getOptionLabel(option)}
                    </div>
                  );
                })
              ) : (
                <div className="px-3 py-2 text-muted">No results found</div>
              )}
            </div>
          </div>
        )}
        
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

export default SubjectSearchableSelect;