# 🐛 Google Places Autocomplete 故障排除指南

## 快速檢查清單

### ✅ 第一步：確認環境變數
```bash
# 檢查 .env 檔案
cat .env | grep VITE_GOOGLE_MAPS_API_KEY
```

**應該看到：**
```
VITE_GOOGLE_MAPS_API_KEY=AIzaSyCmbZpIvUtwXIg1PeF_o2ygd3PU97gtM6k
```

如果沒有，執行：
```bash
echo "VITE_GOOGLE_MAPS_API_KEY=AIzaSyCmbZpIvUtwXIg1PeF_o2ygd3PU97gtM6k" >> .env
npm run dev
```

---

### ✅ 第二步：檢查 Google Cloud Console

#### 1. 確認 API 已啟用
前往：https://console.cloud.google.com/apis/library

搜尋並啟用以下 API：
- ✅ **Maps JavaScript API**
- ✅ **Places API** ← 最重要！
- ✅ **Geocoding API** (建議啟用)
- ✅ **Distance Matrix API** (未來需要)

#### 2. 檢查 API Key 限制
前往：https://console.cloud.google.com/apis/credentials

點擊你的 API Key → 編輯

**應用程式限制：**
- 選擇「HTTP 參照網址 (網站)」
- 新增以下網址：
  ```
  http://localhost:5173/*
  http://127.0.0.1:5173/*
  https://*.vercel.app/*
  ```

**API 限制：**
- 選擇「限制金鑰」
- 勾選以下 API：
  - Maps JavaScript API
  - Places API
  - Geocoding API
  - Distance Matrix API

---

### ✅ 第三步：瀏覽器開發者工具檢查

打開 http://localhost:5173/，按 `F12` 開啟開發者工具：

#### 1. 檢查 Console 是否有錯誤

**常見錯誤 1：API Key 無效**
```
Google Maps JavaScript API error: InvalidKeyMapError
```
**解決方案：** 確認 .env 中的 API Key 正確，並重新啟動 `npm run dev`

---

**常見錯誤 2：API 未啟用**
```
Google Maps JavaScript API error: ApiNotActivatedMapError
```
**解決方案：** 前往 Google Cloud Console 啟用 Places API

---

**常見錯誤 3：網域限制**
```
Google Maps JavaScript API error: RefererNotAllowedMapError
```
**解決方案：** 在 API Key 設定中新增 `http://localhost:5173/*`

---

#### 2. 檢查 Network 標籤

**應該看到：**
- 請求到 `maps.googleapis.com` 的狀態為 **200 OK**
- 請求到 `maps.googleapis.com/maps/api/js/...` 的狀態為 **200 OK**

**如果看到 403 或 404：**
- 403 → API Key 權限問題
- 404 → API 未啟用

---

### ✅ 第四步：測試 Autocomplete 功能

1. 打開應用程式：http://localhost:5173/
2. 點擊「找大家的中間點」
3. 在「朋友 1」的輸入框輸入：`台北`
4. **預期結果：** 應該看到下拉選單顯示建議（台北車站、台北 101...）

**如果沒有顯示建議：**
- 確認 Console 沒有錯誤訊息
- 確認 Network 標籤中有請求到 `AutocompletionService`
- 嘗試輸入完整地址（例如：「台北市中正區」）

---

## 🔍 深度診斷

### 診斷腳本 1：檢查 Google Maps 載入狀態

在瀏覽器 Console 執行：
```javascript
// 檢查 window.google 是否存在
console.log('Google Maps loaded:', !!window.google);
console.log('Google Places loaded:', !!window.google?.maps?.places);

// 檢查 API Key
console.log('API Key:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
```

**預期輸出：**
```
Google Maps loaded: true
Google Places loaded: true
API Key: AIzaSyCmbZpIvUtwXIg1PeF_o2ygd3PU97gtM6k
```

---

### 診斷腳本 2：手動測試 Autocomplete

在瀏覽器 Console 執行：
```javascript
// 取得第一個輸入框
const input = document.querySelector('input[type="text"]');

// 建立 Autocomplete
const autocomplete = new google.maps.places.Autocomplete(input, {
  componentRestrictions: { country: 'tw' },
  fields: ['formatted_address', 'geometry', 'name', 'place_id'],
});

// 監聽選擇事件
autocomplete.addListener('place_changed', () => {
  const place = autocomplete.getPlace();
  console.log('Selected place:', place);
});
```

然後在輸入框輸入地點，看看是否有反應。

---

## 📋 常見問題 Q&A

### Q1: 輸入地點後沒有任何反應
**A:**
1. 確認 `window.google` 已載入（見診斷腳本 1）
2. 檢查 Console 是否有錯誤
3. 確認 Places API 已在 Google Cloud Console 啟用

### Q2: 下拉選單出現但沒有建議
**A:**
1. 可能是搜尋關鍵字太短，嘗試輸入至少 3 個字
2. 檢查 `componentRestrictions: { country: 'tw' }` 是否設定正確
3. 嘗試移除國家限制，看看是否有全球建議

### Q3: 選擇地點後輸入框沒有填入地址
**A:**
1. 檢查 `PlaceAutocomplete.jsx` 中的 `onChange` 是否正確傳遞資料
2. 在 `handleLocationChange` 中加入 `console.log` 確認資料流

### Q4: 載入速度很慢
**A:**
1. Google Maps API 第一次載入需要時間（5-10 秒）
2. 確認網路連線正常
3. 考慮加入 loading spinner 改善使用者體驗

---

## 🛠️ 緊急修復腳本

如果一切都不行，執行以下步驟重置：

```bash
# 1. 停止開發伺服器
# 按 Ctrl+C

# 2. 清除快取
rm -rf node_modules/.vite

# 3. 重新安裝依賴
npm install

# 4. 確認環境變數
cat .env

# 5. 重新啟動
npm run dev
```

---

## 📞 還是不行？

如果以上步驟都試過了還是不行，請提供以下資訊：

1. **Console 錯誤訊息**（截圖或複製）
2. **Network 標籤**中對 `googleapis.com` 的請求狀態
3. **瀏覽器版本**（Chrome、Firefox、Safari...）
4. **執行診斷腳本 1 的輸出結果**

---

## ✅ 驗證成功

如果一切正常，你應該看到：

1. ✅ 載入畫面顯示「正在載入地圖...」然後消失
2. ✅ 輸入框可以正常輸入
3. ✅ 輸入「台北」會顯示下拉建議
4. ✅ 選擇地點後輸入框自動填入地址
5. ✅ Console 沒有紅色錯誤訊息
6. ✅ 交通方式選擇器可以切換
7. ✅ 點擊「下一步」會顯示收集到的資料

祝你測試順利！🎉
