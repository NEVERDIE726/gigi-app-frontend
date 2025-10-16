// src/components/PlaceAutocomplete.jsx

import { useRef, useEffect } from 'react';

const PlaceAutocomplete = ({ value, onInputChange, onSelectPlace, placeholder, style }) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!window.google || !window.google.maps || !inputRef.current) return;

    if (autocompleteRef.current) {
      window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
    }

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        componentRestrictions: { country: 'tw' },
        fields: ['formatted_address', 'geometry', 'name', 'place_id'],
      }
    );

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current.getPlace();
      if (!place.geometry) {
        console.log('沒有找到地點資訊');
        return;
      }
      
      if (onSelectPlace) {
        onSelectPlace({
          address: place.formatted_address || place.name,
          name: place.name,
          placeId: place.place_id,
          location: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
        });
      }
    });

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onSelectPlace]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={value || ''}
      onChange={(e) => onInputChange && onInputChange(e.target.value)}
      placeholder={placeholder}
      style={style}
    />
  );
};

export default PlaceAutocomplete;