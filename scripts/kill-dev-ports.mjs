/**
 * 结束本机 3000–3010 上常见的 Next/Node 开发进程（Windows 友好）。
 * 用法: npm run dev:kill
 */
import { execSync } from "node:child_process";

const PORT_MIN = 3000;
const PORT_MAX = 3010;

const isWin = process.platform === "win32";

function getPidsOnPort(port) {
  try {
    if (isWin) {
      const out = execSync(`netstat -ano | findstr :${port}`, {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "ignore"],
      });
      const pids = new Set();
      for (const line of out.split(/\r?\n/)) {
        if (!line.includes("LISTENING")) continue;
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (/^\d+$/.test(pid) && pid !== "0") pids.add(pid);
      }
      return [...pids];
    }
    const out = execSync(`lsof -ti tcp:${port}`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    });
    return out
      .trim()
      .split(/\s+/)
      .filter((p) => /^\d+$/.test(p));
  } catch {
    return [];
  }
}

function killPid(pid) {
  try {
    if (isWin) {
      execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
    } else {
      execSync(`kill -9 ${pid}`, { stdio: "ignore" });
    }
    return true;
  } catch {
    return false;
  }
}

let killed = 0;
for (let port = PORT_MIN; port <= PORT_MAX; port++) {
  for (const pid of getPidsOnPort(port)) {
    if (killPid(pid)) {
      console.log(`已结束 PID ${pid}（端口 ${port}）`);
      killed++;
    }
  }
}

if (killed === 0) {
  console.log(`端口 ${PORT_MIN}–${PORT_MAX} 上未发现 LISTENING 进程。`);
} else {
  console.log(`共结束 ${killed} 个进程，可重新运行 npm run dev`);
}
