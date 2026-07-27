import fs from 'fs';
let code = fs.readFileSync('src/vca/components/Sidebar.tsx', 'utf-8');
code = code.replace(/const navItems = \[/g, 'const navItems: Array<{ id: TabType; label: string; icon: any; badge?: string }> = [');
fs.writeFileSync('src/vca/components/Sidebar.tsx', code);
