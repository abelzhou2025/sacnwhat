#!/bin/bash
# 修复 Git 仓库结构脚本

cd /Users/abel/Desktop/scanwhat

echo "🔍 检查当前 Git 仓库根目录..."
GIT_ROOT=$(git rev-parse --show-toplevel)
echo "当前 Git 根目录: $GIT_ROOT"
echo "项目目录: $(pwd)"

if [ "$GIT_ROOT" != "$(pwd)" ]; then
    echo ""
    echo "⚠️  发现 Git 仓库根目录不在项目目录！"
    echo "这会导致 GitHub 上的路径包含 Desktop/scanwhat/"
    echo ""
    echo "正在修复..."
    echo ""
    
    # 备份当前的 git 配置
    if [ -d ".git" ]; then
        echo "📦 备份当前 .git 目录..."
        mv .git .git.backup.$(date +%s)
    fi
    
    # 重新初始化 git 仓库
    echo "🔄 重新初始化 Git 仓库..."
    git init
    
    # 添加所有文件
    echo "📝 添加文件到 Git..."
    git add .
    
    # 提交
    echo "💾 提交更改..."
    git commit -m "Fix: Reinitialize repository with correct structure"
    
    # 添加远程仓库
    echo "🔗 添加远程仓库..."
    git remote add origin https://github.com/abelzhou2025/sacnwhat.git 2>/dev/null || git remote set-url origin https://github.com/abelzhou2025/sacnwhat.git
    
    echo ""
    echo "✅ 修复完成！"
    echo ""
    echo "下一步："
    echo "1. 检查文件: git status"
    echo "2. 推送到 GitHub: git push -f origin main"
    echo ""
    echo "⚠️  注意: git push -f 会覆盖远程仓库，确保这是你想要的！"
else
    echo "✅ Git 仓库根目录正确，无需修复"
fi


