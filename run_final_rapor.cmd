@echo off
cd /d "C:\Users\Administrator\REPO"
node final_rapor.js > final_rapor.log 2>&1
echo Exit: %ERRORLEVEL% >> final_rapor.log
type final_rapor.log
