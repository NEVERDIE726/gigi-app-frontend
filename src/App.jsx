import { useState, useEffect } from 'react';
import { useGoogleMaps } from './components/GoogleMapsLoader';
import PlaceAutocomplete from './components/PlaceAutocomplete';
import IntentSelector from './components/IntentSelector';
import WhereSelector from './components/WhereSelector';

// --- 樣式 ---
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  header: {
    textAlign: 'center',
    color: 'white',
    marginBottom: '30px',
    position: 'relative',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '16px',
    opacity: 0.9,
    margin: 0,
  },
  loginButton: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '8px 16px',
    background: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '20px',
    color: 'white',
    fontSize: '14px',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s',
    zIndex: 1000,
  },
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
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  friendItem: {
    marginBottom: '20px',
    padding: '15px',
    background: '#f8f9fa',
    borderRadius: '12px',
  },
  friendLabel: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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
  },
  addButton: {
    width: '100%',
    padding: '12px',
    background: 'transparent',
    border: '2px dashed #667eea',
    borderRadius: '8px',
    color: '#667eea',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '20px',
    transition: 'all 0.3s',
  },
  calculateButton: {
    width: '100%',
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
  removeButton: {
    padding: '4px 8px',
    background: '#ff4757',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    fontSize: '12px',
    cursor: 'pointer',
    marginLeft: '10px',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  loadingText: {
    fontSize: '20px',
    color: 'white',
    textAlign: 'center',
    padding: '20px',
  },
};

function App() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 修正：頁面流程改為 why → who → where
  const [currentPage, setCurrentPage] = useState('why'); // 'why', 'who', 'where'
  const [selectedIntent, setSelectedIntent] = useState('');
  const [participants, setParticipants] = useState([
    { 
      id: 1, 
      name: '我', 
      location: '', 
      placeData: null,
      transportMode: '開車' 
    },
    { 
      id: 2, 
      name: '參與者 1', 
      location: '', 
      placeData: null,
      transportMode: '捷運' 
    },
  ]);

  const { isLoaded: mapsLoaded, loadError: mapsError } = useGoogleMaps();

  useEffect(() => {
    const main = async () => {
      try {
        const liff = (await import('@line/liff')).default;
        await liff.init({ liffId: import.meta.env.VITE_LIFF_ID });

        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          setUserName(profile.displayName);
          setIsLoggedIn(true);
        } else {
          setUserName('訪客');
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("LIFF 初始化失敗:", error);
        setUserName('訪客');
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    main();
  }, []);

  const handleLogin = async () => {
    try {
      const liff = (await import('@line/liff')).default;
      liff.login();
    } catch (error) {
      console.error('登入失敗：', error);
    }
  };

  const handleInputChange = (id, value) => {
    setParticipants(participants.map(p =>
      p.id === id ? { ...p, location: value, placeData: null } : p
    ));
  };

  const handlePlaceSelect = (id, placeData) => {
    setParticipants(participants.map(p =>
      p.id === id
        ? {
            ...p,
            location: placeData.address || placeData.name || '',
            placeData: placeData,
          }
        : p
    ));
  };

  const handleTransportChange = (id, mode) => {
    setParticipants(participants.map(p =>
      p.id === id ? { ...p, transportMode: mode } : p
    ));
  };

  const addParticipant = () => {
    const newId = participants.length > 0 ? Math.max(...participants.map(p => p.id)) + 1 : 1;
    setParticipants([...participants, {
      id: newId,
      name: `參與者 ${participants.length}`,
      location: '',
      placeData: null,
      transportMode: '捷運'
    }]);
  };

  const removeParticipant = (id) => {
    if (participants.length > 2) {
      setParticipants(participants.filter(p => p.id !== id));
    }
  };

  // Step 1: Why - 選擇意圖後，進入 Who 頁面
  const handleIntentSelect = (intent) => {
    console.log('選擇的意圖是:', intent);
    setSelectedIntent(intent);
    
    if (intent === '吃喝玩樂') {
      alert('提示：「吃喝玩樂」的詳細選項將在下個版本實作！\n目前先直接進入下一步。');
    }
    
    // 進入 Who 頁面
    setCurrentPage('who');
  };

  // Step 2: Who - 輸入參與者後，進入 Where 頁面
  const handleWhoNext = () => {
    const filledLocations = participants.filter(p => p.placeData && p.placeData.location);
    
    if (filledLocations.length < 2) {
      alert('請至少輸入 2 個參與者的完整位置資訊 (需從建議中選擇)！');
      return;
    }

    console.log('參與者資料：', participants);
    
    // 進入 Where 頁面
    setCurrentPage('where');
  };

  // Step 3: Where - 最終計算
  const handleFinalCalculate = (whereData) => {
    console.log('最終資料：', {
      participants,
      intent: selectedIntent,
      whereData,
    });

    let message = '🎉 收集完成！準備計算中間點！\n\n';
    message += `🎯 目的：${selectedIntent}\n\n`;
    message += `📍 參與者：\n`;
    participants
      .filter(p => p.placeData)
      .forEach(p => {
        message += `  • ${p.name}: ${p.location} (${p.transportMode})\n`;
      });
    
    if (whereData.hasDestination) {
      message += `\n📍 目的地：${whereData.destination}\n`;
      message += `\n💡 系統將計算每個人到目的地的交通時間`;
    } else {
      message += `\n💡 系統將推薦最公平的會合點`;
    }

    alert(message);
  };

  if (loading || (!mapsLoaded && !mapsError)) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>
          {loading ? '載入中...' : '正在載入地圖元件...'}
        </div>
      </div>
    );
  }

  if (mapsError) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>
          ⚠️ 地圖載入失敗：{mapsError.message || '請檢查您的網路連線和 Google Maps API 設定。'}
          <p style={{fontSize: '14px', marginTop: '10px'}}>
             請確認以下事項：<br/>
             1. .env 檔案中的 VITE_GOOGLE_MAPS_API_KEY 是否正確。<br/>
             2. Google Cloud Console 中 gigi-app 專案的 Maps JavaScript API 和 Places API 是否已啟用。<br/>
             3. API 金鑰的應用程式限制（HTTP 參照網址）是否已包含 localhost:5173/*。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {!isLoggedIn && (
        <button 
          style={styles.loginButton}
          onClick={handleLogin}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          🔐 登入
        </button>
      )}

      <div style={styles.header}>
        <h1 style={styles.title}>✨ 嗨，{userName}！</h1>
        <p style={styles.subtitle}>
          {currentPage === 'why' 
            ? '選擇這次聚會的目的'
            : currentPage === 'who'
            ? '輸入大家的位置，找出最佳會合點！'
            : '決定目的地'
          }
        </p>
      </div>

      {/* 步驟 1：Why - 選擇意圖 */}
      {currentPage === 'why' && (
        <IntentSelector 
          onSelectIntent={handleIntentSelect}
          onBack={null} // 第一步沒有返回
        />
      )}

      {/* 步驟 2：Who - 輸入參與者 */}
      {currentPage === 'who' && (
        <div style={styles.card}>
          <div style={styles.sectionTitle}>
            📍 誰要參加？
          </div>

          {participants.map((participant) => (
            <div key={participant.id} style={styles.friendItem}>
              <div style={styles.friendLabel}>
                👤 {participant.name}
                {participants.length > 2 && participant.id !== 1 && (
                  <button 
                    style={styles.removeButton}
                    onClick={() => removeParticipant(participant.id)}
                  >
                    移除
                  </button>
                )}
              </div>
              
              <PlaceAutocomplete
                value={participant.location}
                onInputChange={(value) => handleInputChange(participant.id, value)}
                onSelectPlace={(placeData) => handlePlaceSelect(participant.id, placeData)}
                placeholder="例如：台北車站、信義區市政府..."
                style={styles.input}
              />

              <div style={{ marginTop: '10px' }}>
                <select
                  value={participant.transportMode}
                  onChange={(e) => handleTransportChange(participant.id, e.target.value)}
                  style={{
                    ...styles.input,
                    marginTop: '8px',
                  }}
                >
                  <option value="開車">🚗 開車</option>
                  <option value="捷運">🚇 捷運</option>
                  <option value="公車">🚌 公車</option>
                  <option value="機車">🛵 機車</option>
                  <option value="步行">🚶 步行</option>
                  <option value="計程車">🚕 計程車/網約車</option>
                </select>
              </div>
            </div>
          ))}

          <button 
            style={styles.addButton}
            onClick={addParticipant}
          >
            + 新增更多人
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
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
                transition: 'all 0.2s',
              }}
              onClick={() => setCurrentPage('why')}
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
              style={{
                flex: 2,
                ...styles.calculateButton,
              }}
              onClick={handleWhoNext}
            >
              下一步 →
            </button>
          </div>
        </div>
      )}

      {/* 步驟 3：Where - 選擇目的地 */}
      {currentPage === 'where' && (
        <WhereSelector 
          selectedIntent={selectedIntent}
          onBack={() => setCurrentPage('who')}
          onCalculate={handleFinalCalculate}
        />
      )}
    </div>
  );
}

export default App;