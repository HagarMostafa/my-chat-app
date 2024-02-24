// server.js
const { createServer } = require("http");
const { Server } = require("socket.io");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const server = createServer((req, res) => {
  const parsedUrl = parse(req.url, true);
  handle(req, res, parsedUrl);
});

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("chat message", (msg) => {
    // Include the `sentByCurrentUser` field in the message object
    const messageWithAuthor = {
      text: msg,
      sentByCurrentUser: true, // Assuming all messages sent by the current user have this flag set to true
    };
    io.emit("chat message", messageWithAuthor);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.prepare().then(() => {
  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
