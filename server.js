const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Private Love Chat 💜</title>
<style>
body {
  margin:0;
  font-family:sans-serif;
  background: linear-gradient(135deg,#0f0f0f,#1a001f);
  color:white;
  display:flex;
  justify-content:center;
  align-items:center;
  height:100vh;
}
.box { width:350px; }
input,button {
  width:100%;
  padding:10px;
  margin:5px 0;
  border:none;
  border-radius:10px;
}
button { background:#ff4ecd; color:white; }
#chat { display:none; }
#messages {
  height:300px;
  overflow-y:auto;
  border:1px solid #333;
  padding:10px;
  margin-bottom:10px;
}
.msg { padding:8px; margin:5px; border-radius:10px; }
.me { background:#8a2be2; text-align:right; }
.other { background:#333; text-align:left; }
</style>
</head>

<body>

<div class="box">

<div id="login">
<h2>💜 Private Chat</h2>
<input id="name" placeholder="Your name">
<input id="room" placeholder="Enter 4-digit code">
<button onclick="startChat()">Enter Chat</button>
</div>

<div id="chat">
<div id="messages"></div>
<input id="msg" placeholder="Type message...">
<button onclick="send()">Send</button>
</div>

</div>

<script src="/socket.io/socket.io.js"></script>

<script>
const socket = io();
let name="", room="";

function startChat(){
  name = document.getElementById("name").value;
  room = document.getElementById("room").value;

  if(!name || !room){
    alert("Enter name & code");
    return;
  }

  socket.emit("join", room);

  document.getElementById("login").style.display="none";
  document.getElementById("chat").style.display="block";
}

function send(){
  const msg = document.getElementById("msg").value;
  if(!msg) return;

  addMessage(name, msg, "me");

  socket.emit("message", {room, name, msg});
  document.getElementById("msg").value="";
}

socket.on("message", (data)=>{
  addMessage(data.name, data.msg, "other");
});

function addMessage(n, m, type){
  const div=document.createElement("div");
  div.className="msg "+type;
  div.innerText = n + ": " + m;
  document.getElementById("messages").appendChild(div);
}
</script>

</body>
</html>
  `);
});

io.on("connection", (socket) => {

  socket.on("join", (room) => {
    socket.join(room);
  });

  socket.on("message", (data) => {
    socket.to(data.room).emit("message", data);
  });

});

server.listen(3000, () => {
  console.log("Server running");
});