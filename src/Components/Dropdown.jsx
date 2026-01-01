import React, { useMemo, useCallback } from 'react'

const Dropdown = ({ 
  isOpen, 
  onToggle, 
  value, 
  placeholder, 
  options, 
  onSelect, 
  className = '',
  size = 'md'
}) => {
  const sizeClass = useMemo(() => size === 'sm' ? 'form-select-sm' : '', [size])
  
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggle()
    }
  }, [onToggle])
  
  return (
    <div className="position-relative">
      <div 
        className={`form-select ${sizeClass} d-flex justify-content-between align-items-center ${className}`}
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        style={{
          cursor: 'pointer',
          appearance: 'none',
          backgroundImage: 'none',
          paddingRight: '8px'
        }}
        role="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-truncate">{value || placeholder}</span>
        <i 
          className="bi bi-chevron-right" 
          style={{
            transform: `rotate(${isOpen ? '90deg' : '0deg'})`,
            transition: 'transform 0.3s ease'
          }}
        />
      </div>
      {isOpen && (
        <div className="position-absolute bg-white border rounded shadow-sm w-100" style={{top: '100%', zIndex: 1000}} role="listbox">
          {options.map((option, index) => (
            <div 
              key={index}
              className={`px-3 py-2 border-bottom ${size === 'sm' ? 'small' : ''}`}
              style={{cursor: 'pointer'}}
              onClick={() => onSelect(option.value)}
              role="option"
              tabIndex={0}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dropdown