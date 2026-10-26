// Tiny static server for local use: `npm start` then open http://localhost:8080
const http = require("http");
const fs = require("fs");
const path = require("path");
const root = __dirname;
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json" };
http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  let file = path.normalize(path.join(root, url === "/" ? "index.html" : url));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  });
}).listen(process.env.PORT || 8080, () => console.log("RussianCLz running at http://localhost:" + (process.env.PORT || 8080)));
