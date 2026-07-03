@echo off
cd /d "C:\Users\Administrator\REPO"
node backtest_report.js > node_run.log 2>&1
echo Exit code: %ERRORLEVEL% >> node_run.log
