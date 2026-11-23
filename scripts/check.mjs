// Kiểm tra nhanh trước khi triển khai: chạy bằng `node scripts/check.mjs`.
// Không cần cài thư viện nào.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const fail = (m) => errors.push(m);
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

// 1. Cú pháp JavaScript
for (const f of ["js/data.js", "js/app.js", "js/scenes3d.js"]) {
  try { execFileSync(process.execPath, ["--check", path.join(root, f)], { stdio: "pipe" }); }
  catch (e) { fail(`${f}: lỗi cú pháp\n${e.stderr}`); }
}

// 2. Mọi tệp được index.html nhắc tới (css, js, ảnh) đều tồn tại
const html = read("index.html");
const refs = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map((m) => m[1]).filter((u) => !/^(https?:|mailto:|data:)/.test(u));
for (const r of new Set(refs)) if (!fs.existsSync(path.join(root, r))) fail(`index.html tham chiếu tệp không tồn tại: ${r}`);

// 3. Dữ liệu bài học hợp lệ
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(read("js/data.js"), sandbox);
const L = sandbox.window.LESSON;
if (!L) fail("data.js không tạo ra window.LESSON");
else {
  const checkQ = (name, list) => list.forEach((q, i) => {
    const at = `${name}[${i + 1}]`;
    if (!q.q || !Array.isArray(q.options) || q.options.length < 2) fail(`${at}: thiếu câu hỏi hoặc lựa chọn`);
    else if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) fail(`${at}: đáp án ngoài phạm vi`);
    if (!q.explain) fail(`${at}: thiếu lời giải thích`);
  });
  for (const k of ["p1", "p2", "p3"]) checkQ(`quizzes.${k}`, L.quizzes[k] || []);
  checkQ("finalTest", L.finalTest);
  if (L.finalTest.length !== 10) fail(`finalTest phải có 10 câu, hiện có ${L.finalTest.length}`);
  const ids = new Set(L.sortGame.groups.map((g) => g.id));
  L.sortGame.items.forEach((it) => { if (!ids.has(it.group)) fail(`sortGame: nhóm không tồn tại "${it.group}"`); });
  L.needOsGame.items.forEach((it) => { if (!fs.existsSync(path.join(root, it.img))) fail(`needOsGame: thiếu ảnh ${it.img}`); });
}

// 4. Không để lọt tệp nguồn nặng/riêng tư vào bản triển khai
for (const bad of [".pptx", ".mp4", ".mp3"]) {
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
    if (e.name === "node_modules" || e.name === ".git") return;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p); else if (p.toLowerCase().endsWith(bad)) fail(`Không đưa tệp ${bad} vào site: ${path.relative(root, p)}`);
  });
  walk(root);
}

if (errors.length) { console.error("KIỂM TRA THẤT BẠI:\n- " + errors.join("\n- ")); process.exit(1); }
console.log("Kiểm tra đạt: cú pháp JS, tệp tham chiếu, dữ liệu câu hỏi và trò chơi đều hợp lệ.");
