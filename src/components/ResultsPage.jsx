// src/components/ResultsPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { getGathering, getCommonDates } from '../lib/gatheringApi';

const styles = {
  cardContainer: {
    background: 'white',
    borderRadius: '20px',
    padding: '25px',
    maxWidth: '500px',
    margin: '0 auto',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    overflow: 'hidden',
  },
  header: { textAlign: 'center', marginBottom: '20px' },
  title: { fontSize: '22px', fontWeight: '700', color: '#333', margin: '0 0 10px 0' },
  
  resultCard: { 
    background: '#f0f4ff', 
    padding: '20px', 
    borderRadius: '15px', 
    textAlign: 'center', 
    border: '2px solid #667eea',
    margin: '0 10px',
    minHeight: '220px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // 🔥 加入過渡動畫
  },
  placeName: { fontSize: '24px', fontWeight: 'bold', color: '#333', margin: '0 0 10px 0' },
  placeInfo: { fontSize: '14px', color: '#555', margin: '5px 0' },

  sectionTitle: { fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '15px', borderBottom: '2px solid #eee', paddingBottom: '10px', marginTop: '30px' },
  
  timeEvaluation: { marginBottom: '25px', padding: '0 10px' },
  participantTime: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '16px', color: '#333', marginBottom: '10px', padding: '10px', background: '#f8f9fa', borderRadius: '8px' },
  
  buttonContainer: { display: 'flex', gap: '10px', marginTop: '20px', padding: '0 10px' },
  secondaryButton: { flex: 1, padding: '15px', background: 'transparent', border: '2px solid #667eea', borderRadius: '12px', color: '#667eea', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  primaryButton: { flex: 2, padding: '15px', background: 'linear-gradient(135deg, #06D6A0 0%, #118AB2 100%)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '18px', fontWeight: '600', cursor: 'pointer' },

  customDots: {
    listStyle: 'none',
    padding: 0,
    margin: '20px 0 0',
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#ccc',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  activeDot: {
    background: '#667eea',
  },
};

// 假推薦結果數據 (現在是三個)
const mockResults = [
  {
    id: 1,
    name: '台北車站 M8 出口',
    rating: 4.5,
    category: '公共地標',
    parking: '附近有多個收費停車場',
    times: [
      { participant: '🚗 我 (八里)', time: '約 25 分鐘' },
      { participant: '🚇 參與者 1 (信義)', time: '約 30 分鐘' },
    ]
  },
  {
    id: 2,
    name: '捷運中山站 4 號出口',
    rating: 4.3,
    category: '商業區',
    parking: '地下停車場，費用較高',
    times: [
      { participant: '🚗 我 (八里)', time: '約 30 分鐘' },
      { participant: '🚇 參與者 1 (信義)', time: '約 28 分鐘' },
    ]
  },
  {
    id: 3,
    name: '西門町徒步區入口',
    rating: 4.2,
    category: '觀光區',
    parking: '周邊停車位緊張',
    times: [
      { participant: '🚗 我 (八里)', time: '約 35 分鐘' },
      { participant: '🚇 參與者 1 (信義)', time: '約 25 分鐘' },
    ]
  },
];


const ResultsPage = ({ onRestart, userName }) => {
  const params = useParams();
  const navigate = useNavigate();
  const shortId = params.shortId;

  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gathering, setGathering] = useState(null);
  const [commonDates, setCommonDates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (shortId) {
      loadGatheringData();
    } else {
      // 如果沒有 shortId，表示是從建立流程來的
      setLoading(false);
    }
  }, [shortId]);

  const loadGatheringData = async () => {
    setLoading(true);

    const result = await getGathering(shortId);
    if (result.success) {
      setGathering(result.gathering);

      // 如果是日期投票模式，取得共同日期
      if (result.gathering.time_mode === 'date_selection') {
        const datesResult = await getCommonDates(shortId);
        if (datesResult.success) {
          setCommonDates(datesResult.commonDates);
        }
      }
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleRestart = () => {
    if (onRestart) {
      onRestart();
    } else {
      navigate('/');
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '30px',
    arrows: false,
    autoplay: false,         // 🔥 不自動播放
    swipeToSlide: true,      // 🔥 手勢滑動更流暢
    adaptiveHeight: true,    // 🔥 自動調整高度
    afterChange: (index) => setActiveIndex(index), // 🔥 滑動後更新 activeIndex
    responsive: [            // 🔥 響應式設計
      {
        breakpoint: 768, // 當螢幕寬度小於 768px 時
        settings: {
          centerPadding: '20px'
        }
      },
      {
        breakpoint: 480, // 當螢幕寬度小於 480px 時
        settings: {
          centerMode: false, // 關閉居中模式，適合小螢幕
          centerPadding: '0px',
        }
      }
    ],
    appendDots: dots => (
      <div style={{ position: 'relative', bottom: '-15px' }}>
        <ul style={styles.customDots}> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div style={{ ...styles.dot, ...(i === activeIndex ? styles.activeDot : {}) }}></div> // 🔥 根據 activeIndex 改變點點樣式
    )
  };

  if (loading) {
    return (
      <div style={styles.cardContainer}>
        <div style={{ textAlign: 'center', padding: '40px' }}>載入中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.cardContainer}>
        <div style={{ textAlign: 'center', padding: '40px', color: '#e74c3c' }}>
          ❌ {error}
        </div>
      </div>
    );
  }

  const currentResult = mockResults[activeIndex];

  return (
    <div style={styles.cardContainer}>
      <div style={styles.header}>
        <h2 style={styles.title}>🎯 推薦結果</h2>
        {gathering && (
          <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>
            {gathering.intent} · {gathering.participants?.length || 0} 人參與
          </p>
        )}
        {gathering && gathering.time_mode === 'date_selection' && (
          <div style={{ marginTop: '15px', padding: '12px', background: '#f0f4ff', borderRadius: '8px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#667eea', marginBottom: '8px' }}>
              📅 共同可用日期
            </div>
            {commonDates.length > 0 ? (
              <div style={{ fontSize: '14px', color: '#333' }}>
                {commonDates.map(date => (
                  <div key={date} style={{ padding: '4px 0' }}>
                    ✓ {formatDate(date)}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '14px', color: '#999' }}>
                目前沒有所有人都可以的日期
              </div>
            )}
          </div>
        )}
      </div>

      <Slider {...settings}>
        {mockResults.map((result) => (
          <div key={result.id}>
            <div style={styles.resultCard}>
              <h3 style={styles.placeName}>{result.name}</h3>
              <p style={styles.placeInfo}>⭐ {result.rating} 分 ({result.category})</p>
              <p style={styles.placeInfo}>🅿️ 停車：{result.parking}</p>
            </div>
          </div>
        ))}
      </Slider>

      <div style={styles.timeEvaluation}>
        <h4 style={styles.sectionTitle}>⏱️ 時間評估</h4>
        {gathering ? (
          gathering.participants?.map((participant, index) => (
            <div key={participant.id} style={styles.participantTime}>
              <span>
                {getTransportIcon(participant.transport_mode)} {participant.name}
              </span>
              <strong>計算中...</strong>
            </div>
          ))
        ) : (
          currentResult.times.map((item, index) => (
            <div key={index} style={styles.participantTime}>
              <span>{item.participant}</span>
              <strong>{item.time}</strong>
            </div>
          ))
        )}
      </div>

      <div style={styles.buttonContainer}>
        <button style={styles.secondaryButton} onClick={handleRestart}>🔄 重新計算</button>
        <button style={styles.primaryButton} onClick={() => alert('結果已分享！(模擬)')}>📤 分享結果</button>
      </div>
    </div>
  );
};

function getTransportIcon(mode) {
  const icons = {
    '開車': '🚗',
    '大眾運輸': '🚇',
    '機車': '🛵',
    '步行': '🚶',
    '計程車/Uber': '🚕',
  };
  return icons[mode] || '🚶';
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = weekdays[date.getDay()];
  return `${month}/${day} (${weekday})`;
}

export default ResultsPage;