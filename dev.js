const { spawn } = require('child_process');
const path = require('path');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';
const nodeCmd = isWin ? 'node.exe' : 'node';

console.log('====================================================');
console.log('  VNIT Full Dev Environment Starting...             ');
console.log('  🌐 Website: http://localhost:3000                 ');
console.log('  ⚙️  Admin CMS: http://localhost:5173              ');
console.log('====================================================\n');

// 1. Chạy Web Server (server.js - port 3000)
const webProcess = spawn(nodeCmd, ['server.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: isWin
});

// 2. Chạy Admin Vite Dev Server (admin - port 5173)
const adminProcess = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'admin'),
  stdio: 'inherit',
  shell: isWin
});

function cleanup() {
  console.log('\n[Dev Server] Đang dừng tất cả tiến trình...');
  try {
    if (webProcess && webProcess.pid) {
      if (isWin) {
        spawn('taskkill', ['/pid', webProcess.pid, '/f', '/t']);
      } else {
        webProcess.kill('SIGINT');
      }
    }
  } catch (e) {}

  try {
    if (adminProcess && adminProcess.pid) {
      if (isWin) {
        spawn('taskkill', ['/pid', adminProcess.pid, '/f', '/t']);
      } else {
        adminProcess.kill('SIGINT');
      }
    }
  } catch (e) {}

  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
