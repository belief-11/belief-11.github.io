@echo off
chcp 65001 >nul
echo ========================================
echo    编译器安装向导
echo ========================================
echo.

echo 正在检查系统环境...
echo.

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo [√] Node.js 已安装
node --version
echo.

echo 正在安装项目依赖...
call npm install
if %errorlevel% neq 0 (
    echo [错误] 依赖安装失败
    pause
    exit /b 1
)
echo [√] 项目依赖安装完成
echo.

echo ========================================
echo    编译器安装指南
echo ========================================
echo.
echo 本编译器支持以下语言，请根据需要安装：
echo.

echo [1] Python 3
echo     下载地址: https://www.python.org/downloads/
echo     安装后确保 python 命令可用
echo.

echo [2] GCC (C/C++)
echo     Windows: 安装 MinGW-w64 或 TDM-GCC
echo     下载地址: https://www.mingw-w64.org/
echo     安装后确保 gcc 和 g++ 命令可用
echo.

echo [3] Java (OpenJDK)
echo     下载地址: https://adoptium.net/
echo     安装后确保 java 和 javac 命令可用
echo.

echo [4] Node.js (JavaScript)
echo     已安装，无需额外操作
echo.

echo [5] Go
echo     下载地址: https://golang.org/dl/
echo     安装后确保 go 命令可用
echo.

echo [6] Rust
echo     下载地址: https://www.rust-lang.org/
echo     安装后确保 rustc 命令可用
echo.

echo [7] C# (.NET)
echo     下载地址: https://dotnet.microsoft.com/
echo     安装后确保 csc 命令可用
echo.

echo ========================================
echo    快速启动说明
echo ========================================
echo.
echo 1. 运行 start-server.bat 启动编译服务器
echo 2. 打开浏览器访问 http://localhost:3000
echo 3. 开始编写和运行代码
echo.
echo 或者：
echo.
echo 1. 运行 start.bat 同时启动服务器和前端页面
echo.

pause