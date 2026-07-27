const fs = require('fs');
let code = fs.readFileSync('src/vca/components/Sidebar.tsx', 'utf-8');
code = code.replace(/\{ @ts-ignore \}\n\s*\{item\.badge \{item\.badge \&\& \(\{item\.badge \&\& \( \(/g, '{/* @ts-ignore */}\n                {item.badge && (');
fs.writeFileSync('src/vca/components/Sidebar.tsx', code);
