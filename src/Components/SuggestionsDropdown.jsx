import React, { useMemo, useCallback } from 'react'

const SuggestionsDropdown = ({ 
  isOpen, 
  suggestions = [], 
  onSelect, 
  query = '',
  icon = 'bi-geo-alt',
  maxHeight = '200px'
}) => {
  const filteredSuggestions = useMemo(() => {
    if (!query.trim()) return suggestions
    return suggestions.filter(item => 
      item.toLowerCase().includes(query.toLowerCase())
    )
  }, [suggestions, query])

  const handleSelect = useCallback((item) => {
    if (onSelect) {
      onSelect(item)
    }
  }, [onSelect])

  const handleKeyDown = useCallback((e, item) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleSelect(item)
    }
  }, [handleSelect])

  if (!isOpen || filteredSuggestions.length === 0) return null

  return (
    <div 
      className="position-absolute bg-white border rounded shadow-sm" 
      style={{
        top: '100%', 
        left: 0, 
        right: 0, 
        zIndex: 1000, 
        maxHeight, 
        overflowY: 'auto'
      }}
      role="listbox"
    >
      {filteredSuggestions.map((item, index) => (
        <div 
          key={index} 
          className="px-3 py-2 border-bottom suggestion-item" 
          style={{
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          onClick={() => handleSelect(item)}
          onMouseDown={(e) => {
            e.preventDefault()
            handleSelect(item)
          }}
          onKeyDown={(e) => handleKeyDown(e, item)}
          tabIndex={0}
          role="option"
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <i className={`bi ${icon} me-2 text-muted`}></i>{item}
        </div>
      ))}
    </div>
  )
}

export default SuggestionsDropdown