import React, { useState, useEffect } from 'react';
import { getGathering } from '../lib/gatheringApi';
import { supabase } from '../lib/supabase';

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
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '10px',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '15px',
    color: '#666',
    marginBottom: '30px',
    textAlign: 'center',
  },
  infoBox: {
    background: '#f8f9fb',
    padding: '15px',
    borderRadius: '12px',
    marginBottom: '20px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '15px',
  },
  linkBox: {
    background: '#f0f4ff',
    padding: '15px',
    borderRadius: '12px',
    marginBottom: '15px',
    border: '2px solid #667eea',
  },
  linkLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#667eea',
    marginBottom: '8px',
  },
  linkText: {
    fontSize: '14px',
    color: '#333',
    wordBreak: 'break-all',
    fontFamily: 'monospace',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginBottom: '25px',
  },
  shareButton: {
    flex: 1,
    padding: '15px',
    background: '#06C755',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  copyButton: {
    flex: 1,
    padding: '15px',
    background: 'transparent',
    border: '2px solid #667eea',
    borderRadius: '12px',
    color: '#667eea',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  statusSection: {
    marginTop: '25px',
    paddingTop: '25px',
    borderTop: '2px solid #f0f0f0',
  },
  statusTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '15px',
  },
  participantItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    background: '#f8f9fb',
    borderRadius: '8px',
    marginBottom: '8px',
    fontSize: '15px',
  },
  restartButton: {
    width: '100%',
    padding: '15px',
    marginTop: '20px',
    background: 'transparent',
    border: '2px solid #667eea',
    borderRadius: '12px',
    color: '#667eea',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

const ShareLinkPage = ({ gathering, onRestart }) => {
  const [copied, setCopied] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  const shareLink = `${window.location.origin}/join/${gathering.shortId}`;

  // 載入並監聽參與者變化
  useEffect(() => {
    loadParticipants();

    // 訂閱即時更新
    const channel = supabase
      .channel(`gathering-${gathering.shortId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'participants',
        },
        () => {
          loadParticipants();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gathering.shortId]);

  const loadParticipants = async () => {
    const result = await getGathering(gathering.shortId);
    if (result.success) {
      setParticipants(result.gathering.participants || []);
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (window.liff && window.liff.isInClient()) {
      try {
        await window.liff.shareTargetPicker([
          {
            type: 'text',
            text: `🎉 ${gathering.intent} 聚會邀請\n\n⏰ ${gathering.timeMode === 'instant' ? '立即/今天' : '日期投票中'}\n\n點擊連結加入：\n${shareLink}`
          }
        ]);
      } catch (error) {
        console.error('分享失敗:', error);
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>✅ 已建立！</h2>
      <p style={styles.subtitle}>分享連結給朋友，讓他們加入</p>

      <div style={styles.infoBox}>
        <div style={styles.infoRow}>
          <span>📌 意圖：</span>
          <strong>{gathering.intent}</strong>
        </div>
        <div style={styles.infoRow}>
          <span>⏰ 模式：</span>
          <strong>{gathering.timeMode === 'instant' ? '立即聚會' : '日期投票'}</strong>
        </div>
        <div style={styles.infoRow}>
          <span>📍 你的地點：</span>
          <strong>{gathering.location}</strong>
        </div>
      </div>

      <div style={styles.linkBox}>
        <div style={styles.linkLabel}>🔗 分享連結</div>
        <div style={styles.linkText}>{shareLink}</div>
      </div>

      <div style={styles.buttonGroup}>
        <button
          style={styles.shareButton}
          onClick={handleShare}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          📤 分享到 LINE
        </button>
        <button
          style={styles.copyButton}
          onClick={handleCopy}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4ff'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          {copied ? '✅ 已複製' : '📋 複製連結'}
        </button>
      </div>

      <div style={styles.statusSection}>
        <div style={styles.statusTitle}>👥 目前狀態（{participants.length} 人）</div>
        {participants.map((participant, index) => (
          <div key={participant.id} style={styles.participantItem}>
            <span>{participant.is_creator ? '👑' : '✅'}</span>
            <span>
              {participant.name}
              {participant.is_creator && '（發起人）'}
            </span>
          </div>
        ))}
        {participants.length === 1 && (
          <div style={styles.participantItem}>
            <span>⏳</span>
            <span>等待其他人加入...</span>
          </div>
        )}
      </div>

      <button
        style={styles.restartButton}
        onClick={onRestart}
        onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4ff'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        🔄 再來一次
      </button>
    </div>
  );
};

export default ShareLinkPage;
