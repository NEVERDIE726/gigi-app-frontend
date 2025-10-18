-- Supabase 資料庫 Schema
-- 這個檔案包含所有需要在 Supabase SQL Editor 中執行的 SQL

-- ============================================
-- 1. gatherings 表格（聚會主表）
-- ============================================
CREATE TABLE gatherings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  short_id VARCHAR(10) UNIQUE NOT NULL, -- 短網址 ID（例如：abc123）
  intent VARCHAR(50) NOT NULL, -- 意圖：接送、面交、吃喝玩樂、就找個點
  time_mode VARCHAR(20) NOT NULL, -- instant 或 date_selection
  creator_name VARCHAR(100) NOT NULL, -- 建立者名稱
  creator_line_id VARCHAR(100), -- 建立者 LINE ID（可選）
  status VARCHAR(20) DEFAULT 'active', -- active, completed, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 為 short_id 建立索引，加快查詢速度
CREATE INDEX idx_gatherings_short_id ON gatherings(short_id);

-- ============================================
-- 2. participants 表格（參與者資料）
-- ============================================
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gathering_id UUID NOT NULL REFERENCES gatherings(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL, -- 參與者名稱
  line_id VARCHAR(100), -- LINE ID（可選）
  location TEXT NOT NULL, -- 出發地點
  latitude DECIMAL(10, 8), -- 經度（從 Google Maps 取得）
  longitude DECIMAL(11, 8), -- 緯度（從 Google Maps 取得）
  transport_mode VARCHAR(50) NOT NULL, -- 交通方式：開車、大眾運輸、機車、步行、計程車/Uber
  is_creator BOOLEAN DEFAULT FALSE, -- 是否為建立者
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 為 gathering_id 建立索引
CREATE INDEX idx_participants_gathering_id ON participants(gathering_id);

-- ============================================
-- 3. available_dates 表格（可用日期，用於 date_selection 模式）
-- ============================================
CREATE TABLE available_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  date_value DATE NOT NULL, -- 可用的日期
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 為 participant_id 建立索引
CREATE INDEX idx_available_dates_participant_id ON available_dates(participant_id);

-- 確保同一個參與者不會重複選擇同一個日期
CREATE UNIQUE INDEX idx_unique_participant_date ON available_dates(participant_id, date_value);

-- ============================================
-- 4. 建立 updated_at 自動更新的 trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_gatherings_updated_at
BEFORE UPDATE ON gatherings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. Row Level Security (RLS) 設定
-- ============================================
-- 啟用 RLS
ALTER TABLE gatherings ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE available_dates ENABLE ROW LEVEL SECURITY;

-- 允許所有人讀取（因為是公開的聚會連結）
CREATE POLICY "允許所有人讀取 gatherings" ON gatherings
  FOR SELECT USING (true);

CREATE POLICY "允許所有人讀取 participants" ON participants
  FOR SELECT USING (true);

CREATE POLICY "允許所有人讀取 available_dates" ON available_dates
  FOR SELECT USING (true);

-- 允許所有人新增（匿名用戶也可以建立聚會和加入）
CREATE POLICY "允許所有人新增 gatherings" ON gatherings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "允許所有人新增 participants" ON participants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "允許所有人新增 available_dates" ON available_dates
  FOR INSERT WITH CHECK (true);

-- 允許所有人更新和刪除（之後可以根據需求調整）
CREATE POLICY "允許所有人更新 gatherings" ON gatherings
  FOR UPDATE USING (true);

CREATE POLICY "允許所有人刪除 participants" ON participants
  FOR DELETE USING (true);

-- ============================================
-- 6. 輔助函數：生成短 ID
-- ============================================
CREATE OR REPLACE FUNCTION generate_short_id()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'abcdefghijklmnopqrstuvwxyz0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. 測試資料（可選，用於開發測試）
-- ============================================
-- 取消下面的註解來插入測試資料

/*
-- 測試聚會 1：立即接送
INSERT INTO gatherings (short_id, intent, time_mode, creator_name)
VALUES ('test01', '接送', 'instant', '測試用戶A');

-- 測試聚會 2：日期投票的吃喝玩樂
INSERT INTO gatherings (short_id, intent, time_mode, creator_name)
VALUES ('test02', '吃喝玩樂', 'date_selection', '測試用戶B');
*/
