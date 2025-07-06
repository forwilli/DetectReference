@echo off
echo Starting Reference Verifier...

cd backend
start cmd /k "npm run dev"

timeout /t 3

cd ../frontend
start cmd /k "npm run dev"

echo.
echo Reference Verifier is starting...
echo Frontend will be available at: http://localhost:5173
echo Backend API is running at: http://localhost:3001
echo.
echo Close the command windows to stop the servers.
pause