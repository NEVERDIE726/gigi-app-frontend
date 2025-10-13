import { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

// --- 最終樣式物件 (已包含置中排版) ---
const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  mapContainer: {
    width: '100%',
    flexGrow: 1, // 讓地圖填滿剩餘空間
  },
  uiContainer: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    right: '10px',
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '15px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 1,
  },
  title: { fontSize: '20px', margin: '0 0 10px 0', fontWeight: '700' },
  // ... 其他您未來需要的 UI 樣式 ...
};

// --- 地圖設定 ---
const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapId: 'YOUR_CUSTOM_MAP_ID' // 可選，用於自訂地圖樣式
};

const taipei101 = {
  lat: 25.0336,
  lng: 121.5646
};

function App() {
  const [liffError, setLiffError] = useState('');

  // --- Google Maps API 載入 ---
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  useEffect(() => {
    const main = async () => {
      try {
        const liff = (await import('@line/liff')).default;
        await liff.init({ liffId: import.meta.env.VITE_LIFF_ID });
        if (!liff.isLoggedIn()) {
          // 在地圖應用中，我們可能不需要強制登入
        }
      } catch (error) {
        console.error(error);
        setLiffError(error.toString());
      }
    };
    main();
  }, []);

  if (loadError) {
    return <div>地圖載入失敗: {loadError.message}</div>;
  }

  if (!isLoaded) {
    return <div>正在載入地圖...</div>;
  }

  return (
    <div style={styles.container}>
      <GoogleMap
        mapContainerStyle={styles.mapContainer}
        center={taipei101}
        zoom={17}
        options={mapOptions}
      >
        {/* 在地圖上放置一個標記 */}
        <Marker position={taipei101} />
      </GoogleMap>
      
      {/* 這是我們的 UI 層 */}
      <div style={styles.uiContainer}>
        <h1 style={styles.title}>Gigi App - 作戰地圖</h1>
        {liffError && <p style={{color: 'red'}}>LIFF 錯誤: {liffError}</p>}
      </div>
    </div>
  );
}

export default App;
```

4.  **儲存檔案** (`Cmd + S`)。

---

### **第二步：給 CLI 的「地圖部署」指令包**

當您完成貼上並**儲存**檔案後，請**完整複製**以下指令，**一次貼到您的終端機**執行。

```bash
# 顯示進度
echo "✅ 地圖程式碼已植入，正在提交並部署..."

# 將您的修改存入 Git
git add .
git commit -m "feat: Integrate Google Maps and display the first map"

# 執行部署
echo "🚀 Git 提交完成，正在執行 Vercel 部署..."
npx vercel --prod

