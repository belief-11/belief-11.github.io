@echo off
chcp 65001 >nul
echo ========================================
echo    安装编译器依赖
echo ========================================
echo.

echo 正在安装项目依赖...
call npm install
if %errorlevel% neq 0 (
    echo [错误] 安装失败
    pause
    exit /b 1
)

echo.
echo ========================================
echo    安装完成！
echo ========================================
echo.
echo 现在可以运行 "启动应用.bat" 启动编译器
echo.

pause