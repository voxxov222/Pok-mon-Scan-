import fs from 'fs';
let code = fs.readFileSync('src/vca/components/Sidebar.tsx', 'utf-8');
code = code.replace(/<Sparkles,\s*Camera className="w-5 h-5 text-white" \/>/g, '<Sparkles className="w-5 h-5 text-white" />');
fs.writeFileSync('src/vca/components/Sidebar.tsx', code);
