const socket = io(); // Web socket allows us to communicate in realtime within the
// client and the server

// Creating Alert audio with the Audio contructor
let alert = new Audio("alert.mp3");

// DOM elements
const container = document.querySelector(".container");
const sendForm = document.querySelector(".send");
const input = document.querySelector("#input");
const usernameForm = document.getElementById("usernameForm");
const enterUsername = document.getElementById("enterUsername");

let userName; // Entered User
let activeUsers = []; // active users

// Chat entering function || At first whenever the UI renders this
// Will call and ask for name and fire a event new_user_joined.
usernameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  userName = enterUsername.value;
  document.querySelector(".nameBox").style.display = "none";
  socket.emit("new_user_joined", userName);
  hideWelcome();
});

// very Simple Welcome Logic, UI part
const hideWelcome = () => {
  document.querySelector(".welcome").style.display = "block";
  setTimeout(() => {
    document.querySelector(".welcome").style.display = "none";
  }, 3000);
};

// UI Logic for showing message on the UI.
const append = (name, message, position) => {
  const mainDiv = document.createElement("div");
  const upper = document.createElement("upper");
  upper.classList.add("upper");
  upper.innerText = name;
  const messageDiv = document.createElement("messageDiv");
  messageDiv.classList.add("message");
  messageDiv.innerText = message;
  mainDiv.append(upper, messageDiv);
  mainDiv.classList.add("chat");
  mainDiv.classList.add(position);
  container.append(mainDiv);
  getBottom();
};

// UI Logic for whenever there will be a new user join
const joinAppend = (message, position) => {
  const mainDiv = document.createElement("div");
  mainDiv.innerHTML = message;
  mainDiv.classList.add("chat");
  mainDiv.classList.add(position);
  container.append(mainDiv);
  getBottom();
};

// Logic for send message
sendForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputMessage = input.value;
  if (!inputMessage) return;
  append("You", inputMessage, "right");
  socket.emit("send", inputMessage);
  input.value = "";
});

// Whenever the user joined event will fire
socket.on("user_joined", (name) => {
  joinAppend(`${name} Joined the chat`, "mid");
});

// When ever there will be recieve event fire then,
// Appendind the new meesage to DOM and play a alert audio
socket.on("recieve", (data) => {
  append(data.name, data.message, "left");
  alert.play();
});

// Calling user_left whenever any user left and a callback functions
// which will append user left UI logic.
socket.on("user_left", (data) => {
  joinAppend(`${data} Left the chat`, "mid");
});

// UI Logic for showing Active users
let inner = document.querySelector(".inner-inner");
const appendUsers = (e) => {
  let main = document.createElement("div");
  main.setAttribute("class", "mainList");
  let div = document.createElement("div");
  div.setAttribute("class", "usersList");
  let span = document.createElement("span");
  span.setAttribute("class", "spanOnline");
  div.innerText = e;
  main.append(span, div);
  inner.append(main);
};

// Logic for opening active users list
let open = document.querySelector(".activeUsers");
open.addEventListener("click", () => {
  socket.emit("send_users");
  socket.on("get_users", (user) => {
    activeUsers = [];
    inner.innerHTML = null;
    for (key in user) {
      appendUsers(user[key]);
      activeUsers.push(user[key]);
    }
  });
  document.querySelector(".showAllusers").style.display = "block";
});

// Logic for closing active users list
let close = document.querySelector(".close");
close.addEventListener("click", () => {
  document.querySelector(".showAllusers").style.display = "none";
});

function getBottom() {
  container.scrollTo(0, container.scrollHeight);
}
