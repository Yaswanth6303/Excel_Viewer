# 📊 Excel File Uploader & Viewer

This project allows users to upload Excel files and view their contents in a table with filtering and searching functionalities. You can paginate through data and reset filters as needed.

## 📝 Features
- Upload and view Excel files 📂
- Filter and search through data 🔍
- Pagination controls for large datasets ⏮️⏭️
- Reset filters easily 🔄

## 🚀 Getting Started

### 1. Clone the Repository
First, clone the project to your local machine:

```bash
git clone https://github.com/yourusername/excel-uploader.git
cd excel-uploader
```

### 2. Install Dependencies
Install the required dependencies by running:

```bash
npm install
```

### 3. Run the Application
Once installed, start the development server:
```
npm run dev
```

The app should now be running at http://localhost:3000 🌐.

### 📋 Usage
1. **Upload a File 📂**: Use the upload form to select and upload an Excel file (XLSX or CSV).
2. **Filter Data 🔎**: Use the dropdown filters to narrow down data by column values.
3. **Search Manually 🕵️‍♂️**: Enter search terms in the input boxes to look for specific content in each column.
4. **Navigate Pages 📑**: Use "Previous" and "Next" buttons to move through paginated data.
5. **Reset Filters 🔄**: Click the "Reset" button to clear all filters and search inputs.

### 🛠️ Dependencies
- `react`: Core React library for building the UI.
- `xlsx`: Library for reading and parsing Excel files.

### 💡 Troubleshooting
If you encounter issues, ensure that:

- You have a stable internet connection.
- Node.js and npm are installed on your machine.
- You’ve selected a valid Excel file format (XLSX or CSV).
