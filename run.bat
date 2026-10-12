@echo off
title PocketSmartAI
cd /d "%~dp0"

echo ============================================
echo   PocketSmartAI - Smart Budget Assistant
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Please install Node.js from https://nodejs.org
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing dependencies for the first time...
  call npm install
  echo.
)

echo Starting the app... your browser will open automatically.
echo Press CTRL+C in this window to stop the app.
echo.

call npm run dev
pause
