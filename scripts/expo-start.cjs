const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const root = path.join(__dirname, '..');
const tmp = path.join(root, '.metro-tmp');
fs.mkdirSync(tmp, { recursive: true });

process.env.TMPDIR = tmp;
process.env.TMP = tmp;
process.env.TEMP = tmp;

function remainingWatches() {
  try {
    const max = Number(fs.readFileSync('/proc/sys/fs/inotify/max_user_watches', 'utf8'));
    let used = 0;
    for (const pid of fs.readdirSync('/proc')) {
      if (!/^\d+$/.test(pid)) continue;
      const fdinfo = path.join('/proc', pid, 'fdinfo');
      let files;
      try {
        files = fs.readdirSync(fdinfo);
      } catch {
        continue;
      }
      for (const file of files) {
        try {
          const text = fs.readFileSync(path.join(fdinfo, file), 'utf8');
          if (text.includes('inotify')) {
            used += (text.match(/^inotify/gm) || []).length;
          }
        } catch {
          /* ignore other processes */
        }
      }
    }
    return max - used;
  } catch {
    return Number.POSITIVE_INFINITY;
  }
}

const remaining = remainingWatches();
if (Number.isFinite(remaining) && remaining < 25000) {
  process.env.CI = '1';
  console.warn(
    `[zatca-qr] File watchers are exhausted (~${Math.max(0, remaining)} left). Starting Expo without hot reload.`,
  );
  console.warn(
    'To restore hot reload, raise the Linux limit:\n  echo fs.inotify.max_user_watches=524288 | sudo tee /etc/sysctl.d/99-inotify.conf && sudo sysctl --system',
  );
}

const child = spawn('pnpm', ['exec', 'expo', 'start', ...process.argv.slice(2)], {
  cwd: root,
  env: process.env,
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
