const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 사내메신저를 시작합니다...');

// React 개발 서버 시작
console.log('📡 서버를 시작하는 중...');
const reactServer = spawn('npm', ['start'], {
  env: { ...process.env, PORT: '3001', BROWSER: 'none' },
  cwd: __dirname,
  stdio: 'pipe'
});

// 5초 후 Electron 앱 시작
setTimeout(() => {
  console.log('🖥️  앱을 실행하는 중...');
  const electronApp = spawn('npm', ['run', 'electron-dev'], {
    env: { ...process.env, PORT: '3001' },
    cwd: __dirname,
    stdio: 'inherit'
  });

  electronApp.on('close', (code) => {
    console.log('앱이 종료되었습니다.');
    reactServer.kill();
    process.exit(code);
  });
}, 8000);

console.log('✅ 사내메신저가 곧 실행됩니다...');
console.log('⚠️  이 창을 닫지 마세요!');

// 프로세스 종료 처리
process.on('SIGINT', () => {
  console.log('프로그램을 종료합니다...');
  reactServer.kill();
  process.exit();
});