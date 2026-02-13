#!/bin/bash
# fix-hexo-resources.sh - 自动修复 Hexo ChatGPT Web 资源加载问题

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo "=========================================="
echo "Hexo ChatGPT Web 资源加载问题自动修复工具"
echo "=========================================="
echo ""

# 检查是否在 Hexo 项目根目录
if [ ! -f "_config.yml" ]; then
    echo -e "${RED}错误：请在 Hexo 项目根目录运行此脚本${NC}"
    exit 1
fi

# 检查 source/chatgpt 是否存在
if [ ! -d "source/chatgpt" ]; then
    echo -e "${RED}错误：未找到 source/chatgpt 目录${NC}"
    echo "请先创建 ChatGPT 页面和复制资源文件"
    exit 1
fi

echo -e "${YELLOW}[1/5] 检查资源文件...${NC}"
if [ ! -d "source/chatgpt/assets" ]; then
    echo -e "${RED}× 未找到 source/chatgpt/assets${NC}"
    echo "提示：请确保已从 chatgpt-web/dist/assets 复制了资源文件"
    exit 1
fi

# 获取实际的文件名
CSS_FILE=$(ls source/chatgpt/assets/*.css 2>/dev/null | head -1 | xargs basename)
JS_FILE=$(ls source/chatgpt/assets/*.js 2>/dev/null | head -1 | xargs basename)

if [ -z "$CSS_FILE" ] || [ -z "$JS_FILE" ]; then
    echo -e "${RED}× 未找到 CSS 或 JS 文件${NC}"
    echo "source/chatgpt/assets/ 中的文件："
    ls -la source/chatgpt/assets/
    exit 1
fi

echo -e "${GREEN}✓ 找到资源文件：${NC}"
echo "  CSS: $CSS_FILE"
echo "  JS:  $JS_FILE"
echo ""

# 查找主题名称
THEME=$(grep "^theme:" _config.yml | awk '{print $2}' | sed 's/[[:space:]]*//g')
if [ -z "$THEME" ]; then
    echo -e "${RED}错误：无法从 _config.yml 中读取主题名称${NC}"
    exit 1
fi

LAYOUT_FILE="themes/$THEME/layout/chatgpt.ejs"

if [ ! -f "$LAYOUT_FILE" ]; then
    echo -e "${RED}错误：未找到主题布局文件：$LAYOUT_FILE${NC}"
    exit 1
fi

echo -e "${YELLOW}[2/5] 找到主题：$THEME${NC}"
echo ""

echo -e "${YELLOW}[3/5] 创建备份...${NC}"
cp "$LAYOUT_FILE" "$LAYOUT_FILE.backup"
echo -e "${GREEN}✓ 备份已保存：$LAYOUT_FILE.backup${NC}"
echo ""

echo -e "${YELLOW}[4/5] 生成新的模板文件...${NC}"

# 创建新的 chatgpt.ejs（使用动态文件查找）
cat > "$LAYOUT_FILE" << 'TEMPLATE'
<!DOCTYPE html>
<html lang="<%= config.language %>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= page.title %> | <%= config.title %></title>
    
    <%
        // 动态查找 CSS 和 JS 文件
        const fs = require('fs');
        const path = require('path');
        const assetsDir = path.join(__dirname, '../../../source/chatgpt/assets');
        
        let cssFile = '';
        let jsFile = '';
        
        try {
            if (fs.existsSync(assetsDir)) {
                const files = fs.readdirSync(assetsDir);
                cssFile = files.find(f => f.startsWith('index') && f.endsWith('.css')) || '';
                jsFile = files.find(f => f.startsWith('index') && f.endsWith('.js')) || '';
                
                if (!cssFile || !jsFile) {
                    console.warn('[ChatGPT Web] CSS or JS file not found in assets directory');
                    console.warn('[ChatGPT Web] Files found:', files.filter(f => f.startsWith('index')));
                }
            } else {
                console.error('[ChatGPT Web] Assets directory not found:', assetsDir);
            }
        } catch (e) {
            console.error('[ChatGPT Web] Error reading assets directory:', e);
        }
    %>
    
    <% if (cssFile) { %>
    <link rel="stylesheet" href="<%= config.root %>chatgpt/assets/<%= cssFile %>">
    <% } else { %>
    <style>
        body::before {
            content: 'Error: CSS file not found. Check console for details.';
            color: red;
            display: block;
            padding: 20px;
        }
    </style>
    <% } %>
    
    <style>
        #app { 
            width: 100%; 
            height: 100vh; 
            margin: 0; 
            padding: 0; 
            overflow: hidden;
        }
        body { 
            margin: 0; 
            padding: 0; 
            overflow: hidden; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
    </style>
</head>
<body>
    <div id="app"></div>
    
    <% if (jsFile) { %>
    <script type="module" src="<%= config.root %>chatgpt/assets/<%= jsFile %>"></script>
    <% } else { %>
    <script>
        document.body.innerHTML = '<div style="color: red; padding: 20px;"><h1>Error</h1><p>ChatGPT Web JavaScript file not found.</p><p>Check the console and chatgpt.ejs configuration.</p></div>';
        console.error('[ChatGPT Web] JS file not found in assets directory');
    </script>
    <% } %>
</body>
</html>
TEMPLATE

echo -e "${GREEN}✓ 模板已更新${NC}"
echo ""

echo -e "${YELLOW}[5/5] 清除缓存并重新生成...${NC}"
hexo clean
echo "正在生成静态文件..."
hexo generate

echo ""
echo "=========================================="
echo -e "${GREEN}✓ 修复完成！${NC}"
echo "=========================================="
echo ""
echo "后续步骤："
echo "  1. 启动本地服务器："
echo "     hexo server"
echo ""
echo "  2. 打开浏览器访问："
echo "     http://localhost:4000/chatgpt/"
echo ""
echo "  3. 按 F12 打开开发者工具，检查 Network 标签"
echo "     - 资源文件应该返回 200 状态码"
echo "     - 不应该有 404 错误"
echo ""
echo "如果还有问题："
echo "  - 检查 public/chatgpt/assets/ 中是否有资源文件"
echo "  - 确认 source/chatgpt/assets/ 不为空"
echo "  - 查看浏览器控制台的错误信息"
echo ""
