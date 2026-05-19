@echo off
cd /d "%~dp0"
title AEX AI Advisor
if not exist node_modules (
  echo Eerste keer starten: onderdelen installeren...
  npm install
)
cls
npm run start
pause
