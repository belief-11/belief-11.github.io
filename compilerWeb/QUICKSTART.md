# 🚀 快速开始指南

## 第一步：安装依赖

打开命令提示符（CMD）或 PowerShell，进入项目目录，运行：

```bash
npm install
```

等待安装完成（大约 1-2 分钟）。

## 第二步：启动服务器

### 方法 1：使用启动脚本（推荐）

双击运行 `start-all.bat` 文件，它会自动：
- 启动编译服务器
- 打开浏览器访问应用

### 方法 2：手动启动

1. 打开命令提示符，运行：
```bash
node server.js
```

2. 打开浏览器，访问：http://localhost:3000

## 第三步：安装编译器

根据你需要使用的编程语言，安装相应的编译器：

### Python 3（最简单）
1. 访问 https://www.python.org/downloads/
2. 下载并安装 Python 3
3. **重要**：安装时勾选 "Add Python to PATH"

### C/C++
1. 访问 https://jmeubank.github.io/tdm-gcc/
2. 下载并安装 TDM-GCC
3. 安装后重启命令提示符

### Java
1. 访问 https://adoptium.net/
2. 下载并安装 OpenJDK
3. 配置 JAVA_HOME 环境变量

### 其他语言
查看 README.md 中的详细说明。

## 测试运行

1. 在浏览器中打开应用
2. 选择 "Python 3"
3. 点击 "运行代码"
4. 如果看到 "Hello, World!" 输出，说明一切正常！

## 遇到问题？

### 无法连接到服务器
- 确保已运行 `npm install`
- 确保已运行 `node server.js`
- 检查端口 3000 是否被占用

### 编译器未找到
- 确保已安装对应语言的编译器
- 确保编译器已添加到 PATH 环境变量
- 重启命令提示符或重启计算机

### 其他问题
查看 README.md 中的"常见问题"章节。

---

**祝你使用愉快！** 🎉