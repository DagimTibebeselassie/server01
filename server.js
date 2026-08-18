require("dotenv").config();
const http = require("http");
const { Pool } = require("pg");

const PORT = 4100;

const pool = new Pool({
	host: process.env.DB_HOST,
	port: 5432,
	database: "cars",
	user: "postgres",
	password: process.env.DB_PASSWORD
});

const server = http.createServer(async (req, res) => {
	if (req.url === "/cars" && req.method === "GET") {
		try {
			const dres = await pool.query("SELECT * FROM vehicles");
			res.writeHead(200, {"Content-Type":"application/json"});
			res.end(JSON.stringify(dres.rows));
			return;
		} catch (err) {
			res.writeHead(500, {"Content-Type":"application/json"});
			res.end(JSON.stringify({"status":err}));
			return;
		}
	}

	if (req.url === "/health" && req.method === "GET") {
		res.writeHead(200, {"Content-Type":"application/json"});
		res.end(JSON.stringify({"status":"ok"}));
		return;
	}

	res.writeHead(404, {"Content-Type":"application/json"});
	res.end(JSON.stringify({"status":"page not found"}));
});

pool.query("SELECT current_database()").then(r => {
	console.log(r);
}).catch(err => {
	console.log(err);
});

server.listen(PORT, () => {
	console.log(`server is listening on port ${PORT}`);
});


process.on("SIGTERM", () => {
	console.log("server received SIGTERM");

	server.close(async () => {
		console.log("http server is closed");
		await pool.end();
		console.log("psql connections have closed..");
		process.exit(0);
	});
});
