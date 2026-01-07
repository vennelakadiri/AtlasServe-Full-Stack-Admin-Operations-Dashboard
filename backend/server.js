const http = require("http");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
let db, usersCollection;
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then(client => {
    db = client.db("atlasserve");
    usersCollection = db.collection("users");
    console.log("MongoDB connected ✅");
  })
  .catch(err => console.log(err));

// Helper to send JSON
function sendJSON(res, data, status = 200) {
  res.writeHead(status, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
  res.end(JSON.stringify(data));
}

// Create server
const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    // CORS preflight
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    res.end();
    return;
  }

  if (req.url === "/users" && req.method === "GET") {
    const users = await usersCollection.find().toArray();
    sendJSON(res, users);
  } 
  else if (req.url === "/users" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk.toString());
    req.on("end", async () => {
      const user = JSON.parse(body);
      const result = await usersCollection.insertOne(user);
      sendJSON(res, result.ops[0]);
    });
  } 
  else {
    sendJSON(res, { message: "Not Found" }, 404);
  }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
