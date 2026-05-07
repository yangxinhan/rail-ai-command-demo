# 🚄 鐵道 AI 監控儀表板 (Railway AI Monitoring Dashboard)

這是一個高度互動、視覺震撼且高效能的網頁儀表板，專為鐵道異物與安全偵測系統所設計。本專案採用暗黑科幻的「戰情室」風格，並具備即時數據模擬、互動式地圖以及 AI 影像監控等功能。

## ✨ 核心特色

- **暗黑科幻戰情室風格**：採用頂級設計，具備流暢的毛玻璃效果（Glassmorphism）、動態動畫以及沉浸式的深色主題配色。
- **即時數據模擬**：動態視覺化列車狀態、系統警報與設備健康度。
- **互動式列車地圖**：專屬的 UI 元件，用來視覺化當前運作中的鐵路網路。
- **AI 影像監控**：模擬即時攝影機畫面，以及 AI 驅動的異物入侵警報。
- **全方位數據分析**：透過互動式卡片與圖表，提供高階的系統統計總覽。

## 🛠️ 技術堆疊

- **框架**：[Next.js](https://nextjs.org/) (App Router)
- **語言**：TypeScript
- **樣式**：Vanilla CSS (CSS Modules) / 自訂設計系統
- **圖示**：React Icons / Lucide React

## 🚀 快速開始

請確保您的電腦已安裝 Node.js。

1. **複製專案**（如果您尚未下載）：
   ```bash
   git clone <repository-url>
   cd rail-ai-command-demo
   ```

2. **安裝依賴套件**：
   ```bash
   npm install
   # 或
   yarn install
   # 或
   pnpm install
   ```

3. **啟動開發伺服器**：
   ```bash
   npm run dev
   # 或
   yarn dev
   # 或
   pnpm dev
   ```

4. **開啟應用程式**：
   請在瀏覽器中打開 [http://localhost:3000](http://localhost:3000) 來查看運作中的儀表板。

## 📂 專案結構

```text
src/
├── app/               # Next.js App Router 頁面 (儀表板首頁、監控頁面、警報頁面)
├── components/        # 可共用的 UI 元件 (Dashboard, Charts, Monitoring)
├── data/              # 模擬資料與邏輯
└── hooks/             # 自訂的 React Hooks
```

## 🤝 參與貢獻

歡迎任何形式的貢獻、問題回報與功能建議！請隨時至 Issues 頁面提出您的想法。

## 📝 授權條款

本專案為開源專案，並採用 [MIT License](LICENSE) 授權。
