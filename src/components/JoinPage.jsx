import React, { useState, useEffect } from 'react';
import { getGathering, joinGathering } from '../lib/gatheringApi';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '30px',
    maxWidth: '500px',
    margin: '0 auto',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '10px',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '15px',
    color: '#666',
    marginBottom: '25px',
    textAlign: 'center',
  },
  infoBox: {
    background: '#f8f9fb',
    padding: '15px',
    borderRadius: '12px',
    marginBottom: '25px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '15px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '12px',
    marginTop: '20px',
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
  loadingText: {
    fontSize: '18px',
    color: '#333',
    textAlign: 'center',
    padding: '40px 20px',
  },
  errorText: {
    fontSize: '18px',
    color: '#e74c3c',
    textAlign: 'center',
    padding: '40px 20px',
  },
};

const JoinPage = ({ shortId, userName, onJoinSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [gathering, setGathering] = useState(null);
  const [error, setError] = useState(null);

  const [name, setName] = useState(userName || '');
  const [location, setLocation] = useState('');
  const [transportMode, setTransportMode] = useState('開車');
  const [selectedDates, setSelectedDates] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadGathering();
  }, [shortId]);

  const loadGathering = async () => {
    setLoading(true);
    const result = await getGathering(shortId);

    if (result.success) {
      setGathering(result.gathering);
    } else {
      setError(result.error || '找不到此聚會');
    }
    setLoading(false);
  };

  const toggleDate = (dateValue) => {
    setSelectedDates(prev =>
      prev.includes(dateValue)
        ? prev.filter(d => d !== dateValue)
        : [...prev, dateValue]
    );
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('請填寫你的名字！');
      return;
    }

    if (!location.trim()) {
      alert('請填寫出發地點！');
      return;
    }

    if (gathering.time_mode === 'date_selection' && selectedDates.length === 0) {
      alert('請至少選擇一個日期！');
      return;
    }

    setSubmitting(true);

    const result = await joinGathering(shortId, {
      name,
      location,
      transportMode,
      availableDates: selectedDates,
    });

    setSubmitting(false);

    if (result.success) {
      onJoinSuccess();
    } else {
      alert('加入失敗：' + result.error);
    }
  };

  // 生成未來 14 天
  const next14Days = Array.from({length: 14}, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      value: date.toISOString().split('T')[0],
      label: formatDate(date)
    };
  });

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.loadingText}>載入中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.errorText}>❌ {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>👋 加入聚會</h2>
        <p style={styles.subtitle}>
          {gathering.creator_name} 邀請你參加
        </p>

        <div style={styles.infoBox}>
          <div style={styles.infoRow}>
            <span>📌 意圖：</span>
            <strong>{gathering.intent}</strong>
          </div>
          <div style={styles.infoRow}>
            <span>⏰ 模式：</span>
            <strong>
              {gathering.time_mode === 'instant' ? '立即聚會' : '日期投票'}
            </strong>
          </div>
          <div style={styles.infoRow}>
            <span>👥 目前人數：</span>
            <strong>{gathering.participants?.length || 0} 人</strong>
          </div>
        </div>

        <h3 style={styles.sectionTitle}>👤 你的名字</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="請輸入你的名字..."
          style={styles.input}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
        />

        {gathering.time_mode === 'date_selection' && (
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

        <button
          style={styles.submitButton}
          onClick={handleSubmit}
          disabled={submitting}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          {submitting ? '加入中...' : '✅ 加入聚會'}
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

export default JoinPage;
