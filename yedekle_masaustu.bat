@echo off
echo === BY HOOK Masaustu Yedek ===
set YEDEK=C:\Users\Administrator\Desktop\ByHook_Yedek
echo Yedek klasoru: %YEDEK%
echo.

mkdir "%YEDEK%\REPO" 2>nul
mkdir "%YEDEK%\Scheduled" 2>nul
mkdir "%YEDEK%\claude_state" 2>nul

echo [1] REPO dosyalari kopyalaniyor...
xcopy "C:\Users\Administrator\REPO\*" "%YEDEK%\REPO\" /E /H /Y /Q

echo [2] Scheduled task SKILL.md dosyalari kopyalaniyor...
xcopy "C:\Users\Administrator\Claude\Scheduled\*" "%YEDEK%\Scheduled\" /E /H /Y /Q

echo [3] .claude state dosyalari kopyalaniyor...
xcopy "C:\Users\Administrator\.claude\*" "%YEDEK%\claude_state\" /E /H /Y /Q

echo.
echo === TAMAMLANDI ===
echo Yedek konumu: %YEDEK%
echo REPO, Scheduled ve state dosyalari yedeklendi.
pause
