import { useState, useEffect } from 'react';

// --- 最終樣式物件 (已包含置中排版) ---
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '30px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
  },
  loading: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  spinner: { width: '50px', height: '50px', border: '5px solid rgba(255,255,255,0.3)', borderTop: '5px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  header: { textAlign: 'center', marginBottom: '40px', width: '100%' },
  title: { fontSize: '32px', color: 'white', margin: '0 0 10px 0', fontWeight: '700' },
  subtitle: { fontSize: '18px', color: 'rgba(255,255,255,0.9)', margin: 0 },
  buttonContainer: { display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px', width: '100%', margin: '0 auto' },
  button: { display: 'flex', alignItems: 'center', padding: '25px', background: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', transition: 'transform 0.2s' },
  icon: { fontSize: '48px', marginRight: '20px' },
  buttonText: { textAlign: 'left' },
  buttonTitle: { margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#333' },
  buttonDesc: { margin: 0, fontSize: '14px', color: '#666' },
  footer: { textAlign: 'center', marginTop: '60px' },
  footerText: { color: 'rgba(255,255,255,0.8)', fontSize: '14px' },
};


function App() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const main = async () => {
      try {
        const liff = (await import('@line/liff')).default;
        
        // ❗️❗️❗️ 這是唯一需要您手動確認的地方 ❗️❗️❗️
        // 請務必將下面的 ID 換成您 LINE 後台那個【唯一正確】的 LIFF ID
        await liff.init({ liffId: '2008272061-50PpGaLb' }); 

        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          setUserName(profile.displayName);
        } else {
          setUserName('訪客');
        }
      } catch (error) {
        console.error(error);
        setUserName('訪客 (發生錯誤)');
      } finally {
        setLoading(false);
      }
    };
    main();
  }, []);

  const handleModeSelect = (mode) => {
    alert(`你選擇了：${mode === 'midpoint' ? '找大家的中間點' : '前往固定點'}`);
  };

  if (loading) {
    return <div style={styles.loading}><div style={styles.spinner}></div></div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>✨ 嗨，{userName}！</h1>
        <p style={styles.subtitle}>想怎麼聚？</p>
      </div>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => handleModeSelect('midpoint')}>
          <div style={styles.icon}>📍</div>
          <div style={styles.buttonText}>
            <h3 style={styles.buttonTitle}>找大家的中間點</h3>
            <p style={styles.buttonDesc}>讓每個人都公平方便</p>
          </div>
        </button>
        <button style={styles.button} onClick={() => handleModeSelect('fixed')}>
          <div style={styles.icon}>🎯</div>
          <div style={styles.buttonText}>
            <h3 style={styles.buttonTitle}>前往一個固定點</h3>
            <p style={styles.buttonDesc}>已經決定好地點了</p>
          </div>
        </button>
      </div>
      <div style={styles.footer}>
        <p style={styles.footerText}>💡 您的 LIFF 應用已完全復活！</p>
      </div>
    </div>
  );
}

export default App;

