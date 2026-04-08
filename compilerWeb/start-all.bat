@echo off
chcp 65001 >nul
echo ========================================
echo    启动在线编译器
echo ========================================
echo.

echo 正在检查服务器状态...
curl -s http://localhost:3000/api/health >nul 2>&1
if %errorlevel% neq 0 (
    echo 服务器未运行，正在启动...
    start "编译服务器" cmd /c "node server.js"
    timeout /t 3 /nobreak >nul
)

echo 正在打开浏览器...
start http://localhost:3000

echo.
echo ========================================
echo 编译器已启动！
echo.
echo 前端地址: http://localhost:3000
echo API地址: http://localhost:3000/api/compile
echo.
echo 按 Ctrl+C 停止服务
echo ========================================
echo.

pause