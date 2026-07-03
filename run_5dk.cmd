@echo off
cd /d "C:\Users\Administrator\REPO"
node backtest_5dk.js > node_5dk.log 2>&1
echo Exit: %ERRORLEVEL% >> node_5dk.log
