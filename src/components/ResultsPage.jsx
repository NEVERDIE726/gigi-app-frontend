// src/components/ResultsPage.jsx

import React, { useState } from 'react'; // 🔥 引入 useState
import Slider from 'react-slick';

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


const ResultsPage = ({ onRestart }) => {
  const [activeIndex, setActiveIndex] = useState(0); // 🔥 新增狀態，追蹤當前滑動索引

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

  const currentResult = mockResults[activeIndex]; // 🔥 根據 activeIndex 取得當前結果

  return (
    <div style={styles.cardContainer}>
      <div style={styles.header}>
        <h2 style={styles.title}>🎯 推薦結果</h2>
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
        {currentResult.times.map((item, index) => ( // 🔥 顯示當前滑動卡片的時間
          <div key={index} style={styles.participantTime}>
            <span>{item.participant}</span>
            <strong>{item.time}</strong>
          </div>
        ))}
      </div>

      <div style={styles.buttonContainer}>
        <button style={styles.secondaryButton} onClick={onRestart}>🔄 重新計算</button>
        <button style={styles.primaryButton} onClick={() => alert('結果已分享！(模擬)')}>📤 分享結果</button>
      </div>
    </div>
  );
};

export default ResultsPage;