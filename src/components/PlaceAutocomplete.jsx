// src/components/PlaceAutocomplete.jsx

import React from 'react';

const styles = {
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.3s',
    boxSizing: 'border-box',
  },
};

const PlaceAutocomplete = ({ value, onInputChange, placeholder }) => {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onInputChange(e.target.value)}
      placeholder={placeholder}
      style={styles.input}
      onFocus={(e) => e.target.style.borderColor = '#764ba2'}
      onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
    />
  );
};

export default PlaceAutocomplete;