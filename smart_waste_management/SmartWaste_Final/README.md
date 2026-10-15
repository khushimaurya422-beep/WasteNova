# 🗑️ Smart Waste Management System — AI Based Collection Predictor

A machine learning web application that predicts whether a smart dustbin requires garbage collection based on real-time IoT sensor data.

## 🚀 How to Run

1. Download or clone this repository
2. Open `index.html` directly in any browser
3. No installation or server required

## 📁 Project Structure

```
SmartWaste/
│
├── index.html                  ← Main web app (open this in browser)
│
├── static/
│   ├── css/
│   │   └── style.css           ← All styles
│   └── js/
│       └── main.js             ← Prediction logic & charts
│
└── notebook/
    └── smart_waste_project.ipynb  ← Model training notebook (Random Forest)
```

## 🧠 Model Details

| Parameter | Value |
|-----------|-------|
| Algorithm | Random Forest Classifier |
| No. of Trees | 200 |
| Training Data | 80,000 records (80%) |
| Test Data | 20,000 records (20%) |
| Test Accuracy | **100%** |
| Target Variable | `Collection_Required` (Yes / No) |

## 📊 Dataset

- **Total Records:** 1,00,000
- **Features:** Location, Waste Type, Fill Level, Weight, Temperature, Humidity

## 🌐 Web App Pages

- **Predict** — Enter sensor data → get instant AI prediction
- **Dashboard** — Visual analytics from dataset (charts, KPIs)
- **About** — Model details and dataset description

## 🛠️ Tech Stack

- **ML Model:** Python, Scikit-learn (Random Forest)
- **Frontend:** HTML, CSS, JavaScript (no framework needed)
- **Notebook:** Jupyter Notebook
