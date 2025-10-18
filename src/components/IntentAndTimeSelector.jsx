import React, { useState } from 'react';

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
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: 'white',
    marginBottom: '30px',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'white',
    marginBottom: '15px',
    marginTop: '25px',
  },
  intentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
    marginBottom: '25px',
  },
  optionButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '24px 16px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  intentLabel: {
    fontSize: '20px',
    fontWeight: '600',
    margin: 0,
  },
  intentDesc: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.8)',
    margin: 0,
    textAlign: 'center',
  },
  selected: {
    background: 'rgba(255, 255, 255, 0.3)',
    border: '2px solid rgba(255, 255, 255, 0.5)',
    transform: 'scale(1.05)',
  },
  timeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '20px',
  },
  timeButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '25px 15px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center',
  },
  timeIcon: {
    fontSize: '32px',
  },
  timeTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'white',
    margin: '0 0 5px 0',
  },
  timeDesc: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.8)',
    margin: 0,
  },
  nextButton: {
    width: '100%',
    padding: '16px',
    marginTop: '25px',
    background: 'linear-gradient(135deg, #06D6A0 0%, #118AB2 100%)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};

const IntentAndTimeSelector = ({ onNext }) => {
  const [selectedIntent, setSelectedIntent] = useState('');
  const [timeMode, setTimeMode] = useState('');

  const intents = [
    { id: 'pickup', label: '🚗 接送', desc: '接送某人到目的地', value: '接送' },
    { id: 'trade', label: '🤝 面交', desc: '兩人見面交換物品', value: '面交' },
    { id: 'hangout', label: '🎉 吃喝玩樂', desc: '找個地方聚會玩樂', value: '吃喝玩樂' },
    { id: 'meetup', label: '📍 就找個點', desc: '找個方便的見面地點', value: '就找個點' },
  ];

  // 自動跳轉：當意圖和時間都選了就自動執行
  const handleSelection = (intent, time) => {
    const newIntent = intent !== undefined ? intent : selectedIntent;
    const newTime = time !== undefined ? time : timeMode;

    if (intent !== undefined) setSelectedIntent(intent);
    if (time !== undefined) setTimeMode(time);

    if (newIntent && newTime) {
      // 延遲一點點讓使用者看到選擇效果
      setTimeout(() => {
        onNext({ intent: newIntent, timeMode: newTime });
      }, 300);
    }
  };

  const handleButtonHover = (e, isEntering) => {
    if (isEntering) {
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    } else {
      if (!e.currentTarget.classList.contains('selected')) {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
      }
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>🎯 開始使用</h2>

      <h3 style={styles.sectionTitle}>這次要...？</h3>
      <div style={styles.intentGrid}>
        {intents.map(intent => (
          <button
            key={intent.id}
            onClick={() => handleSelection(intent.value, undefined)}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
            className={selectedIntent === intent.value ? 'selected' : ''}
            style={{
              ...styles.optionButton,
              ...(selectedIntent === intent.value ? styles.selected : {})
            }}
          >
            <div style={styles.intentLabel}>{intent.label}</div>
            <div style={styles.intentDesc}>{intent.desc}</div>
          </button>
        ))}
      </div>

      <h3 style={styles.sectionTitle}>⏰ 什麼時候？</h3>

      <div style={styles.timeGrid}>
        <button
          onClick={() => handleSelection(undefined, 'instant')}
          onMouseEnter={(e) => handleButtonHover(e, true)}
          onMouseLeave={(e) => handleButtonHover(e, false)}
          className={timeMode === 'instant' ? 'selected' : ''}
          style={{
            ...styles.timeButton,
            ...(timeMode === 'instant' ? styles.selected : {})
          }}
        >
          <div style={styles.timeIcon}>⚡</div>
          <div>
            <h4 style={styles.timeTitle}>立即/今天</h4>
            <p style={styles.timeDesc}>現在就約！馬上出發</p>
          </div>
        </button>

        <button
          onClick={() => handleSelection(undefined, 'date_selection')}
          onMouseEnter={(e) => handleButtonHover(e, true)}
          onMouseLeave={(e) => handleButtonHover(e, false)}
          className={timeMode === 'date_selection' ? 'selected' : ''}
          style={{
            ...styles.timeButton,
            ...(timeMode === 'date_selection' ? styles.selected : {})
          }}
        >
          <div style={styles.timeIcon}>📅</div>
          <div>
            <h4 style={styles.timeTitle}>選擇日期</h4>
            <p style={styles.timeDesc}>投票找出共同時間</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default IntentAndTimeSelector;
