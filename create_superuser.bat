@echo off
echo ========================================================
echo    Create Django Superuser (Admin Account)
echo ========================================================
echo.

cd /d "%~dp0"

if not exist ".venv\Scripts\activate.bat" (
    echo ERROR: Virtual environment not found.
    echo Please run run.bat first to set up the project.
    pause
    exit /b 1
)

call .venv\Scripts\activate.bat

echo Creating superuser account...
echo You will be prompted for username, email, and password.
echo.

python manage.py createsuperuser

echo.
echo ========================================================
echo Superuser created successfully!
echo You can now login at: http://localhost:8000/admin
echo ========================================================
pause
