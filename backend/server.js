import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getTemplateConfigs } from "./template-registry.js";
import { renderTemplate } from "./render-service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const frontendDir = path.join(rootDir, "frontend");
const outputDir = path.join(rootDir, "generated");

const mimeMap = {
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
    if (req.method === "GET" && req.url === "/api/templates") {
      return sendJson(res, 200, { templates: getTemplateConfigs() });
    }

    if (req.method === "POST" && req.url === "/api/render") {
      const body = await readJson(req);
      const result = await renderTemplate({
        rootDir,
        outputDir,
        templateId: body.templateId,
        data: body.data
      });

      return sendJson(res, 200, {
        ...result,
        pdfUrl: toPublicPath(result.pdfPath),
        outputUrl: toPublicPath(result.outputPath)
      });
    }

    if (req.method === "GET") {
      return serveStatic(req, res);
    }

    return sendJson(res, 404, { error: "Not found" });
  } catch (error) {
    return sendJson(res, 500, { error: error.message || String(error) });
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

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

function serveStatic(req, res) {
  const requestPath = req.url === "/" ? "/index.html" : req.url;
  const cleanPath = decodeURIComponent(requestPath.split("?")[0]).replace(/^\/+/, "");
  const candidates = [
    path.join(frontendDir, cleanPath),
    path.join(rootDir, cleanPath)
  ];

  const filePath = candidates.find((candidate) => candidate.startsWith(rootDir) && fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  if (!filePath) {
    return sendJson(res, 404, { error: "Not found" });
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { "Content-Type": mimeMap[ext] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
}

function toPublicPath(filePath) {
  return "/" + path.relative(rootDir, filePath).replace(/\\/g, "/");
}

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}
