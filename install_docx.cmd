@echo off
cd /d "C:\Users\Administrator\REPO"
npm install docx --save > node_run.log 2>&1
echo npm exit: %ERRORLEVEL% >> node_run.log
node backtest_report.js >> node_run.log 2>&1
echo node exit: %ERRORLEVEL% >> node_run.log
