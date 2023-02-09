const express = require("express");
const { stat } = require("fs");
const app = express();
const path = require("path");

const server = require("http").createServer(app);

const io = require("socket.io")(server, { cors: { origin: "*"}});

let online = [];
let room , searching=false, searchingID;
let rooms = [], names = [], nm = [], user=[], srchQuery=[];
let nameArr=[];
let status=[], i=0;


app.use(express.static(path.join(__dirname,"src")));
app.get("/",(req,res)=>{
  res.sendFile("home.html");
});

server.listen(process.env.PORT||3000,()=>{
  console.log("Server running on port 3000");
})

io.on("connection", (socket) => {
  online.push(socket.id);

 

  socket.emit("success",socket.id);
  
  socket.on("empty-names",()=>{
    names=[];
    nameArr=[];
    online=[];
    status=[];
    user=[];
    i=0;    
    console.log("clear all");
    io.emit("check-online");
  });

  socket.on("name-submit",(users)=>{
    const {name, statu} = users;
    if(name=="Guest"){
      names.push("Guest");
      nameArr[socket.id] = "Guest";
    }else{
      names.push(name);
      nameArr[socket.id] = name;
    }
    console.log(users);
    online.push(socket.id);
    status.push(statu);
    user.push(users);
    io.emit("users-online",user);
  });
  
  
  
  socket.on("disconnect",(reason)=>{
    console.log("012");
    const index = online.indexOf(socket.id);
    online.splice(index,index);
    user = user.filter(usr => usr.id != socket.id);
    
    if(searchingID==socket.id&&searching){//if you are the one searching
      room = "";
      searching=false;
      srchQuery = [];
    }
    
    console.log(names,user);
    
    io.emit("users-online",user);
  });

  

  socket.on("SRC-OP",(theUser)=>{

    socket.on("searching",()=>{
      user.forEach(usr => {
        if(usr.id == socket.id){
          usr.statu = "searching";
        }
      });
      io.emit("users-online",user);
    })
    
    if(online.length<=1){
      const numOfOponents = 0;
      console.log("not enough users");
      socket.emit("num-of-users",numOfOponents);
    }else{
      console.log("enough users searching...");
      const numOfOponents = online.length-1;
      socket.emit("num-of-users",numOfOponents);
      
      let playerNum;
      
      srchQuery.push(theUser);
      
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
        console.log("player1 room:"+room+" is ready\n");
      }else if(playerNum==2){
        console.log("player2 room:"+room+" is ready\n the game can start");
      }

      
      rooms[socket.id] = room;
      
      io.to(room).emit("player-num",playerNum,room,srchQuery);
      
      if(srchQuery.length>=2){
        srchQuery = [];
      }
      
      socket.on("playing",()=>{
        user.forEach(usr => {
          if(usr.id == socket.id){
            usr.statu = "playing";
          }
        });
        io.emit("users-online",user);
      });


      socket.on("mov",(mov,rom)=>{
        console.log(mov,rom);
        socket.to(rom).emit("r-mov",mov);
      })
    
      socket.on("cas",(mov,cas,rom)=>{
        console.log(mov,cas,rom);
        socket.to(rom).emit("r-mov",mov,cas);
      })
      // socket.off("disconnect");``
      socket.on("disconnect",(reason)=>{
        // if(searchingID==socket.id){//if you are the one searching
        //   searching=false;
        //   srchQuery = [];
        // }
        // user.forEach((usr)=>{
        //   if(usr.id==socket.id&&user.statu=="playing"&&!srchQuery){
        //     searching=false;
        //   }
        // });

        // console.log("345");
        // const index = online.indexOf(socket.id);
        // online.splice(index,index);
        // io.emit("users-online",user);
        const rom = rooms[socket.id];
        console.log('A user got disconnected');
        console.log('In Room: '+rom+'\n');
        io.to(rom).emit("op-disconnect");
      });
    }
    
    
    
  })
  // ...
  
});

