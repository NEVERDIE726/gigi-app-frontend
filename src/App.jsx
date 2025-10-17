// src/App.jsx

import { useState, useEffect, useCallback } from 'react';
import IntentSelector from './components/IntentSelector';
import WhereSelector from './components/WhereSelector';
import ParticipantInput from './components/ParticipantInput';
import ResultsPage from './components/ResultsPage';

const styles = {
    container: { minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
    header: { textAlign: 'center', color: 'white', marginBottom: '30px', position: 'relative' },
    title: { fontSize: '28px', fontWeight: '700', margin: '0 0 10px 0' },
    subtitle: { fontSize: '16px', opacity: 0.9, margin: 0, minHeight: '20px' },
    loginButton: { position: 'fixed', top: '20px', right: '20px', padding: '8px 16px', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '20px', color: 'white', fontSize: '14px', cursor: 'pointer', zIndex: 1000 },
    card: { background: 'white', borderRadius: '20px', padding: '25px', maxWidth: '500px', margin: '0 auto', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' },
    sectionTitle: { fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '20px' },
    addButton: { width: '100%', padding: '12px', background: 'transparent', border: '2px dashed #667eea', borderRadius: '8px', color: '#667eea', fontSize: '16px', cursor: 'pointer', marginTop: '20px' },
    buttonContainer: { display: 'flex', gap: '10px', marginTop: '20px' },
    backButton: { flex: 1, padding: '15px', background: 'transparent', border: '2px solid #667eea', borderRadius: '12px', color: '#667eea', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
    nextButton: { flex: 2, padding: '15px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '18px', fontWeight: '600', cursor: 'pointer' },
    loadingContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    loadingText: { fontSize: '20px', color: 'white', textAlign: 'center', padding: '20px' },
};

function App() {
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPage, setCurrentPage] = useState('why');
    const [selectedIntent, setSelectedIntent] = useState('');
    const [participants, setParticipants] = useState([
        { id: 1, name: '我', location: '', placeData: null, transportMode: '開車' },
        { id: 2, name: '參與者 1', location: '', placeData: null, transportMode: '大眾運輸 (捷運/公車)' },
    ]);
    const [calculationResults, setCalculationResults] = useState(null);

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
    
    const handleLogin = async () => { /* ... 登入邏輯 ... */ };
    
    const handleParticipantChange = useCallback((updatedParticipant) => {
        setParticipants(prev => prev.map(p => p.id === updatedParticipant.id ? updatedParticipant : p));
    }, []);

    const addParticipant = () => {
        const newId = participants.length > 0 ? Math.max(...participants.map(p => p.id)) + 1 : 1;
        setParticipants(prev => [...prev, { id: newId, name: `參與者 ${prev.length}`, location: '', placeData: null, transportMode: '大眾運輸 (捷運/公車)' }]);
    };

    const removeParticipant = useCallback((id) => {
        setParticipants(prev => { if (prev.length <= 2) return prev; return prev.filter(p => p.id !== id); });
    }, []);

    const handleIntentSelect = (intent) => {
        setSelectedIntent(intent);
        setCurrentPage('who');
    };

    const handleWhoNext = () => {
        const filledLocations = participants.filter(p => p.location && p.location.trim() !== '');
        if (filledLocations.length < 2) {
          alert('請至少為 2 位參與者輸入位置！');
          return;
        }
        setCurrentPage('where');
    };

    const handleFinalCalculate = (whereData) => {
        const finalResults = { participants, intent: selectedIntent, whereData };
        console.log('最終資料收集完成:', finalResults);
        setCalculationResults(finalResults);
        setCurrentPage('results');
    };
    
    if (loading) { 
        return <div style={styles.loadingContainer}><div style={styles.loadingText}>載入中...</div></div>; 
    }

    return (
        <div style={styles.container}>
            {!isLoggedIn && (<button style={styles.loginButton} onClick={handleLogin}>🔐 登入</button>)}
            <div style={styles.header}>
                <h1 style={styles.title}>✨ 嗨，{userName}！</h1>
                <p style={styles.subtitle}>
                    {currentPage === 'why' ? '選擇這次聚會的目的'
                        : currentPage === 'who' ? '輸入大家的位置'
                        : currentPage === 'where' ? '決定目的地'
                        : '這是為您推薦的最佳方案！'}
                </p>
            </div>

            {currentPage === 'why' && (
                <IntentSelector onSelectIntent={handleIntentSelect} onBack={null} />
            )}

            {currentPage === 'who' && (
                <div style={styles.card}>
                    <div style={styles.sectionTitle}>📍 誰要參加？</div>
                    {participants.map((p) => (
                        <ParticipantInput key={p.id} participant={p} onUpdate={handleParticipantChange} onRemove={removeParticipant} canRemove={p.id !== 1 && participants.length > 2} />
                    ))}
                    <button style={styles.addButton} onClick={addParticipant}>+ 新增更多人</button>
                    <div style={styles.buttonContainer}>
                        <button style={styles.backButton} onClick={() => setCurrentPage('why')}>← 上一步</button>
                        <button style={styles.nextButton} onClick={handleWhoNext}>下一步 →</button>
                    </div>
                </div>
            )}

            {currentPage === 'where' && (
                <WhereSelector selectedIntent={selectedIntent} onBack={() => setCurrentPage('who')} onCalculate={handleFinalCalculate} />
            )}

            {currentPage === 'results' && calculationResults && (
                <ResultsPage results={calculationResults} onRestart={() => setCurrentPage('why')} />
            )}
        </div>
    );
}

export default App;