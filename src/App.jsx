// src/App.jsx

import { useState, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import IntentAndTimeSelector from './components/IntentAndTimeSelector';
import CreatorForm from './components/CreatorForm';
import ShareLinkPage from './components/ShareLinkPage';
import ResultsPage from './components/ResultsPage';
import JoinPage from './components/JoinPage';
import { createGathering } from './lib/gatheringApi';

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    },
    header: {
        textAlign: 'center',
        color: 'white',
        marginBottom: '30px'
    },
    title: {
        fontSize: '28px',
        fontWeight: '700',
        margin: '0 0 10px 0'
    },
    subtitle: {
        fontSize: '16px',
        opacity: 0.9,
        margin: 0
    },
    loadingContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    loadingText: {
        fontSize: '20px',
        color: 'white',
        textAlign: 'center',
        padding: '20px'
    },
};

// 主要建立聚會流程組件
function CreateFlow({ userName }) {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState('intent');
    const [selectedIntent, setSelectedIntent] = useState('');
    const [timeMode, setTimeMode] = useState('');
    const [gathering, setGathering] = useState(null);

    const handleIntentAndTimeSelect = ({ intent, timeMode }) => {
        setSelectedIntent(intent);
        setTimeMode(timeMode);
        setCurrentPage('creator');
    };

    const handleCreatorSubmit = async (creatorData) => {
        // 使用 Supabase 建立聚會
        const result = await createGathering(
            {
                intent: selectedIntent,
                timeMode,
                creatorName: userName,
            },
            {
                location: creatorData.location,
                transportMode: creatorData.transportMode,
                availableDates: creatorData.availableDates,
            }
        );

        if (result.success) {
            const newGathering = {
                shortId: result.shortId,
                intent: selectedIntent,
                timeMode,
                location: creatorData.location,
                transportMode: creatorData.transportMode,
                availableDates: creatorData.availableDates,
                creatorName: userName,
            };

            setGathering(newGathering);
            setCurrentPage('share');

            console.log('聚會已建立:', newGathering);
        } else {
            alert('建立聚會失敗：' + result.error);
        }
    };

    const handleRestart = () => {
        setCurrentPage('intent');
        setSelectedIntent('');
        setTimeMode('');
        setGathering(null);
    };

    const getSubtitle = () => {
        switch(currentPage) {
            case 'intent': return '選擇這次聚會的目的';
            case 'creator': return '填寫你的資料';
            case 'share': return '分享連結給朋友';
            case 'results': return '這是為您推薦的最佳方案！';
            default: return '';
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>✨ 嗨，{userName}！</h1>
                <p style={styles.subtitle}>{getSubtitle()}</p>
            </div>

            {currentPage === 'intent' && (
                <IntentAndTimeSelector onNext={handleIntentAndTimeSelect} />
            )}

            {currentPage === 'creator' && (
                <CreatorForm
                    intent={selectedIntent}
                    timeMode={timeMode}
                    onSubmit={handleCreatorSubmit}
                    onBack={() => setCurrentPage('intent')}
                />
            )}

            {currentPage === 'share' && gathering && (
                <ShareLinkPage
                    gathering={gathering}
                    onRestart={handleRestart}
                />
            )}

            {currentPage === 'results' && (
                <ResultsPage onRestart={handleRestart} />
            )}
        </div>
    );
}

// 加入聚會流程組件
function JoinFlow({ userName }) {
    const { shortId } = useParams();
    const navigate = useNavigate();

    const handleJoinSuccess = () => {
        // 加入成功後導向結果頁面
        navigate(`/results/${shortId}`);
    };

    return (
        <JoinPage
            shortId={shortId}
            userName={userName}
            onJoinSuccess={handleJoinSuccess}
        />
    );
}

// App 主組件
function App() {
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const main = async () => {
            try {
                const liff = (await import('@line/liff')).default;
                await liff.init({ liffId: import.meta.env.VITE_LIFF_ID });
                if (liff.isLoggedIn()) {
                    const profile = await liff.getProfile();
                    setUserName(profile.displayName);
                } else {
                    setUserName('訪客');
                }
            } catch (error) {
                console.error("LIFF 初始化失敗:", error);
                setUserName('訪客');
            } finally {
                setLoading(false);
            }
        };
        main();
    }, []);

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loadingText}>載入中...</div>
            </div>
        );
    }

    return (
        <Routes>
            <Route path="/" element={<CreateFlow userName={userName} />} />
            <Route path="/join/:shortId" element={<JoinFlow userName={userName} />} />
            <Route path="/results/:shortId" element={<ResultsPage userName={userName} />} />
        </Routes>
    );
}

export default App;