---
title:
  zh: SpotClue 地理線索分析平台
  en: SpotClue Image Geolocation
summary:
  zh: 結合可驗證的地理線索與瀏覽器端模型推論，找出街景照片可能的拍攝國家與區域。
  en: Image geolocation through verifiable clues and browser-based inference, with candidate countries and regions shown on a map.
category: data
start: 2026
featured: true
order: 1
role:
  zh: 個人專案
  en: Personal project
metrics:
  - label:
      zh: 國家分類 Top-5 準確率
      en: Top-5 country accuracy
    value: 79.3%
    note:
      zh: 188 個國家，以 1,000 張未參與訓練的照片評估
      en: 188 countries, measured on 1,000 held-out photos
  - label:
      zh: 輸出候選清單時的 Top-5 命中率
      en: Top-5 accuracy when a list is shown
    value: 97%
    note:
      zh: 47% 的照片通過信心門檻，會輸出前五個候選國家
      en: Lists are shown for 47% of photos; the correct country is among five candidates
  - label:
      zh: 每張照片的瀏覽器推論時間
      en: In-browser inference per photo
    value:
      zh: 約 0.3 秒
      en: about 0.3 s
    note:
      zh: 4-bit CLIP ViT-L/14（199 MB），M4 MacBook／Chrome／WebGPU，排除首次推論
      en: 4-bit CLIP ViT-L/14 (199 MB), M4 MacBook, Chrome/WebGPU, first inference excluded
links:
  live: https://spotclue.ycrainyu.com/
status: live
coverLayout: overlap
cover: ../../assets/projects/spotclue/locate.webp
coverAlt:
  zh: SpotClue 的 Locate 頁面，左邊是從本機選取的照片與模型判斷的線索，右邊的地圖標出候選國家
  en: The SpotClue Locate page with a locally selected photo, model-generated clues and a map of candidate countries
---

# zh
## 專案簡介

SpotClue 是已上線的個人專案，透過可驗證的線索分析街景照片的拍攝地點。照片中的文字系統、道路標誌、地形與氣候帶會各自對應到地圖範圍，再取交集，找出候選國家與區域。使用者可以關閉或修改每條線索，地圖也會顯示各自的範圍與矛盾之處。

- 開發前先完成六個小型實驗，包含 LLM 與 CLIP 基準測試、OCR、圖資涵蓋率與電桿號碼公式，再根據實測數字決定專案範圍。
- 線索判讀優先使用規則，僅在模型能讓同一組測試照片的判讀準確率至少提高 5 個百分點時採用，最後才考慮 LLM。
- 建立可重複執行的資料匯入流程，將 OpenStreetMap、國家邊界、氣候分區與高程資料匯入 PostGIS，預先計算氣候、海拔與地形分類，API 查詢時再篩選並加總面積。
- 為了讓照片留在使用者裝置上，模型直接在瀏覽器中執行。將 CLIP ViT-L/14 影像編碼器匯出為 ONNX，比較 int8、fp16 與 4-bit 三種版本後採用 4-bit（199 MB，量化比較中的 Top-5 準確率下降 1.1 個百分點）。使用 M4 MacBook 的 Chrome／WebGPU 測試 20 張照片，排除首次推論後，推論時間中位數約 0.3 秒，不含模型下載與載入時間。
- 凍結 CLIP 影像編碼器，以 46,785 張街景照片訓練線性國家分類頭，再依地區分組切出驗證集，校準候選清單的信心門檻，僅在通過門檻時自動填入線索。

合併線索時，系統會區分國家是不符合條件，還是缺少資料，後者仍保留為候選。多條線索互相矛盾時，會找出造成候選範圍為空的一組線索，協助使用者檢查判讀依據。瀏覽器推論在 Web Worker 中執行，WebGPU 無法使用或載入失敗時可改用 WASM，Python 評估與前端則共用影像前處理設定。

國家分類器以 1,000 張未參與訓練的照片評估，在 188 個國家中的 Top-1 準確率為 55.5%、Top-5 為 79.3%。加入信心門檻後，模型會在約 47% 的照片中輸出前五個候選國家，其中約 97% 的清單包含正確國家。另以 165,788 筆台電資料驗證電桿號碼換算座標的公式，誤差中位數約 10 公尺，做法、限制與數據均一併公開。

# en
## Overview

SpotClue is a live personal project for locating street photos through verifiable evidence. Each clue (script, road signs, terrain, climate zone) becomes a map area, and their intersection gives candidate countries and regions. Users can switch off or edit each clue, and the map shows the areas and any contradictions.

- Ran six short experiments before building (LLM and CLIP baselines, OCR, map-data coverage and pole-number formulae) and set the scope from the results.
- Prioritised rule-based methods, adopting models only for an accuracy gain of at least 5 percentage points on the same photos and considering LLMs as a last resort.
- Built re-runnable loaders that bring OpenStreetMap, boundary, climate and elevation data into PostGIS. Each country’s climate, elevation and terrain classes are precomputed, so an API request only filters and sums areas.
- Ran the model in the browser so photos are never uploaded. Exported the CLIP ViT-L/14 image encoder to ONNX, compared int8, fp16 and 4-bit versions and shipped the 4-bit one (199 MB, with a 1.1 percentage-point drop in top-5 accuracy in the quantisation comparison). In a 20-photo benchmark on an M4 MacBook in Chrome with WebGPU, median inference time was about 0.3 s with the first inference excluded; model download and loading time were excluded.
- Kept the CLIP image encoder frozen and trained a linear country-classification head on 46,785 street-view photos. Validation data was split by location to calibrate the candidate-list threshold, so uncertain predictions do not automatically fill a clue.

Clue merging distinguishes countries that fail a constraint from those with no data; countries without data remain candidates. When clues conflict, the system identifies a set responsible for the empty candidate area so users can inspect their assumptions. Browser inference runs in a Web Worker, with a WASM fallback when WebGPU is unavailable or fails to load. Python evaluation and the front end share preprocessing settings.

The classifier reaches 55.5% top-1 and 79.3% top-5 on 1,000 held-out photos. With the calibrated threshold it shows a five-country candidate list for about 47% of photos; about 97% of those lists contain the correct country. A formula converting Taipower pole numbers to coordinates was checked against 165,788 records, with a median difference of 10 m. The method and its limits are published with the data.
