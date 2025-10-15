import React from 'react';

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
  intentButton: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '20px',
    marginBottom: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '15px',
    background: '#f8f9fa',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease',
  },
  intentIcon: {
    fontSize: '32px',
    marginRight: '20px',
  },
  intentTextContainer: {
    flexGrow: 1,
  },
  intentTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 5px 0',
  },
  intentDesc: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#667eea',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
  }
};

const IntentSelector = ({ onSelectIntent, onBack }) => {
  const handleMouseEnter = (e) => {
    e.currentTarget.style.borderColor = '#764ba2';
    e.currentTarget.style.transform = 'scale(1.02)';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.borderColor = '#e0e0e0';
    e.currentTarget.style.transform = 'scale(1)';
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.sectionTitle}>🎯 這次要...？</h2>
      
      <button 
        style={styles.intentButton} 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave} 
        onClick={() => onSelectIntent('接送')}
      >
        <div style={styles.intentIcon}>🚗</div>
        <div style={styles.intentTextContainer}>
          <h3 style={styles.intentTitle}>接送</h3>
          <p style={styles.intentDesc}>我去接人或送人</p>
        </div>
      </button>

      <button 
        style={styles.intentButton} 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave} 
        onClick={() => onSelectIntent('面交')}
      >
        <div style={styles.intentIcon}>🤝</div>
        <div style={styles.intentTextContainer}>
          <h3 style={styles.intentTitle}>面交</h3>
          <p style={styles.intentDesc}>交易、交換物品</p>
        </div>
      </button>

      <button 
        style={styles.intentButton} 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave} 
        onClick={() => onSelectIntent('吃喝玩樂')}
      >
        <div style={styles.intentIcon}>🎉</div>
        <div style={styles.intentTextContainer}>
          <h3 style={styles.intentTitle}>吃喝玩樂</h3>
          <p style={styles.intentDesc}>吃飯、喝咖啡、看電影...</p>
        </div>
      </button>

      <button 
        style={styles.intentButton} 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave} 
        onClick={() => onSelectIntent('找個點')}
      >
        <div style={styles.intentIcon}>📍</div>
        <div style={styles.intentTextContainer}>
          <h3 style={styles.intentTitle}>就找個點</h3>
          <p style={styles.intentDesc}>純粹找個方便的地方碰面</p>
        </div>
      </button>

      {onBack && (
        <button style={styles.backButton} onClick={onBack}>
          ← 返回上一步
        </button>
      )}
    </div>
  );
};

export default IntentSelector;