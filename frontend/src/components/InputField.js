import React from 'react';

const InputField = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helperText,
  icon,
  disabled = false
}) => {
  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span style={{ color: '#ea4335', marginLeft: '4px' }}>*</span>}
      </label>
      
      <div style={{ position: 'relative' }}>
        {icon && (
          <i 
            className={icon} 
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#5f6368',
              zIndex: 1
            }}
          ></i>
        )}
        
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="form-input"
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          style={{
            paddingLeft: icon ? '45px' : '16px',
            borderColor: error ? '#ea4335' : '#dadce0',
            background: disabled ? '#f8f9fa' : 'white'
          }}
        />
      </div>
      
      {error && (
        <div style={{
          color: '#ea4335',
          fontSize: '12px',
          marginTop: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}
      
      {helperText && !error && (
        <div style={{
          color: '#5f6368',
          fontSize: '12px',
          marginTop: '4px',
          fontStyle: 'italic'
        }}>
          {helperText}
        </div>
      )}
    </div>
  );
};

export default InputField;