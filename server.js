const express = require("express");
const app = express();
const path = require("path");

const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: false }));
app.use("/static", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const user = {};

io.on("connection", (socket) => {
  // User Joining Event
  socket.on("new_user_joined", (name) => {
    user[socket.id] = name;
    socket.broadcast.emit(`user_joined`, name);
  });

  // For message event
  socket.on("send", (message) => {
    console.log(message);
    socket.broadcast.emit("recieve", {
      name: user[socket.id],
      message: message,
    });
  });
});

module.exports = () => {
  try {
    http.listen(port, () => {
      console.log(`Listening on PORT ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};
