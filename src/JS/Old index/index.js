
let dot = "<div class='dot'>·</div>";
let Cdot = "<div class='Cdot'>·</div>"
let movesMade = 0;

let player = "w";

let castel = true;
let Ctype = 0;

function play(file) {
    let audioTrack = new Audio(file);
    audioTrack.preload = 'auto';
    // console.log("audio file " + file + "length:" + audioTrack.duration + "  sec.");
    audioTrack.onloadeddata = function () {
        // console.log("audio: " + file + " has successfully loaded."); 
    }; 
    audioTrack.play();
}

const chess = new Chess();



let mov;
let dotted = [], Cdotted=[];
let eatable = false;


document.querySelectorAll(".box").forEach(elem=>{
    elem.addEventListener("click",()=>{
        id = elem.id;
        // console.log(dotted);
        if(dotted){
            // console.log(dotted);
            dotted.forEach(dots=>{
                if(dots==id){
                    if(Ctype==0){

                        if("p"==chess.get(mov).type){
                            if("w"==chess.get(mov).color&&"8"==id.slice(1,2)){
                                console.log("promotion");
                                let prom = prompt("q=queen, b=bishop, n=knight, r=rock");
                                chess.move({ from: mov, to: id ,  promotion: prom});

                            }else if("b"==chess.get(mov).color&&"1"==id.slice(1,2)){
                                console.log("promotion");
                                let prom = prompt("q=queen, b=bishop, n=knight, r=rock");
                                chess.move({ from: mov, to: id ,  promotion: prom});

                            }else{
                                chess.move({ from: mov, to: id });
                            }

                        }else{
                            chess.move({ from: mov, to: id });
                            
                        }
                        refresh();
                        play("Sound/move.mp3");
                        startGame();



                    }else 
                    if("w"==chess.turn()){
                    
                        if(Ctype==1){
                            chess.move({ from: mov, to: "g1" });
                            chess.move({ from: "h1", to: "f1"});
                            refresh();
                            play("Sound/castel.mp3");
                            startGame();
                        }else if(Ctype==2){
                            chess.move({ from: mov, to: "c1" });
                            chess.move({ from: "a1", to: "d1"});
                            refresh();
                            play("Sound/castel.mp3");
                            startGame();
                        }

                    }else{
                        if(Ctype==1){
                            chess.move({ from: mov, to: "g8" });
                            chess.move({ from: "h8", to: "f8"});
                            refresh();
                            play("Sound/castel.mp3");
                            startGame();
                        }else if(Ctype==2){
                            chess.move({ from: mov, to: "c8" });
                            chess.move({ from: "a8", to: "d8"});
                            refresh();
                            play("Sound/castel.mp3");
                            startGame();
                        }
                        
                    }
                    movesMade++;
                    endCheck();
                }
                
            }); 
        }
    });  
});


function startGame(){



    
    document.querySelectorAll(".peice").forEach(elem=>{
        
        elem.addEventListener("click",()=>{
            let color = elem.classList[2];
            let pos = elem.parentElement.id;

            if(elem.parentElement.style.border=="2px solid yellow"){//if the peices is yellow
                if(eatable){
                    chess.move({ from: mov, to: pos });
                    movesMade++;
                    play("Sound/move.mp3");
                    endCheck();
                }
            }

            if(chess.turn()==color){
                Ctype=0;
                    
                refresh();
                
                $("#"+pos).css("border","2px green solid");
                mov=pos;
                let pPoss = chess.moves({ square: pos });
                
                console.log(pPoss);
                if(pPoss){
                    dotted = [];
                    eatable = false;
                    pPoss.forEach((poss)=>{
                        if(poss.includes("x")){//eatable position
                            eatable=true;
                            poss = positionCheck(poss);
                            $("#"+poss).css("border","2px yellow solid");
                            console.log(poss);

                        }else if("O-O"==poss){
                            Ctype=1
                            if(color=="w"){
                                $("#g1").html(Cdot);
                                dotted.push("g1");
                            }
                            else{
                                $("#g8").html(Cdot);
                                dotted.push("g8");
                            }
                            console.log(poss);

                        }else if("O-O-O"==poss){
                            Ctype=2;
                            if(color=="w"){
                                $("#c1").html(Cdot);
                                dotted.push("c1");
                            }
                            else{
                                $("#c8").html(Cdot);
                                dotted.push("c8");
                            }
                            console.log(poss);

                        }
                        else {
                            
                            poss = positionCheck(poss);
                  
                            console.log(poss);
                            
                            dotted.push(poss);
                            $("#"+poss).html(dot);
                        }
    
                    });
                }
            }
            startGame();
        });
    });
}

function refresh(){
    let i, j, k=0;

    for(i=0;i<8;i++){
        for(j=0;j<8;j++){
            let boxVal = chess.board()[i][j];
            if(boxVal){
                document.querySelectorAll(".box")[k].innerHTML = findPeice(boxVal);
            }else{
                document.querySelectorAll(".box")[k].innerHTML = "";
            }
            document.querySelectorAll(".box")[k].style.border = "";
            k++;
        }
    }
    if(chess.in_check()){
        if(chess.turn()=="b"){
            $("#kb").css("border","2px red solid");
        }else{
            $("#kw").css("border","2px red solid");
        }
    }
}


function findPeice(boxVal){

    let {color, type} = boxVal;

    let num =  color=='b'?1:2;
    
    switch(type){
        case "r":
            return '<img src="images/Rock'+num+'.png" class="peice rock '+color+'" />'
        break;
        case "n":
            return '<img src="images/Knight'+num+'.png" class="peice knight '+color+'" />'
        break;
        case "b":
            return '<img src="images/Bishop'+num+'.png" class="peice bishop '+color+'" />'
        break;
        case "q":
            return '<img src="images/Queen'+num+'.png" class="peice queen '+color+'" id="q'+color+'" />'
        break;
        case "k":
            return '<img src="images/King'+num+'.png" class="peice king '+color+'" id="k'+color+'" />'
        break;
        case "p":
            return '<img src="images/Pawn'+num+'.png" class="peice pawn '+color+'" />'
        break;
    }
}

function positionCheck(poss){
    let p=0;
    for(p=0;p<poss.length;p++){
        if(poss[p]>=1&&poss[p]<=8){
            return poss[p-1]+poss[p];
        }
    }
}


function endCheck(){
    if(chess.game_over()){
        if(chess.in_checkmate()){
            play("Sound/checkmate.mp3");
        }else if(chess.in_draw()||chess.in_stalemate()||chess.insufficient_material()){
            play("Sound/draw.mp3");
        }
        
    }
    else if(chess.in_check()){
        if(chess.turn()=="b"){
            $("#kb").css("border","2px red solid");
        }else{
            $("#kw").css("border","2px red solid");
        }
        play("Sound/check.dat");
    }
}

function undoMove(){
    if(movesMade>0){
        chess.undo();
        movesMade--;
        play("Sound/undo.mp3");
        refresh();
        startGame();
    }else{
        console.log("nothing to undo");
    }
}

startGame();

