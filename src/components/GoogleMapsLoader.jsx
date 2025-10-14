import { useLoadScript } from '@react-google-maps/api';

// 定義需要載入的 Google Maps 函式庫
const libraries = ['places'];

export function useGoogleMaps() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  return {
    isLoaded,
    loadError,
  };
}
