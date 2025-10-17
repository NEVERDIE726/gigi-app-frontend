// src/components/IntentSelector.jsx (字體加大 + 內容置中)

import React from 'react';

const styles = {
  card: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '30px',
    maxWidth: '500px',
    margin: '0 auto',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '600',
    color: 'white',
    marginBottom: '25px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  intentButton: {
    display: 'flex',
    flexDirection: 'column', // 🔥 關鍵：改為垂直佈局
    alignItems: 'center',    // 🔥 關鍵：水平置中
    justifyContent: 'center', // 🔥 關鍵：垂直置中
    width: '100%',
    padding: '24px 20px', // 增加上下內距
    marginBottom: '15px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '15px',
    background: 'rgba(255, 255, 255, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: 'white',
    minHeight: '130px', // 給按鈕一個最小高度
  },
  intentIcon: {
    fontSize: '32px', // 圖標大小
    marginBottom: '10px', // 圖標和標題的間距
  },
  intentTitle: {
    fontSize: '20px', // 🔥 關鍵：標題字體加大
    fontWeight: '600',
    margin: '0 0 8px 0',
    textAlign: 'center',
  },
  intentDesc: {
    fontSize: '15px', // 🔥 關鍵：描述字體加大
    opacity: 0.8,
    margin: 0,
    textAlign: 'center',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    opacity: 0.7,
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
    width: '100%',
    textAlign: 'center',
  },
};

const IntentSelector = ({ onSelectIntent, onBack }) => {
  const handleMouseEnter = (e) => {
    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
    e.currentTarget.style.transform = 'scale(1.03)';
  };
  
  const handleMouseLeave = (e) => {
    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
    e.currentTarget.style.transform = 'scale(1)';
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.sectionTitle}>
        <span>🎯</span> 這次要...？
      </h2>
      
      <button style={styles.intentButton} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => onSelectIntent('接送')}>
        <div style={styles.intentIcon}>🚗</div>
        <div>
          <h3 style={styles.intentTitle}>接送</h3>
          <p style={styles.intentDesc}>我去接人或送人</p>
        </div>
      </button>

      <button style={styles.intentButton} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => onSelectIntent('面交')}>
        <div style={styles.intentIcon}>🤝</div>
        <div>
          <h3 style={styles.intentTitle}>面交</h3>
          <p style={styles.intentDesc}>交易、交換物品</p>
        </div>
      </button>

      <button style={styles.intentButton} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => onSelectIntent('吃喝玩樂')}>
        <div style={styles.intentIcon}>🎉</div>
        <div>
          <h3 style={styles.intentTitle}>吃喝玩樂</h3>
          <p style={styles.intentDesc}>吃飯、喝咖啡、看電影...</p>
        </div>
      </button>

      <button style={styles.intentButton} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => onSelectIntent('找個點')}>
        <div style={styles.intentIcon}>📍</div>
        <div>
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