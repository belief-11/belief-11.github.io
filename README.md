<div align="center">

# 🔄 Easy LVR

### 便捷本地版本控制 · 无需 Git · 告别后悔药

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/user/easy-lvr)
[![Python](https://img.shields.io/badge/python-3.11+-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![Platform](https://img.shields.io/badge/platform-Windows-0078D4.svg?logo=windows&logoColor=white)](https://www.microsoft.com/windows)
[![License](https://img.shields.io/badge/license-custom-green.svg)](LICENSE.txt)
[![AI Ready](https://img.shields.io/badge/AI%20Ready-vcsnap%20CLI-purple.svg)](VCSNAP_CLI.md)

**一键版本快照 · 时间线回滚 · 代码级差异对比 · AI 编码助手集成**

[📥 下载安装](#-安装) · [🚀 快速开始](#-快速开始) · [⌨️ CLI 指南](#️-vcsnap-cli) · [🤖 AI 集成](#-ai-agent-集成)

</div>

---

## ✨ 为什么选择 Easy LVR？

你是否曾在编码时遇到过这些场景？

> 😱 "AI 帮我改了一堆代码，跑不起来了，又不知道改了哪里……"
>
> 😰 "重构到一半发现方向错了，但已经回不去了……"
>
> 🤦 "昨天还能跑的代码，今天不知道被谁改坏了……"

**Easy LVR** 就是为此而生——一个轻量级本地版本控制工具，让你在每次重大改动前一键保存快照，随时回滚到任意历史版本，**无需 Git 的复杂性**，**无需联网**，**零学习成本**。

---

## 🎯 核心特性

### 📸 增量版本快照
基于 SHA256 内容寻址存储，只保存变更的文件，未修改的文件自动复用。100 次提交可能只占 1 次的空间。

### 🕐 可视化时间线
直观的版本时间线，清晰展示每次提交的变更摘要。一键回滚到任意历史版本，支持原子级回滚（先备份当前状态，失败自动恢复）。

### 🔍 代码级差异对比
文件级 + 行级 diff 对比，新增/修改/删除一目了然。代码高亮显示，精确定位每一处变更。

### 📂 单文件精准回滚
不需要回滚整个项目？选中单个文件即可独立回滚，不影响项目中的其他文件。

### 🤖 AI Agent 深度集成
内置 `vcsnap` CLI 工具，提供 `--json` 结构化输出，专为 Cursor、Claude Code、Aider、OpenAI Codex CLI 等 AI 编码助手设计，让 AI 自动管理你的版本。

### 🛡️ 纯本地 · 零隐私
- **完全离线运行**——没有任何网络请求
- **零数据上传**——所有数据只存储在你本地的 `.lvm/` 目录
- **零隐私收集**——不收集任何用户信息
- **干净卸载**——不修改注册表，不访问系统目录

---

## 🖼️ 应用预览

### 现代化 GUI（LocalVersionManager）

| 深色模式 | 浅色模式 |
|:---:|:---:|
| 🌙 沉浸式深色界面 | ☀️ 清爽浅色界面 |
| 版本时间线 · 文件树 · Diff 对比 | 项目管理 · 快捷设置 · 主题切换 |

**界面亮点：**
- 🎨 Win11 风格 Fluent Design
- 📋 侧边栏多项目快速切换
- 📊 版本卡片变更摘要（新增 / 修改 / 删除文件数）
- 🌐 中英双语 UI，语言偏好自动持久化
- 🔄 CLI → GUI 自动刷新（后台监控数据库变更）

---

## 📥 安装

### Windows 安装包（推荐）

下载最新版安装包，双击安装即可使用：

👉 [**前往官网下载**](https://easy-lvr.app)

### 从源码安装

```bash
# 克隆仓库
git clone https://github.com/user/easy-lvr.git
cd easy-lvr

# 安装依赖
pip install -r requirements.txt

# 启动 GUI 应用
python main.py
```

---

## 🚀 快速开始

### GUI 使用流程

```
添加项目 → 一键提交快照 → 继续编码 → 查看版本历史 → 按需回滚
```

1. **添加项目**——点击侧边栏 `+` 按钮，选择你的项目目录
2. **创建快照**——在工具栏点击 `提交版本`，输入版本描述
3. **查看历史**——版本时间线自动展示所有快照
4. **差异对比**——选择任意两个版本，查看文件级和行级差异
5. **回滚恢复**——一键回滚到任意版本，或仅回滚单个文件

### CLI 使用流程

```bash
# 在项目目录下初始化
vcsnap init

# 创建版本快照
vcsnap commit -m "重构登录模块"

# 查看版本历史
vcsnap log

# 回滚到上一个版本
vcsnap rollback latest

# 查看当前版本状态
vcsnap status

# 对比两个版本的差异
vcsnap diff v1 v2
```

---

## ⌨️ vcsnap CLI

`vcsnap` 是 Easy LVR 的命令行工具，提供 8 个核心命令，支持 `--json` 结构化输出，专为 AI Agent 集成和自动化脚本设计。

### 命令一览

| 命令 | 说明 | 示例 |
|------|------|------|
| `init` | 初始化版本仓库 | `vcsnap init` |
| `commit` | 创建版本快照 | `vcsnap commit -m "feat: 添加用户认证"` |
| `rollback` | 回滚到指定版本 | `vcsnap rollback latest` / `vcsnap rollback <version-id>` |
| `log` | 查看版本历史 | `vcsnap log` / `vcsnap log --limit 10` |
| `current` | 显示当前版本信息 | `vcsnap current` |
| `status` | 查看工作区变更状态 | `vcsnap status` |
| `diff` | 对比版本差异 | `vcsnap diff <v1> <v2>` / `vcsnap diff <v1> <v2> --file path/to/file` |
| `cleanup` | 清理旧版本数据 | `vcsnap cleanup --keep 10` |

### 全局选项

```bash
--json          # JSON 结构化输出（AI Agent 模式）
--project PATH  # 指定项目路径（默认当前目录）
--help          # 显示帮助信息
```

### JSON 输出示例

```bash
vcsnap log --json
```

```json
{
  "versions": [
    {
      "id": "v_abc123",
      "message": "重构登录模块",
      "timestamp": "2025-05-26T10:30:00",
      "files_added": 3,
      "files_modified": 7,
      "files_deleted": 1
    }
  ]
}
```

> 📖 完整 CLI 文档请参阅 [VCSNAP_CLI.md](VCSNAP_CLI.md)

---

## 🤖 AI Agent 集成

Easy LVR 原生支持 AI 编码助手集成。通过 `vcsnap` CLI 的 `--json` 输出，AI Agent 可以：

- ✅ 在每次代码修改前**自动创建版本快照**
- ✅ 修改完成后**对比变更差异**
- ✅ 出现问题时**自动回滚到安全状态**
- ✅ **结构化读取**版本历史和文件变更

### 支持的 AI 工具

| 工具 | 集成方式 |
|------|----------|
| **Cursor** | 通过 Skill 文件自动触发 |
| **Claude Code** | 通过 Skill 文件自动触发 |
| **Aider** | 通过 Skill 文件自动触发 |
| **OpenAI Codex CLI** | 通过 Skill 文件自动触发 |
| **WorkBuddy** | 原生内置支持 |

### Skill 文件

项目内置可导出的 Skill 文件（v1.0.1），包含 MANDATORY 触发条件：

```yaml
# 触发条件示例
MANDATORY:
  - 当用户请求修改代码时，先执行 vcsnap commit -m "修改前快照"
  - 当用户请求回滚时，执行 vcsnap rollback <version-id>
  - 当用户请求查看变更时，执行 vcsnap diff --json
```

---

## 🏗️ 技术架构

### 分层设计

```
┌─────────────────────────────────────────┐
│             UI 表现层 (src/ui/)          │
│    Flet GUI · i18n · Theme · Components  │
├─────────────────────────────────────────┤
│           CLI 接口层 (src/cli/)          │
│    Typer · Rich · JSON Output · Skill    │
├─────────────────────────────────────────┤
│           业务逻辑层 (src/core/)         │
│  BackupEngine · RollbackEngine · Diff    │
├─────────────────────────────────────────┤
│           数据持久层 (src/db/)           │
│    SQLite WAL · Migrations · Models      │
├─────────────────────────────────────────┤
│             工具层 (src/utils/)          │
│    SHA256 · Path · FileOps · Constants   │
└─────────────────────────────────────────┘
```

### 存储机制

| 数据类型 | 存储方式 | 说明 |
|----------|----------|------|
| 版本元数据 | SQLite（WAL 模式） | 全局库 `~/.localversionmanager/global.db` + 项目库 `.lvm/repo.db` |
| 文件内容 | SHA256 内容寻址 | `.lvm/objects/<hash前2位>/<hash>` 去重存储 |
| 忽略规则 | 项目配置 | 内置默认规则 + 用户自定义 `.lvmignore` |

### 关键技术决策

- **增量备份**：基于 SHA256 哈希的内容寻址存储，未修改文件零冗余
- **原子回滚**：回滚前自动备份当前工作目录，失败时完整恢复
- **线程安全**：`threading.local()` 管理 SQLite 连接，WAL 模式支持跨进程读
- **单实例锁**：Windows Named Mutex 防止多开
- **CLI→GUI 自动刷新**：后台监控 `.lvm/repo.db` 和 WAL 文件 mtime，检测变更自动刷新 UI

### 智能忽略规则

默认自动忽略常见的不需要版本控制的文件和目录：

```
# 编译产物
__pycache__/  *.pyc  *.pyo  *.exe  *.dll  build/  dist/

# 依赖目录
node_modules/  .venv/  venv/  env/

# IDE 配置
.vscode/  .idea/  *.swp  *.swo

# 大文件（默认 > 500MB 自动跳过）
```

支持 `.lvmignore` 自定义忽略规则。

---

## 📁 项目结构

```
LocalVersionManager/
├── main.py                        # GUI 入口（SSL 配置、单实例锁、Flet 启动）
├── cli.py                         # CLI 入口（vcsnap 命令行）
├── pyproject.toml                 # 项目配置与依赖
├── requirements.txt               # 依赖清单
├── VCSNAP_CLI.md                  # CLI 完整文档
├── src/
│   ├── cli/                       # ⌨️ CLI 层
│   │   ├── app.py                 # Typer 应用、命令注册
│   │   ├── context.py             # 上下文管理（项目路径解析）
│   │   ├── output.py              # Rich 美化输出
│   │   ├── errors.py              # 错误处理
│   │   └── commands/              # 8 个子命令
│   │       ├── init.py            # vcsnap init
│   │       ├── commit.py          # vcsnap commit
│   │       ├── rollback.py        # vcsnap rollback
│   │       ├── log.py             # vcsnap log
│   │       ├── current.py         # vcsnap current
│   │       ├── status.py          # vcsnap status
│   │       ├── diff.py            # vcsnap diff
│   │       └── cleanup.py         # vcsnap cleanup
│   ├── core/                      # 🧠 业务逻辑层
│   │   ├── project_manager.py     # 项目 CRUD
│   │   ├── version_manager.py     # 版本创建/查询/删除
│   │   ├── backup_engine.py       # 增量备份（SHA256 去重）
│   │   ├── rollback_engine.py     # 原子回滚（整项目 + 单文件）
│   │   ├── diff_engine.py         # 文件级 + 行级差异对比
│   │   └── ignore_rules.py        # 智能忽略规则引擎
│   ├── db/                        # 💾 数据库层
│   │   ├── database.py            # SQLite 连接池（WAL、线程安全）
│   │   ├── models.py              # 数据模型（Project, Version, VersionFile...）
│   │   └── migrations.py          # Schema 版本迁移
│   ├── ui/                        # 🎨 UI 表现层
│   │   ├── app.py                 # 主应用（导航、状态、Win32 居中）
│   │   ├── theme.py               # 深色/浅色主题定义
│   │   ├── i18n.py                # 中英国际化（语言持久化）
│   │   ├── components/            # 可复用组件
│   │   │   ├── sidebar.py         # 侧边栏（项目列表）
│   │   │   ├── toolbar.py         # 顶部工具栏
│   │   │   ├── timeline.py        # 版本时间线
│   │   │   ├── file_tree.py       # 文件树（新增/修改/删除标记）
│   │   │   ├── diff_view.py       # 差异对比面板
│   │   │   ├── version_graph.py   # 版本关系图
│   │   │   ├── statusbar.py       # 底部状态栏
│   │   │   └── dialogs.py         # 自定义对话框
│   │   └── pages/                 # 页面
│   │       ├── project_page.py    # 项目主页（版本管理核心）
│   │       └── settings_page.py   # 设置页（主题/语言/快捷方式）
│   └── utils/                     # 🔧 工具层
│       ├── constants.py           # 应用常量
│       ├── hash_utils.py          # SHA256 流式哈希（64KB 分块）
│       ├── path_utils.py          # 路径规范化与安全检查
│       └── file_utils.py          # 安全文件操作、文本/二进制检测
├── assets/
│   └── icons/                     # 应用图标
├── website/                       # 官网源码
└── tests/                         # 测试用例
```

---

## 🛠️ 开发

### 环境要求

- Python 3.11+
- Windows 10 / Windows 11

### 开发环境搭建

```bash
# 克隆项目
git clone https://github.com/user/easy-lvr.git
cd easy-lvr

# 创建虚拟环境
python -m venv .venv
.venv\Scripts\activate     # Windows
# source .venv/bin/activate  # macOS/Linux

# 安装开发依赖
pip install -e ".[dev]"
```

### 运行

```bash
# 启动 GUI
python main.py

# 使用 CLI
python cli.py init
python cli.py commit -m "test"
python cli.py log
```

### 打包

```bash
# 打包为 EXE
build_exe.bat

# 打包为 MSIX（Microsoft Store）
build_msix.bat
```

---

## 🤝 适用场景

| 场景 | Easy LVR 的价值 |
|------|-----------------|
| **AI 辅助编码** | AI 修改代码前自动快照，出问题一键回滚 |
| **快速原型开发** | 每次实验前提交快照，大胆尝试不怕翻车 |
| **学习项目** | 保存每个学习阶段的代码状态，回顾成长轨迹 |
| **配置文件管理** | 版本化管理系统配置，误改随时恢复 |
| **文档写作** | 保存每稿修改，对比版本差异 |
| **小团队协作** | 无需 Git 服务器，本地版本管理零配置 |

---

## ❓ Easy LVR vs Git

| 特性 | Easy LVR | Git |
|------|----------|-----|
| 学习成本 | ⭐ 几乎为零 | ⭐⭐⭐⭐ 需要理解暂存区、分支等概念 |
| 安装配置 | 双击安装即可 | 需要 SSH Key、全局配置 |
| 离线使用 | ✅ 完全离线 | ✅ 完全离线 |
| 版本快照 | 一键提交整个项目 | 需要 add → commit 两步 |
| 回滚操作 | 一键回滚，自动备份 | 需要 revert / reset，操作复杂 |
| 差异对比 | GUI 内置，可视化 | 需要第三方工具或 git diff |
| 分支管理 | ❌ 无（线性版本） | ✅ 强大的分支模型 |
| 远程协作 | ❌ 纯本地 | ✅ GitHub / GitLab 等 |
| AI 集成 | ✅ 原生 CLI JSON 输出 | ⚠️ 需要额外配置 |

> 💡 **简单来说**：如果你需要分支、远程协作和复杂工作流，选 Git。如果你只想在本地快速保存和恢复项目版本，选 Easy LVR。两者可以并存——Easy LVR 管本地快照，Git 管远程协作。

---

## 📜 许可证

本项目采用自定义许可证，详见 [LICENSE.txt](LICENSE.txt)。

- ✅ 个人免费使用
- ✅ 可修改和分发
- ❌ 未经授权不得商业转售

---

## 🌟 Star History

如果 Easy LVR 对你有帮助，欢迎给个 ⭐ Star！

---

<div align="center">

**用最简单的方式，保护你的每一行代码。**

Made with ❤️ for developers who value their code.

</div>
