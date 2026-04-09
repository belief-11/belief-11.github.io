const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let serverProcess;
let server;

const TEMP_DIR = path.join(__dirname, 'temp');

if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

function startServer() {
    return new Promise((resolve, reject) => {
        try {
            const express = require('express');
            const cors = require('cors');
            const bodyParser = require('body-parser');
            const { spawn } = require('child_process');
            const { v4: uuidv4 } = require('uuid');
            
            const app = express();
            const PORT = 3000;
            
            app.use(cors());
            app.use(bodyParser.json());
            app.use(express.static(__dirname));
            
            const TIMEOUT = 10000;
            const MAX_OUTPUT_SIZE = 1024 * 1024;
            
            const languageConfig = {
                c: {
                    name: 'C',
                    extension: 'c',
                    compile: 'gcc',
                    compileArgs: (source, output) => ['-o', output, source],
                    run: (output) => output,
                    needsCompile: true
                },
                cpp: {
                    name: 'C++',
                    extension: 'cpp',
                    compile: 'g++',
                    compileArgs: (source, output) => ['-o', output, source],
                    run: (output) => output,
                    needsCompile: true
                },
                python: {
                    name: 'Python 3',
                    extension: 'py',
                    compile: null,
                    compileArgs: null,
                    run: (source) => ['python', [source]],
                    needsCompile: false
                },
                java: {
                    name: 'Java',
                    extension: 'java',
                    compile: 'javac',
                    compileArgs: (source) => [source],
                    run: (className) => ['java', [className]],
                    needsCompile: true,
                    getClassName: true
                },
                javascript: {
                    name: 'JavaScript',
                    extension: 'js',
                    compile: null,
                    compileArgs: null,
                    run: (source) => ['node', [source]],
                    needsCompile: false
                },
                go: {
                    name: 'Go',
                    extension: 'go',
                    compile: 'go',
                    compileArgs: (source, output) => ['build', '-o', output, source],
                    run: (output) => output,
                    needsCompile: true
                },
                rust: {
                    name: 'Rust',
                    extension: 'rs',
                    compile: 'rustc',
                    compileArgs: (source, output) => ['-o', output, source],
                    run: (output) => output,
                    needsCompile: true
                },
                csharp: {
                    name: 'C#',
                    extension: 'cs',
                    compile: 'csc',
                    compileArgs: (source, output) => ['/out:' + output, source],
                    run: (output) => output,
                    needsCompile: true
                }
            };
            
            function executeCommand(command, args, options = {}) {
                return new Promise((resolve, reject) => {
                    let stdout = '';
                    let stderr = '';
                    let killed = false;
                    
                    const proc = spawn(command, args, {
                        ...options,
                        cwd: options.cwd || TEMP_DIR,
                        env: { ...process.env, PATH: process.env.PATH }
                    });
                    
                    const timeout = setTimeout(() => {
                        killed = true;
                        proc.kill('SIGKILL');
                        reject(new Error('执行超时'));
                    }, options.timeout || TIMEOUT);
                    
                    proc.stdout.on('data', (data) => {
                        if (stdout.length < MAX_OUTPUT_SIZE) {
                            stdout += data.toString();
                        }
                    });
                    
                    proc.stderr.on('data', (data) => {
                        if (stderr.length < MAX_OUTPUT_SIZE) {
                            stderr += data.toString();
                        }
                    });
                    
                    proc.on('close', (code) => {
                        clearTimeout(timeout);
                        if (killed) {
                            return;
                        }
                        resolve({ stdout, stderr, code });
                    });
                    
                    proc.on('error', (err) => {
                        clearTimeout(timeout);
                        reject(err);
                    });
                    
                    if (options.input) {
                        proc.stdin.write(options.input);
                        proc.stdin.end();
                    }
                });
            }
            
            function cleanupFiles(filePaths) {
                filePaths.forEach(filePath => {
                    try {
                        if (fs.existsSync(filePath)) {
                            if (fs.statSync(filePath).isDirectory()) {
                                fs.rmSync(filePath, { recursive: true, force: true });
                            } else {
                                fs.unlinkSync(filePath);
                            }
                        }
                    } catch (err) {
                        console.error('清理文件失败:', err);
                    }
                });
            }
            
            async function compileCode(language, code, input) {
                const config = languageConfig[language];
                if (!config) {
                    throw new Error('不支持的语言');
                }
                
                const sessionId = uuidv4();
                const sessionDir = path.join(TEMP_DIR, sessionId);
                fs.mkdirSync(sessionDir, { recursive: true });
                
                const sourceFile = path.join(sessionDir, `main.${config.extension}`);
                const outputFile = path.join(sessionDir, 'main.exe');
                const filesToCleanup = [sessionDir];
                
                try {
                    fs.writeFileSync(sourceFile, code);
                    
                    let compileResult = null;
                    
                    if (config.needsCompile) {
                        const compileArgs = config.compileArgs(sourceFile, outputFile);
                        
                        try {
                            compileResult = await executeCommand(config.compile, compileArgs, {
                                cwd: sessionDir,
                                timeout: TIMEOUT
                            });
                            
                            if (compileResult.code !== 0) {
                                return {
                                    success: false,
                                    error: '编译错误',
                                    compileOutput: compileResult.stderr || compileResult.stdout
                                };
                            }
                        } catch (err) {
                            if (err.message === '执行超时') {
                                return {
                                    success: false,
                                    error: '编译超时',
                                    compileOutput: '编译过程超时，请检查代码是否有死循环'
                                };
                            }
                            return {
                                success: false,
                                error: '编译器未安装或配置错误',
                                compileOutput: `错误: ${err.message}\n\n请确保已安装 ${config.name} 编译器并添加到系统PATH环境变量中。`
                            };
                        }
                    }
                    
                    let runCommand, runArgs;
                    
                    if (config.needsCompile) {
                        if (config.getClassName) {
                            const className = 'main';
                            runCommand = 'java';
                            runArgs = [className];
                        } else {
                            runCommand = outputFile;
                            runArgs = [];
                        }
                    } else {
                        const runConfig = config.run(sourceFile);
                        runCommand = runConfig[0];
                        runArgs = runConfig[1];
                    }
                    
                    try {
                        const runResult = await executeCommand(runCommand, runArgs, {
                            cwd: sessionDir,
                            input: input || '',
                            timeout: TIMEOUT
                        });
                        
                        return {
                            success: runResult.code === 0,
                            output: runResult.stdout,
                            error: runResult.stderr,
                            exitCode: runResult.code
                        };
                    } catch (err) {
                        if (err.message === '执行超时') {
                            return {
                                success: false,
                                error: '运行超时',
                                output: '程序执行超时，可能存在死循环或运行时间过长'
                            };
                        }
                        return {
                            success: false,
                            error: '运行错误',
                            output: err.message
                        };
                    }
                } finally {
                    setTimeout(() => cleanupFiles(filesToCleanup), 1000);
                }
            }
            
            app.post('/api/compile', async (req, res) => {
                const { language, code, input } = req.body;
                
                if (!language || !code) {
                    return res.status(400).json({
                        success: false,
                        error: '缺少必要参数'
                    });
                }
                
                try {
                    const result = await compileCode(language, code, input);
                    res.json(result);
                } catch (err) {
                    console.error('编译错误:', err);
                    res.status(500).json({
                        success: false,
                        error: '服务器内部错误',
                        message: err.message
                    });
                }
            });
            
            app.get('/api/languages', (req, res) => {
                const languages = Object.keys(languageConfig).map(key => ({
                    id: key,
                    name: languageConfig[key].name,
                    extension: languageConfig[key].extension
                }));
                res.json(languages);
            });
            
            app.get('/api/health', (req, res) => {
                res.json({ status: 'ok', timestamp: new Date().toISOString() });
            });
            
            server = app.listen(PORT, () => {
                console.log(`编译服务器已启动在端口 ${PORT}`);
                resolve(PORT);
            });
            
        } catch (err) {
            reject(err);
        }
    });
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1000,
        minHeight: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false
        },
        icon: path.join(__dirname, 'icon.png'),
        title: '本地代码编译器'
    });
    
    mainWindow.loadURL('http://localhost:3000');
    
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    
    mainWindow.webContents.on('new-window', (event, url) => {
        event.preventDefault();
        shell.openExternal(url);
    });
    
    const menuTemplate = [
        {
            label: '文件',
            submenu: [
                {
                    label: '新建',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('window.compiler && window.compiler.clearEditor()');
                    }
                },
                {
                    label: '下载代码',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('window.compiler && window.compiler.downloadCode()');
                    }
                },
                { type: 'separator' },
                {
                    label: '退出',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: '编辑',
            submenu: [
                { label: '撤销', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
                { label: '重做', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
                { type: 'separator' },
                { label: '剪切', accelerator: 'CmdOrCtrl+X', role: 'cut' },
                { label: '复制', accelerator: 'CmdOrCtrl+C', role: 'copy' },
                { label: '粘贴', accelerator: 'CmdOrCtrl+V', role: 'paste' },
                { label: '全选', accelerator: 'CmdOrCtrl+A', role: 'selectAll' }
            ]
        },
        {
            label: '运行',
            submenu: [
                {
                    label: '运行代码',
                    accelerator: 'CmdOrCtrl+Enter',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('window.compiler && window.compiler.runCode()');
                    }
                },
                {
                    label: '格式化代码',
                    accelerator: 'Shift+Alt+F',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('window.compiler && window.compiler.formatCode()');
                    }
                }
            ]
        },
        {
            label: '视图',
            submenu: [
                { label: '重新加载', accelerator: 'CmdOrCtrl+R', role: 'reload' },
                { label: '强制重新加载', accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload' },
                { type: 'separator' },
                { label: '实际大小', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
                { label: '放大', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
                { label: '缩小', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
                { type: 'separator' },
                { label: '全屏', accelerator: 'F11', role: 'togglefullscreen' },
                { label: '开发者工具', accelerator: 'F12', role: 'toggleDevTools' }
            ]
        },
        {
            label: '帮助',
            submenu: [
                {
                    label: '使用帮助',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('window.compiler && window.compiler.showHelp()');
                    }
                },
                {
                    label: '关于',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: '关于',
                            message: '本地代码编译器',
                            detail: '版本: 2.0.0\n支持 C、C++、Python、Java、JavaScript、Go、Rust、C# 等多种编程语言\n\n开发者: 在线代码编译器团队'
                        });
                    }
                }
            ]
        }
    ];
    
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
}

app.whenReady().then(async () => {
    try {
        console.log('正在启动编译服务器...');
        await startServer();
        console.log('编译服务器启动成功');
        
        createWindow();
    } catch (err) {
        console.error('启动失败:', err);
        dialog.showErrorBox('启动失败', `无法启动编译服务器: ${err.message}`);
        app.quit();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

app.on('before-quit', () => {
    if (server) {
        server.close();
    }
});

app.on('will-quit', () => {
    if (server) {
        server.close();
    }
});