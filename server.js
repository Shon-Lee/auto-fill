const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const ROOT = __dirname;
const OUTPUT_DIR = path.join(ROOT, "generated");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
};

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url === "/api/render") {
      const payload = await readJson(req);
      const result = await renderTemplate(payload.templateId, payload.data);
      return sendJson(res, 200, result);
    }

    if (req.method === "GET") {
      return serveStatic(req, res);
    }

    sendJson(res, 404, { error: "Not found" });
  } catch (error) {
    sendJson(res, 500, { error: error.message || String(error) });
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

async function renderTemplate(templateId, data) {
  const payloadPath = path.join(OUTPUT_DIR, `payload-${templateId}.json`);
  fs.writeFileSync(payloadPath, JSON.stringify({ templateId, data }, null, 2), "utf8");

  await runPowerShell([
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    path.join(ROOT, "render_template.ps1"),
    "-RootDir",
    ROOT,
    "-TemplateId",
    templateId,
    "-PayloadPath",
    payloadPath,
    "-OutputDir",
    OUTPUT_DIR
  ]);

  const metaPath = path.join(OUTPUT_DIR, `${templateId}.meta.json`);
  if (!fs.existsSync(metaPath)) {
    throw new Error("Khong tim thay file ket qua.");
  }

  const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
  meta.pdfUrl = toPublicPath(meta.pdfPath);
  meta.outputUrl = toPublicPath(meta.outputPath);
  return meta;
}

function serveStatic(req, res) {
  const requestPath = req.url === "/" ? "/index.html" : req.url;
  const cleanPath = decodeURIComponent(requestPath.split("?")[0]).replace(/^\/+/, "");
  const filePath = path.join(ROOT, cleanPath);
  if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    return sendJson(res, 404, { error: "Not found" });
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(raw || "{}"));
      } catch {
        reject(new Error("JSON khong hop le."));
      }
    });
    req.on("error", reject);
  });
}

function runPowerShell(args) {
  return new Promise((resolve, reject) => {
    const child = spawn("powershell", args, { cwd: ROOT, windowsHide: true });
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(stderr.trim() || `PowerShell exited with ${code}`));
      }
    });
  });
}

function toPublicPath(filePath) {
  return "/" + path.relative(ROOT, filePath).replace(/\\/g, "/");
}

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}
