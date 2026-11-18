@echo off
echo ========================================================
echo   Paytm Hackathon Project - Copy to D:\paytmone
echo ========================================================
echo Granting write permissions to D:\paytmone...
icacls D:\paytmone /grant Users:(OI)(CI)F /t
echo.
echo Copying all project files to D:\paytmone...
xcopy /E /I /Y "C:\Users\hp\paytmone\*" "D:\paytmone\"
echo.
echo [DONE] All files successfully updated in D:\paytmone!
pause
