@echo off
chcp 65001 >nul
echo ========================================
echo    本地代码编译器 - 桌面应用
echo ========================================
echo.

echo 正在检查 Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)
echo [√] Node.js 已安装
echo.

echo 正在检查依赖...
if not exist "node_modules" (
    echo 首次运行，正在安装依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo [错误] 依赖安装失败
        pause
        exit /b 1
    )
    echo [√] 依赖安装完成
    echo.
)

echo 正在启动应用...
echo.

npm start

pause