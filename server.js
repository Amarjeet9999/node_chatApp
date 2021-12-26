const express = require("express");
const app = express();
const path = require("path");

const http = require("http").Server(app);
const io = require("socket.io")(http);

// Communication endpoint
const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: false }));
app.use("/static", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Variable for storing user name with their ids
const user = {};

//

// io.on creates a socket whenever there is a new user
io.on("connection", (socket) => {
  // Created a new_user_joined event which will first stores current user id and
  // then it will will broadcast to others that someone have joined.
  socket.on("new_user_joined", (name) => {
    user[socket.id] = name;
    socket.broadcast.emit(`user_joined`, name);
  });

  // Create a send event which will which will calls in client side
  // and it will broadcast the message to others.
  socket.on("send", (message) => {
    // console.log(message);
    socket.broadcast.emit("recieve", {
      name: user[socket.id],
      message: message,
    });
  });

  // For sending active users data
  socket.on("send_users", () => {
    socket.emit("get_users", user);
  });

  // Disconnect event returns username to the client.
  socket.on("disconnect", () => {
    socket.broadcast.emit("user_left", user[socket.id]);
    removeUser(socket.id);
  });
});

// For Removing user from user object
const removeUser = (el) => {
  delete user[el];
};

// Create a HTTP server that will listen on PORT 5000 in the current computer
module.exports = () => {
  try {
    http.listen(port, () => {
      console.log(`Listening on PORT ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};
