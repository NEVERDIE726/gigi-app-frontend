#!/bin/bash

# 顏色定義
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "================================================"
echo "🔍 Google Places Autocomplete 設定檢查"
echo "================================================"
echo ""

# 1. 檢查 .env 檔案
echo -e "${BLUE}[1/5]${NC} 檢查環境變數..."
if [ -f .env ]; then
    if grep -q "VITE_GOOGLE_MAPS_API_KEY" .env; then
        API_KEY=$(grep "VITE_GOOGLE_MAPS_API_KEY" .env | cut -d '=' -f2)
        if [ -n "$API_KEY" ]; then
            echo -e "${GREEN}✅${NC} VITE_GOOGLE_MAPS_API_KEY 已設定"
            echo "   Key: ${API_KEY:0:20}..."
        else
            echo -e "${RED}❌${NC} VITE_GOOGLE_MAPS_API_KEY 存在但為空"
        fi
    else
        echo -e "${RED}❌${NC} .env 檔案中找不到 VITE_GOOGLE_MAPS_API_KEY"
    fi

    if grep -q "VITE_LIFF_ID" .env; then
        echo -e "${GREEN}✅${NC} VITE_LIFF_ID 已設定"
    else
        echo -e "${YELLOW}⚠️${NC}  VITE_LIFF_ID 未設定（LIFF 功能將無法使用）"
    fi
else
    echo -e "${RED}❌${NC} 找不到 .env 檔案！"
    echo "   請執行：echo 'VITE_GOOGLE_MAPS_API_KEY=你的API金鑰' > .env"
fi
echo ""

# 2. 檢查 node_modules
echo -e "${BLUE}[2/5]${NC} 檢查依賴套件..."
if [ -d "node_modules" ]; then
    if [ -d "node_modules/@react-google-maps" ]; then
        echo -e "${GREEN}✅${NC} @react-google-maps/api 已安裝"
    else
        echo -e "${RED}❌${NC} @react-google-maps/api 未安裝"
        echo "   請執行：npm install"
    fi

    if [ -d "node_modules/@line" ]; then
        echo -e "${GREEN}✅${NC} @line/liff 已安裝"
    else
        echo -e "${YELLOW}⚠️${NC}  @line/liff 未安裝（LIFF 功能將無法使用）"
    fi
else
    echo -e "${RED}❌${NC} node_modules 目錄不存在"
    echo "   請執行：npm install"
fi
echo ""

# 3. 檢查必要檔案
echo -e "${BLUE}[3/5]${NC} 檢查專案檔案..."
files=(
    "src/App.jsx"
    "src/components/GoogleMapsLoader.jsx"
    "src/components/PlaceAutocomplete.jsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $file"
    else
        echo -e "${RED}❌${NC} $file 不存在"
    fi
done
echo ""

# 4. 檢查程式碼整合
echo -e "${BLUE}[4/5]${NC} 檢查程式碼整合..."
if grep -q "useGoogleMaps" src/App.jsx; then
    echo -e "${GREEN}✅${NC} App.jsx 已導入 useGoogleMaps"
else
    echo -e "${RED}❌${NC} App.jsx 未導入 useGoogleMaps"
fi

if grep -q "PlaceAutocomplete" src/App.jsx; then
    echo -e "${GREEN}✅${NC} App.jsx 已導入 PlaceAutocomplete"
else
    echo -e "${RED}❌${NC} App.jsx 未導入 PlaceAutocomplete"
fi
echo ""

# 5. 測試 API Key（需要網路連線）
echo -e "${BLUE}[5/5]${NC} 測試 Google Maps API Key..."
if [ -f .env ] && grep -q "VITE_GOOGLE_MAPS_API_KEY" .env; then
    API_KEY=$(grep "VITE_GOOGLE_MAPS_API_KEY" .env | cut -d '=' -f2)

    # 嘗試請求 Google Maps API
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://maps.googleapis.com/maps/api/js?key=${API_KEY}")

    if [ "$HTTP_STATUS" = "200" ]; then
        echo -e "${GREEN}✅${NC} API Key 有效（HTTP 200）"
    else
        echo -e "${RED}❌${NC} API Key 可能無效或有限制（HTTP $HTTP_STATUS）"
        if [ "$HTTP_STATUS" = "403" ]; then
            echo "   可能原因：API Key 限制或權限問題"
        fi
    fi
else
    echo -e "${YELLOW}⚠️${NC}  無法測試（找不到 API Key）"
fi
echo ""

# 總結
echo "================================================"
echo "📊 檢查完成！"
echo "================================================"
echo ""
echo "🚀 下一步："
echo "   1. 執行 'npm run dev' 啟動開發伺服器"
echo "   2. 打開瀏覽器訪問 http://localhost:5173/"
echo "   3. 如需測試 API，直接開啟 test-autocomplete.html"
echo ""
echo "🐛 如有問題，請參考："
echo "   - troubleshooting.md（完整故障排除指南）"
echo "   - test-autocomplete.html（獨立測試頁面）"
echo ""
