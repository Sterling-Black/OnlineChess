const express = require("express");
const app = express();
const path = require("path");

const server = require("http").createServer(app);

const io = require("socket.io")(server, { cors: { origin: "*"}});

let online = [];
let room , searching=false, searchingID;
let rooms = [], names = [];


app.use(express.static(path.join(__dirname,"src")));
app.get("/",(req,res)=>{
  res.sendFile("home.html");
});

server.listen(process.env.PORT||3000,()=>{
  console.log("Server running on port 3000");
})

io.on("connection", (socket) => {
  

  socket.on("name-submit",(name)=>{
    names.push(name);
    console.log(names);
    io.emit("users-online",names);
  });
  socket.emit("success",socket.id);
  online.push(socket.id);
  socket.broadcast.emit("msg","a user just came online");


  socket.on("disconnect",(reason)=>{
    const index = online.indexOf(socket.id);
    online.splice(index,index);
    io.emit("users-online",names);
  });

  

  socket.on("SRC-OP",()=>{
    if(online.length<=1){
      const numOfOponents = 0;
      console.log("not enough users");
      socket.emit("num-of-users",numOfOponents);
    }else{
      console.log("enough users");
      const numOfOponents = online.length-1;
      socket.emit("num-of-users",numOfOponents);
      
      let playerNum;
      
      if(searching==false){
        searching=true;
        playerNum = 1;
        searchingID=socket.id;
        room = socket.id+1;//+1 to make it unique
      }else{
        playerNum = 2;
        searching = false;
      }
      socket.join(room);
      
      if(playerNum==1){
        console.log("num=1 room:"+room+"\n");
      }else if(playerNum==2){
        console.log("num=2 room:"+room+"\n");
      }
      
      rooms[socket.id] = room;
    
    
      io.to(room).emit("player-num",playerNum,room);
      
      socket.on("mov",(mov,rom)=>{
        console.log(mov,rom);
        // io.to(room).except(socket.id).emit("r-mov",mov);
        socket.to(rom).emit("r-mov",mov);
      })
    
      socket.on("cas",(mov,cas,rom)=>{
        console.log(mov,cas,rom);
        socket.to(rom).emit("r-mov",mov,cas);
      })
    
      socket.on("disconnect",(reason)=>{
        if(searchingID==socket.id){//if you are the one searching
          searching=false;
        }
        const rom = rooms[socket.id];
        const index = online.indexOf(socket.id);
        online.splice(index,index);
        io.emit("users-online",names);
        console.log('A user got disconnected');
        console.log('In Room: '+rom+'\n');
        io.to(rom).emit("op-disconnect");
      });
    }
    
    
    
  })
  // ...
  
});

