@echo off
cd /d "C:\Users\Administrator\REPO"
node s4_backtest_rapor.js > s4_rapor.log 2>&1
echo Exit: %ERRORLEVEL% >> s4_rapor.log
