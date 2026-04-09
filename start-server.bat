@echo off
chcp 65001 >nul
echo ========================================
echo    启动本地编译服务器
echo ========================================
echo.
echo 正在启动服务器...
echo 服务器地址: http://localhost:3000
echo.
echo 按 Ctrl+C 停止服务器
echo ========================================
echo.

node server.js

pause