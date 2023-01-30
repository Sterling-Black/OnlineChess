const express = require("express");
const app = express();
const path = require("path");

const server = require("http").createServer(app);

const io = require("socket.io")(server, { cors: { origin: "*"}});

let clients = [];
let room ;
let rooms = []


app.use(express.static(path.join(__dirname,"src")));
app.get("/",(req,res)=>{
  res.sendFile("home.html");
});

server.listen(process.env.PORT||3000,()=>{
  console.log("Server running on port 3000");
})

io.on("connection", (socket) => {
  // ...
  clients.push(socket.id);
  
  let playerNum = clients.length%2;
  
  if(playerNum==1){
    console.log("num 1\n");
    room = clients[clients.length-1];
  }else if(playerNum==0){
    console.log("num 2\n");
    playerNum=2;
    room = clients[clients.length-2];
    clients = [];
  }
  
  rooms[socket.id] = room;
  socket.join(room);


  console.log("You just joined the "+room+" room\n"+clients);

  io.to(room).emit("player-num",playerNum,room);
  
  socket.on("mov",(mov,rom)=>{
    console.log(mov,rom);
    io.to(rom).emit("r-mov",mov);
  })

  socket.on("cas",(mov,cas,rom)=>{
    console.log(mov,cas,rom);
    socket.to(rom).emit("r-mov",mov,cas);
  })

  socket.on("disconnect",(reason)=>{
    let rom = rooms[socket.id];
    // clients[clients.indexOf()];
    console.log('A user got disconnected\n');
    console.log('Room: '+rom);
    socket.to(rom).emit("op-disconnect");

  })
  
});

