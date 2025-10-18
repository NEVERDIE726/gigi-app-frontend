# Supabase 設定指南

## 📋 步驟總覽

1. ✅ 填入 Supabase 憑證到 `.env` 檔案
2. ✅ 在 Supabase 執行 SQL schema
3. ✅ 測試資料庫連線
4. ✅ 整合到應用程式

---

## 1️⃣ 填入 Supabase 憑證

### 取得憑證
1. 前往 https://supabase.com/
2. 登入你的帳號
3. 選擇你的專案（或建立新專案）
4. 點選左側選單的 **Settings** ⚙️
5. 點選 **API**
6. 複製以下兩個值：
   - **Project URL** (例如：`https://xxxxx.supabase.co`)
   - **anon public** key (很長的字串)

### 更新 .env 檔案
開啟 `frontend/.env` 檔案，將以下兩行的值替換成你的實際憑證：

```env
VITE_SUPABASE_URL=https://你的專案ID.supabase.co
VITE_SUPABASE_ANON_KEY=你的_anon_key
```

---

## 2️⃣ 建立資料庫表格

### 執行 SQL Schema
1. 在 Supabase 專案中，點選左側選單的 **SQL Editor** 📝
2. 點選 **New query**
3. 複製 `supabase-schema.sql` 檔案的**全部內容**
4. 貼到 SQL Editor
5. 點選右上角的 **Run** ▶️ 按鈕

### 驗證表格建立成功
1. 點選左側選單的 **Table Editor** 📊
2. 你應該會看到以下表格：
   - `gatherings` - 聚會主表
   - `participants` - 參與者資料
   - `available_dates` - 可用日期（日期投票用）

---

## 3️⃣ 資料庫結構說明

### 📦 gatherings（聚會表）
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | UUID | 主鍵 |
| short_id | VARCHAR(10) | 短網址 ID（例如：abc123） |
| intent | VARCHAR(50) | 意圖：接送、面交、吃喝玩樂、就找個點 |
| time_mode | VARCHAR(20) | instant 或 date_selection |
| creator_name | VARCHAR(100) | 建立者名稱 |
| creator_line_id | VARCHAR(100) | 建立者 LINE ID |
| status | VARCHAR(20) | active, completed, cancelled |
| created_at | TIMESTAMP | 建立時間 |
| updated_at | TIMESTAMP | 更新時間 |

### 👥 participants（參與者表）
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | UUID | 主鍵 |
| gathering_id | UUID | 所屬聚會 ID |
| name | VARCHAR(100) | 參與者名稱 |
| line_id | VARCHAR(100) | LINE ID |
| location | TEXT | 出發地點 |
| latitude | DECIMAL | 緯度 |
| longitude | DECIMAL | 經度 |
| transport_mode | VARCHAR(50) | 交通方式 |
| is_creator | BOOLEAN | 是否為建立者 |
| created_at | TIMESTAMP | 加入時間 |

### 📅 available_dates（可用日期表）
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | UUID | 主鍵 |
| participant_id | UUID | 參與者 ID |
| date_value | DATE | 可用的日期 |
| created_at | TIMESTAMP | 建立時間 |

---

## 4️⃣ 重啟開發伺服器

更新環境變數後，**必須重啟開發伺服器**：

```bash
# 停止目前的開發伺服器（Ctrl+C）
# 然後重新啟動
npm run dev
```

---

## 5️⃣ API 使用範例

### 建立聚會
```javascript
import { createGathering } from './lib/gatheringApi';

const result = await createGathering(
  {
    intent: '吃喝玩樂',
    timeMode: 'instant',
    creatorName: '小明',
    creatorLineId: 'U123456789...',
  },
  {
    location: '台北市信義區市政府',
    latitude: 25.0408,
    longitude: 121.5678,
    transportMode: '開車',
    availableDates: [], // instant 模式不需要
  }
);

if (result.success) {
  console.log('短網址 ID:', result.shortId);
  // 分享連結：https://你的網址/join/${result.shortId}
}
```

### 取得聚會資料
```javascript
import { getGathering } from './lib/gatheringApi';

const result = await getGathering('abc123');
if (result.success) {
  console.log('聚會資料:', result.gathering);
  console.log('參與者:', result.gathering.participants);
}
```

### 加入聚會
```javascript
import { joinGathering } from './lib/gatheringApi';

const result = await joinGathering('abc123', {
  name: '小華',
  lineId: 'U987654321...',
  location: '新北市板橋區',
  latitude: 25.0136,
  longitude: 121.4627,
  transportMode: '大眾運輸',
  availableDates: ['2025-10-20', '2025-10-21'], // 如果是 date_selection 模式
});
```

---

## 🧪 測試連線

執行以下步驟測試是否設定成功：

1. 確認 `.env` 已填入正確的憑證
2. 確認 SQL schema 已在 Supabase 執行
3. 重啟開發伺服器
4. 打開瀏覽器的開發者工具（F12）
5. 在應用程式中建立一個聚會
6. 檢查 Console 是否有錯誤訊息
7. 到 Supabase Table Editor 查看資料是否成功插入

---

## ❓ 常見問題

### Q: 看到 "缺少 Supabase 環境變數" 錯誤
A: 確認 `.env` 檔案中的變數名稱正確（必須是 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`），並且重啟開發伺服器。

### Q: 資料插入失敗，顯示 RLS 錯誤
A: 確認你已經執行 SQL schema 中的 Row Level Security (RLS) 設定部分。

### Q: 無法讀取資料
A: 檢查 Supabase Table Editor，確認資料確實存在，並且 RLS policies 已正確設定。

---

## 📚 下一步

設定完成後，你可以：
1. 整合到 `App.jsx` 和 `CreatorForm.jsx`
2. 建立加入聚會的頁面（`/join/:shortId`）
3. 實作結果計算和地圖顯示
4. 加入即時更新功能（Supabase Realtime）

需要協助請隨時告訴我！
