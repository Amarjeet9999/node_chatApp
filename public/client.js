const socket = io();

const container = document.querySelector(".container");
const sendForm = document.querySelector(".send");
const input = document.querySelector("#input");

const append = (message, position) => {
  const mainDiv = document.createElement("div");
  mainDiv.innerHTML = message;
  mainDiv.classList.add("chat");
  mainDiv.classList.add(position);
  container.append(mainDiv);
};

sendForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputMessage = input.value;
  append(`You : ${inputMessage}`, "right");
  socket.emit("send", inputMessage);
  input.value = "";
});

const userName = prompt("Enter your Name To join");

socket.emit("new_user_joined", userName);

socket.on("user_joined", (name) => {
  append(`${name} Joined the chat`, "left");
});

socket.on("recieve", (data) => {
  console.log(data);
  append(`${data.name} : ${data.message}`, "left");
});
