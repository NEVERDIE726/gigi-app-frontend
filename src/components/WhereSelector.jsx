import { useState } from 'react';

const styles = {
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '25px',
    maxWidth: '500px',
    margin: '0 auto',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'center',
  },
  optionContainer: {
    marginBottom: '20px',
  },
  radioOption: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    marginBottom: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: '#f8f9fa',
  },
  radioOptionSelected: {
    borderColor: '#667eea',
    background: '#f0f4ff',
  },
  radio: {
    width: '20px',
    height: '20px',
    marginRight: '15px',
    cursor: 'pointer',
  },
  optionText: {
    fontSize: '16px',
    color: '#333',
    margin: 0,
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.3s',
    boxSizing: 'border-box',
    marginTop: '10px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  backButton: {
    flex: 1,
    padding: '15px',
    background: 'transparent',
    border: '2px solid #667eea',
    borderRadius: '12px',
    color: '#667eea',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  calculateButton: {
    flex: 2,
    padding: '15px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    transition: 'transform 0.2s',
  },
};

const WhereSelector = ({ selectedIntent, onBack, onCalculate }) => {
  const [hasDestination, setHasDestination] = useState('no');
  const [destination, setDestination] = useState('');

  const handleCalculate = () => {
    if (hasDestination === 'yes' && !destination.trim()) {
      alert('請輸入目的地！');
      return;
    }

    onCalculate({
      hasDestination: hasDestination === 'yes',
      destination: hasDestination === 'yes' ? destination : null,
    });
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.sectionTitle}>🎯 目的地</h2>
      
      <div style={styles.optionContainer}>
        <label 
          style={{
            ...styles.radioOption,
            ...(hasDestination === 'no' ? styles.radioOptionSelected : {}),
          }}
          onClick={() => setHasDestination('no')}
        >
          <input
            type="radio"
            name="destination"
            value="no"
            checked={hasDestination === 'no'}
            onChange={() => setHasDestination('no')}
            style={styles.radio}
          />
          <div>
            <p style={styles.optionText}>
              <strong>沒有，幫我推薦最佳地點</strong>
            </p>
            <p style={{ fontSize: '14px', color: '#666', margin: '5px 0 0 0' }}>
              系統會找出最公平的會合點
            </p>
          </div>
        </label>

        <label 
          style={{
            ...styles.radioOption,
            ...(hasDestination === 'yes' ? styles.radioOptionSelected : {}),
          }}
          onClick={() => setHasDestination('yes')}
        >
          <input
            type="radio"
            name="destination"
            value="yes"
            checked={hasDestination === 'yes'}
            onChange={() => setHasDestination('yes')}
            style={styles.radio}
          />
          <div style={{ flex: 1 }}>
            <p style={styles.optionText}>
              <strong>有，我們要去：</strong>
            </p>
            {hasDestination === 'yes' && (
              <input
                type="text"
                placeholder="例如：鼎泰豐信義店、台北 101..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                style={styles.input}
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        </label>
      </div>

      <div style={styles.buttonContainer}>
        <button 
          style={styles.backButton}
          onClick={onBack}
          onMouseEnter={(e) => {
            e.target.style.background = '#f0f4ff';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
          }}
        >
          ← 上一步
        </button>

        <button 
          style={styles.calculateButton}
          onClick={handleCalculate}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
        >
          🔍 開始計算！
        </button>
      </div>
    </div>
  );
};

export default WhereSelector;