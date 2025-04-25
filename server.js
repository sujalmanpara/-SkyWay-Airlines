const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  // Base directory for Angular app
  const angularBuildPath = path.join(
    __dirname,
    "skyway-airlines-frontend/dist/skyway-airlines-frontend/browser"
  );
  let filePath = "";

  // API routes for the backend
  if (req.url.startsWith("/api")) {
    // Handle API requests here
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "API endpoint" }));
    return;
  }

  // Serve static Angular files
  if (req.url === "/" || req.url === "/index.html") {
    filePath = path.join(angularBuildPath, "index.html");
  } else {
    // Handle Angular routes or static assets
    filePath = path.join(angularBuildPath, req.url);

    // Check if file exists
    if (fs.existsSync(filePath)) {
      // Serve the file
    } else {
      // For Angular routing - serve index.html for all routes that don't exist as files
      filePath = path.join(angularBuildPath, "index.html");
    }
  }

  // Serve the file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>404 Not Found</h1>");
      } else {
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end("<h1>500 Internal Server Error</h1>");
      }
      return;
    }

    // Set the appropriate content type based on file extension
    const ext = path.extname(filePath);
    let contentType = "text/html";

    switch (ext) {
      case ".js":
        contentType = "text/javascript";
        break;
      case ".css":
        contentType = "text/css";
        break;
      case ".json":
        contentType = "application/json";
        break;
      case ".png":
        contentType = "image/png";
        break;
      case ".jpg":
      case ".jpeg":
        contentType = "image/jpg";
        break;
      case ".svg":
        contentType = "image/svg+xml";
        break;
    }

    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
});

const PORT = process.env.PORT || 8081;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(
    `Angular app will be served after building with 'npm run build' inside skyway-airlines-frontend`
  );
});
