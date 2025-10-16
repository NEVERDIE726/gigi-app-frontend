import React from 'react';
import PlaceAutocomplete from './PlaceAutocomplete';

const styles = {
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
  removeButton: {
    padding: '4px 8px',
    background: '#ff4757',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    fontSize: '12px',
    cursor: 'pointer',
    marginLeft: 'auto',
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
};

const ParticipantInput = ({
  participant,
  onUpdate,
  onRemove,
  canRemove,
}) => {
  const handleInputChange = (value) => {
    onUpdate({ ...participant, location: value, placeData: null });
  };

  const handlePlaceSelect = (placeData) => {
    onUpdate({
      ...participant,
      location: placeData.address || placeData.name || '',
      placeData: placeData,
    });
  };

  const handleTransportChange = (e) => {
    onUpdate({ ...participant, transportMode: e.target.value });
  };

  return (
    <div style={styles.friendItem}>
      <div style={styles.friendLabel}>
        <span>👤 {participant.name}</span>
        {canRemove && (
          <button style={styles.removeButton} onClick={() => onRemove(participant.id)}>
            移除
          </button>
        )}
      </div>

      <PlaceAutocomplete
        value={participant.location}
        onInputChange={handleInputChange}
        onSelectPlace={handlePlaceSelect}
        placeholder="例如：台北車站、信義區市政府..."
        style={styles.input}
      />

      <div style={{ marginTop: '10px' }}>
        <select
          value={participant.transportMode}
          onChange={handleTransportChange}
          style={{ ...styles.input, marginTop: '8px' }}
        >
          <option value="開車">🚗 開車</option>
          <option value="大眾運輸">🚇 大眾運輸（捷運/公車）</option>
          <option value="機車">🛵 機車</option>
          <option value="步行">🚶 步行</option>
          <option value="計程車/Uber">🚕 計程車/Uber</option>
        </select>
      </div>
    </div>
  );
};

export default React.memo(ParticipantInput);