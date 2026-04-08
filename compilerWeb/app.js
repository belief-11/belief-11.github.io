class CodeCompiler {
    constructor() {
        this.editor = null;
        this.currentLanguage = 'python';
        this.isRunning = false;
        
        // 多个API服务配置
        this.apiServices = [
            {
                name: 'Judge0',
                url: 'https://ce.judge0.com/submissions/',
                active: true
            },
            {
                name: 'Wandbox',
                url: 'https://wandbox.org/api/compile.json',
                active: true
            },
            {
                name: 'Piston',
                url: 'https://emkc.org/api/v2/piston/execute',
                active: true
            }
        ];
        
        this.languageConfig = {
            c: {
                name: 'C',
                extension: 'c',
                defaultCode: `#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}`,
                language: 'c',
                wandbox: 'gcc-9.2.0',
                piston: 'c',
                judge0: 50
            },
            cpp: {
                name: 'C++',
                extension: 'cpp',
                defaultCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
                language: 'c++',
                wandbox: 'gcc-9.2.0',
                piston: 'cpp',
                judge0: 54
            },
            python: {
                name: 'Python 3',
                extension: 'py',
                defaultCode: `print("Hello, World!")`,
                language: 'python',
                wandbox: 'python-3.8.2',
                piston: 'python3',
                judge0: 71
            },
            java: {
                name: 'Java',
                extension: 'java',
                defaultCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
                language: 'java',
                wandbox: 'openjdk-14.0.2',
                piston: 'java',
                judge0: 62
            },
            javascript: {
                name: 'JavaScript',
                extension: 'js',
                defaultCode: `console.log("Hello, World!");`,
                language: 'javascript',
                wandbox: 'nodejs-14.15.0',
                piston: 'javascript',
                judge0: 63
            },
            go: {
                name: 'Go',
                extension: 'go',
                defaultCode: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
                language: 'go',
                wandbox: 'go-1.13.5',
                piston: 'go',
                judge0: 60
            },
            rust: {
                name: 'Rust',
                extension: 'rs',
                defaultCode: `fn main() {
    println!("Hello, World!");
}`,
                language: 'rust',
                wandbox: 'rust-1.42.0',
                piston: 'rust',
                judge0: 73
            },
            csharp: {
                name: 'C#',
                extension: 'cs',
                defaultCode: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`,
                language: 'csharp',
                wandbox: 'dotnetcore-3.1',
                piston: 'csharp',
                judge0: 51
            }
        };
        
        this.init();
    }
    
    async init() {
        await this.loadMonacoEditor();
        this.initEditor();
        this.bindEvents();
        this.loadSavedCode();
    }
    
    async loadMonacoEditor() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js';
            script.onload = () => {
                require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' }});
                require(['vs/editor/editor.main'], resolve);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    initEditor() {
        const config = this.languageConfig[this.currentLanguage];
        
        this.editor = monaco.editor.create(document.getElementById('editor'), {
            value: config.defaultCode,
            language: config.language,
            theme: this.getTheme(),
            fontSize: 14,
            fontFamily: "'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
            lineNumbers: 'on',
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            wordWrap: 'on',
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            parameterHints: { enabled: true },
            folding: true,
            foldingStrategy: 'auto',
            showFoldingControls: 'always',
            matchBrackets: 'always',
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            autoIndent: 'full',
            renderWhitespace: 'selection',
            rulers: [80],
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            padding: { top: 16, bottom: 16 }
        });
        
        this.updateCursorPosition();
        this.editor.onDidChangeCursorPosition(() => this.updateCursorPosition());
        this.editor.onDidChangeModelContent(() => this.saveCode());
    }
    
    getTheme() {
        return document.documentElement.getAttribute('data-theme') === 'dark' ? 'vs-dark' : 'vs';
    }
    
    updateCursorPosition() {
        const position = this.editor.getPosition();
        document.getElementById('cursorPosition').textContent = `行 ${position.lineNumber}, 列 ${position.column}`;
    }
    
    bindEvents() {
        document.getElementById('languageSelect').addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });
        
        document.getElementById('runBtn').addEventListener('click', () => this.runCode());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearEditor());
        document.getElementById('formatBtn').addEventListener('click', () => this.formatCode());
        
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        document.getElementById('helpBtn').addEventListener('click', () => this.showHelp());
        document.getElementById('closeHelpBtn').addEventListener('click', () => this.hideHelp());
        
        document.getElementById('copyOutputBtn').addEventListener('click', () => this.copyOutput());
        document.getElementById('clearOutputBtn').addEventListener('click', () => this.clearOutput());
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                this.runCode();
            }
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.downloadCode();
            }
        });
        
        window.addEventListener('resize', () => {
            if (this.editor) {
                this.editor.layout();
            }
        });
        
        document.getElementById('helpModal').addEventListener('click', (e) => {
            if (e.target.id === 'helpModal') {
                this.hideHelp();
            }
        });
    }
    
    changeLanguage(language) {
        if (this.isRunning) {
            this.showToast('代码正在运行，请稍后再试', 'warning');
            return;
        }
        
        const currentCode = this.editor.getValue();
        const currentConfig = this.languageConfig[this.currentLanguage];
        
        if (currentCode.trim() !== '' && currentCode !== currentConfig.defaultCode) {
            localStorage.setItem(`code_${this.currentLanguage}`, currentCode);
        }
        
        const config = this.languageConfig[language];
        // 切换语言时自动清空，使用默认模板
        this.editor.setValue(config.defaultCode);
        
        monaco.editor.setModelLanguage(this.editor.getModel(), config.language);
        document.getElementById('languageLabel').textContent = config.name;
        this.currentLanguage = language;
        
        this.showToast(`已切换到 ${config.name}`, 'success');
    }
    
    async runCode() {
        if (this.isRunning) {
            this.showToast('代码正在运行中...', 'warning');
            return;
        }
        
        const code = this.editor.getValue().trim();
        if (!code) {
            this.showToast('请输入代码后再运行', 'error');
            return;
        }
        
        this.isRunning = true;
        this.setRunningState(true);
        
        const config = this.languageConfig[this.currentLanguage];
        const input = document.getElementById('input').value;
        
        try {
            this.showOutput('正在编译和运行代码...', 'info');
            
            // 尝试所有可用的API服务
            for (const service of this.apiServices) {
                if (!service.active) continue;
                
                try {
                    this.showOutput(`正在使用 ${service.name} 服务编译...`, 'info');
                    
                    let response, result;
                    
                    if (service.name === 'Judge0') {
                        const requestData = {
                            source_code: code,
                            language_id: config.judge0,
                            stdin: input
                        };
                        
                        response = await axios.post(service.url, requestData, {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            timeout: 10000
                        });
                        
                        const token = response.data.token;
                        result = await this.handleJudge0Result(token);
                    } else if (service.name === 'Wandbox') {
                        const requestData = {
                            compiler: config.wandbox,
                            code: code,
                            stdin: input,
                            save: false
                        };
                        
                        if (this.currentLanguage === 'cpp') {
                            requestData.options = 'warning,gnu++1y';
                        }
                        
                        response = await axios.post(service.url, requestData, {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            timeout: 20000
                        });
                        result = this.handleWandboxResult(response.data);
                    } else if (service.name === 'Piston') {
                        const requestData = {
                            language: config.piston,
                            version: '*',
                            files: [{
                                content: code
                            }],
                            stdin: input,
                            args: []
                        };
                        
                        response = await axios.post(service.url, requestData, {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            timeout: 20000
                        });
                        result = this.handlePistonResult(response.data);
                    }
                    
                    // 如果Judge0 API返回了错误信息，显示错误信息并停止尝试其他服务
                    // 因为这是代码本身的错误，而不是服务的错误
                    if (result !== 'error') {
                        return;
                    } else if (service.name === 'Judge0') {
                        // Judge0 API已经返回了错误信息，停止尝试其他服务
                        return;
                    }
                } catch (serviceError) {
                    console.error(`${service.name} 服务错误:`, serviceError);
                    continue;
                }
            }
            
            // 所有服务都失败
            this.showOutput('所有编译服务都暂时不可用\n\n请：\n1. 检查网络连接\n2. 稍后重试\n3. 尝试其他编程语言', 'error');
            this.setRunningState(false, 'error');
        } catch (error) {
            console.error('执行错误:', error);
            this.showOutput('发生未知错误，请稍后重试', 'error');
            this.setRunningState(false, 'error');
        } finally {
            this.isRunning = false;
        }
    }
    
    handleWandboxResult(data) {
        let output = '';
        
        if (data.status && data.status !== '0') {
            output = `编译/运行错误 (状态码: ${data.status}):\n`;
            if (data.compiler_error) {
                output += data.compiler_error;
            } else if (data.program_error) {
                output += data.program_error;
            } else if (data.compiler_message) {
                output += data.compiler_message;
            } else {
                output += '未知错误';
            }
            this.showOutput(output, 'error');
            this.setRunningState(false, 'error');
            return 'error';
        }
        
        if (data.program_output) {
            output = data.program_output;
        } else if (data.compiler_message) {
            output = data.compiler_message;
        }
        
        if (output && output.trim()) {
            this.showOutput(output, 'success');
            this.setRunningState(false, 'ready');
            this.showToast('代码执行成功', 'success');
        } else {
            this.showOutput('代码执行成功，但没有输出', 'info');
            this.setRunningState(false, 'ready');
        }
        return 'success';
    }
    
    handlePistonResult(data) {
        let output = '';
        
        if (data.run && data.run.stderr) {
            output = `编译/运行错误:\n${data.run.stderr}`;
            this.showOutput(output, 'error');
            this.setRunningState(false, 'error');
            return 'error';
        }
        
        if (data.run && data.run.stdout) {
            output = data.run.stdout;
        }
        
        if (output && output.trim()) {
            this.showOutput(output, 'success');
            this.setRunningState(false, 'ready');
            this.showToast('代码执行成功', 'success');
        } else {
            this.showOutput('代码执行成功，但没有输出', 'info');
            this.setRunningState(false, 'ready');
        }
        return 'success';
    }
    
    async handleJudge0Result(token) {
        const url = `https://ce.judge0.com/submissions/${token}?base64_encoded=false`;
        const maxRetries = 30;
        const retryInterval = 1000;
        
        for (let i = 0; i < maxRetries; i++) {
            try {
                const response = await axios.get(url, {
                    timeout: 5000
                });
                
                const data = response.data;
                const status = data.status;
                
                if (status && status.id === 3) { // Accepted
                    let output = '';
                    if (data.stdout) {
                        output = data.stdout;
                    }
                    
                    if (output && output.trim()) {
                        this.showOutput(output, 'success');
                        this.setRunningState(false, 'ready');
                        this.showToast('代码执行成功', 'success');
                    } else {
                        this.showOutput('代码执行成功，但没有输出', 'info');
                        this.setRunningState(false, 'ready');
                    }
                    return 'success';
                } else if (status && status.id >= 6) { // Error states
                    let output = '';
                    if (data.compile_output) {
                        output = `编译错误:\n${data.compile_output}`;
                    } else if (data.stderr) {
                        output = `运行时错误:\n${data.stderr}`;
                    } else if (data.message) {
                        output = `错误:\n${data.message}`;
                    } else {
                        output = `执行错误: ${status.description}`;
                    }
                    this.showOutput(output, 'error');
                    this.setRunningState(false, 'error');
                    return 'error';
                }
                
                // 继续轮询
                await new Promise(resolve => setTimeout(resolve, retryInterval));
            } catch (error) {
                console.error('Judge0轮询错误:', error);
                return 'error';
            }
        }
        
        // 超时
        this.showOutput('执行超时，请稍后重试', 'error');
        this.setRunningState(false, 'error');
        return 'error';
    }
    
    showOutput(text, type = 'info') {
        const outputElement = document.getElementById('output');
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        
        let formattedOutput = text;
        
        if (type === 'error') {
            formattedOutput = this.formatErrorOutput(text);
        }
        
        outputElement.innerHTML = `<pre style="color: ${colors[type]}; margin: 0; white-space: pre-wrap; word-wrap: break-word;">${this.escapeHtml(formattedOutput)}</pre>`;
    }
    
    formatErrorOutput(errorText) {
        let formatted = errorText;
        
        const errorPatterns = [
            { pattern: /error:/gi, replacement: '<strong style="color: #ef4444;">错误:</strong>' },
            { pattern: /warning:/gi, replacement: '<strong style="color: #f59e0b;">警告:</strong>' },
            { pattern: /(\d+):(\d+):/g, replacement: '<span style="color: #3b82f6;">$1:$2:</span>' },
            { pattern: /'([^']+)'/g, replacement: '<code style="background: #f1f5f9; padding: 2px 4px; border-radius: 3px;">$1</code>' }
        ];
        
        errorPatterns.forEach(({ pattern, replacement }) => {
            formatted = formatted.replace(pattern, replacement);
        });
        
        return formatted;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    setRunningState(running, status = 'running') {
        const runBtn = document.getElementById('runBtn');
        const statusIndicator = document.querySelector('.status-indicator');
        const statusText = document.querySelector('.status-text');
        
        runBtn.disabled = running;
        
        statusIndicator.className = `status-indicator ${status}`;
        
        const statusMessages = {
            running: '正在运行...',
            ready: '就绪',
            error: '执行失败'
        };
        
        statusText.textContent = statusMessages[status];
    }
    
    clearEditor() {
        if (this.isRunning) {
            this.showToast('代码正在运行，请稍后再试', 'warning');
            return;
        }
        
        const config = this.languageConfig[this.currentLanguage];
        this.editor.setValue(config.defaultCode);
        this.showToast('编辑器已清空', 'info');
    }
    
    formatCode() {
        if (this.isRunning) {
            this.showToast('代码正在运行，请稍后再试', 'warning');
            return;
        }
        
        this.editor.getAction('editor.action.formatDocument').run();
        this.showToast('代码已格式化', 'success');
    }
    
    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        monaco.editor.setTheme(this.getTheme());
        
        const icon = document.querySelector('#themeToggle i');
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        
        localStorage.setItem('theme', newTheme);
        this.showToast(`已切换到${newTheme === 'dark' ? '深色' : '浅色'}主题`, 'info');
    }
    
    showHelp() {
        document.getElementById('helpModal').classList.add('active');
    }
    
    hideHelp() {
        document.getElementById('helpModal').classList.remove('active');
    }
    
    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}Tab`);
        });
    }
    
    copyOutput() {
        const output = document.getElementById('output').textContent;
        if (!output || output.includes('点击"运行代码"按钮执行你的代码')) {
            this.showToast('没有可复制的内容', 'warning');
            return;
        }
        
        navigator.clipboard.writeText(output).then(() => {
            this.showToast('输出已复制到剪贴板', 'success');
        }).catch(() => {
            this.showToast('复制失败', 'error');
        });
    }
    
    clearOutput() {
        document.getElementById('output').innerHTML = `
            <div class="placeholder">
                <i class="fas fa-info-circle"></i>
                <p>点击"运行代码"按钮执行你的代码</p>
            </div>
        `;
        this.setRunningState(false, 'ready');
        this.showToast('输出已清空', 'info');
    }
    
    saveCode() {
        const code = this.editor.getValue();
        localStorage.setItem(`code_${this.currentLanguage}`, code);
    }
    
    loadSavedCode() {
        const savedCode = localStorage.getItem(`code_${this.currentLanguage}`);
        if (savedCode) {
            this.editor.setValue(savedCode);
        }
        
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            const icon = document.querySelector('#themeToggle i');
            icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
    
    downloadCode() {
        const code = this.editor.getValue();
        const config = this.languageConfig[this.currentLanguage];
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `main.${config.extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showToast('代码已下载', 'success');
    }
    
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        toast.innerHTML = `<i class="fas ${icons[type]}"></i><span>${message}</span>`;
        toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

let compiler;

document.addEventListener('DOMContentLoaded', () => {
    compiler = new CodeCompiler();
    window.compiler = compiler;
});