import React, { useState } from 'react';

const styles = {
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '30px',
    maxWidth: '500px',
    margin: '0 auto',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  },
  title: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '25px',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '12px',
    marginTop: '20px',
  },
  dateGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '6px',
    marginBottom: '15px',
  },
  dateButton: {
    padding: '10px 6px',
    border: '2px solid #e0e0e0',
    borderRadius: '6px',
    background: 'white',
    color: '#333',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  selectedDate: {
    background: '#667eea',
    color: 'white',
    borderColor: '#667eea',
  },
  input: {
    width: '100%',
    padding: '16px',
    fontSize: '18px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    outline: 'none',
    transition: 'border-color 0.3s',
    boxSizing: 'border-box',
    marginBottom: '20px',
  },
  select: {
    width: '100%',
    padding: '16px',
    fontSize: '18px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    outline: 'none',
    transition: 'border-color 0.3s',
    boxSizing: 'border-box',
    marginBottom: '20px',
    background: 'white',
  },
  submitButton: {
    width: '100%',
    padding: '16px',
    marginTop: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  hint: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '12px',
  },
};

const CreatorForm = ({ intent, timeMode, onSubmit, onBack }) => {
  const [location, setLocation] = useState('');
  const [transportMode, setTransportMode] = useState('開車');
  const [selectedDates, setSelectedDates] = useState([]);

  // 生成未來 14 天
  const next14Days = Array.from({length: 14}, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      value: date.toISOString().split('T')[0],
      label: formatDate(date)
    };
  });

  const toggleDate = (dateValue) => {
    setSelectedDates(prev =>
      prev.includes(dateValue)
        ? prev.filter(d => d !== dateValue)
        : [...prev, dateValue]
    );
  };

  const handleSubmit = () => {
    if (!location.trim()) {
      alert('請填寫出發地點！');
      return;
    }

    if (timeMode === 'date_selection' && selectedDates.length === 0) {
      alert('請至少選擇一個日期！');
      return;
    }

    onSubmit({
      location,
      transportMode,
      availableDates: selectedDates
    });
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>
        {timeMode === 'instant' ? '⚡ 立即聚會' : '📅 選擇日期'}
      </h2>

      {/* 日期選擇（只在 date_selection 模式顯示）*/}
      {timeMode === 'date_selection' && (
        <>
          <h3 style={styles.sectionTitle}>📅 你可以的日期</h3>
          <p style={styles.hint}>（可複選，至少選一個）</p>
          <div style={styles.dateGrid}>
            {next14Days.map(day => (
              <button
                key={day.value}
                onClick={() => toggleDate(day.value)}
                style={{
                  ...styles.dateButton,
                  ...(selectedDates.includes(day.value) ? styles.selectedDate : {})
                }}
                onMouseEnter={(e) => {
                  if (!selectedDates.includes(day.value)) {
                    e.currentTarget.style.borderColor = '#667eea';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selectedDates.includes(day.value)) {
                    e.currentTarget.style.borderColor = '#e0e0e0';
                  }
                }}
              >
                {day.label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* 地點和交通（所有模式都要填）*/}
      <h3 style={styles.sectionTitle}>📍 你的出發地點</h3>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="例如：台北市信義區市政府..."
        style={styles.input}
        onFocus={(e) => e.target.style.borderColor = '#667eea'}
        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
      />

      <h3 style={styles.sectionTitle}>🚇 交通方式</h3>
      <select
        value={transportMode}
        onChange={(e) => setTransportMode(e.target.value)}
        style={styles.select}
        onFocus={(e) => e.target.style.borderColor = '#667eea'}
        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
      >
        <option value="開車">🚗 開車</option>
        <option value="大眾運輸">🚇 大眾運輸（捷運/公車）</option>
        <option value="機車">🛵 機車</option>
        <option value="步行">🚶 步行</option>
        <option value="計程車/Uber">🚕 計程車/Uber</option>
      </select>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button
          onClick={onBack}
          style={{
            flex: 1,
            padding: '15px',
            background: 'transparent',
            border: '2px solid #667eea',
            borderRadius: '12px',
            color: '#667eea',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          ← 上一步
        </button>
        <button
          style={{...styles.submitButton, flex: 2, marginTop: 0}}
          onClick={handleSubmit}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          ✅ 開始
        </button>
      </div>
    </div>
  );
};

function formatDate(date) {
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = weekdays[date.getDay()];
  return `${month}/${day} (${weekday})`;
}

export default CreatorForm;
