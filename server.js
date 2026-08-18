require("dotenv").config();
const http = require("http");
const { Pool } = require("pg");

const PORT = 4100;

const server = http.createServer((req, res) => {
	if (req.url === "/health" && req.method === "GET") {
		res.writeHead(200, {"Content-Type":"application/json"});
		res.end(JSON.stringify({"status":"ok"}));
		return;
	}

	res.writeHead(404, {"Content-Type":"application/json"});
	res.end(JSON.stringify({"status":"page not found"}));
});

server.listen(PORT, () => {
	console.log(`server is listening on port ${PORT}`);
});
