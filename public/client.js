const socket = io();
const container = document.querySelector(".container");
const sendForm = document.querySelector(".send");
const input = document.querySelector("#input");
const usernameForm = document.getElementById("usernameForm");
const enterUsername = document.getElementById("enterUsername");

let userName; // Entered User

let prevData = []; // for storing previous chat

usernameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  userName = enterUsername.value;
  document.querySelector(".nameBox").style.display = "none";
  socket.emit("new_user_joined", userName);
});

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
};

const joinAppend = (message, position) => {
  const mainDiv = document.createElement("div");
  mainDiv.innerHTML = message;
  mainDiv.classList.add("chat");
  mainDiv.classList.add(position);
  container.append(mainDiv);
};

sendForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputMessage = input.value;
  if (!inputMessage) return;
  append("You", inputMessage, "right");
  socket.emit("send", inputMessage);
  input.value = "";
});

socket.on("user_joined", (name) => {
  joinAppend(`${name} Joined the chat`, "mid");
});

socket.on("recieve", (data) => {
  append(data.name, data.message, "left");
});

socket.on("user_left", (data) => {
  joinAppend(`${data} Left the chat`, "mid");
});
