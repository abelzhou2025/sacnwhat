# 🚀 快速修复 GitHub 仓库结构

## 问题

Git 仓库根目录在 `/Users/abel/Desktop`，导致 GitHub 上的路径是 `Desktop/scanwhat/`。

## 快速修复步骤

### 方法 1: 使用修复脚本（推荐）

在终端中运行：

```bash
cd /Users/abel/Desktop/scanwhat
./fix-repo.sh
git push -f origin main
```

### 方法 2: 手动修复

```bash
cd /Users/abel/Desktop/scanwhat

# 1. 备份并移除当前的 .git
mv .git .git.backup

# 2. 重新初始化
git init

# 3. 添加所有文件
git add .

# 4. 提交
git commit -m "Fix: Reinitialize repository with correct structure"

# 5. 添加远程仓库
git remote add origin https://github.com/abelzhou2025/sacnwhat.git

# 6. 强制推送（覆盖远程仓库）
git push -f origin main
```

⚠️ **重要**: `git push -f` 会覆盖远程仓库，确保这是你想要的！

## 验证修复

修复后，访问 GitHub: https://github.com/abelzhou2025/sacnwhat

应该看到：
- ✅ 文件直接在仓库根目录（不是 `Desktop/scanwhat/`）
- ✅ `public/_redirects` 文件存在
- ✅ `build-fix.js` 文件存在
- ✅ 所有源代码文件都在根目录

## 关于 assets 文件夹

`assets/` 文件夹是构建产物，**不应该**在 GitHub 上：
- ✅ 这是正常的
- ✅ 它会在 Netlify 构建时自动生成
- ✅ `.gitignore` 已经配置忽略 `dist/` 目录

## 修复后的文件结构

```
sacnwhat/                    ← GitHub 仓库根目录
├── public/
│   └── _redirects          ← 必须存在
├── build-fix.js            ← 必须存在
├── netlify.toml
├── package.json
├── vite.config.ts
├── index.html
├── App.tsx
├── components/
├── services/
├── utils/
└── ... (其他文件)
```

## 下一步

1. ✅ 修复仓库结构
2. ✅ 验证 GitHub 上的文件
3. ⏳ 等待 Netlify 额度恢复或使用其他部署服务

