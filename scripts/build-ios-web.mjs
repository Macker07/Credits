import { rename } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const api = path.join(root, "app", "api");
const parked = path.join(root, ".capacitor-api-routes");

function run(command, args, env = process.env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, env, stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`${command} exited with ${code}`)));
  });
}

let parkedApi = false;
try {
  await rename(api, parked);
  parkedApi = true;
  await run(process.execPath, ["node_modules/next/dist/bin/next", "build"], { ...process.env, CAPACITOR_BUILD: "1" });
} finally {
  if (parkedApi) await rename(parked, api);
}
