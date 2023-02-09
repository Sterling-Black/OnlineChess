

    

function online1V1(chess){



// AI implementation


function chessAi(){
    //2. Generate all possible moves
    var moves = chess.moves();

    // 3. Evaluate the positions
    var evaluations = [];
    for (var i = 0; i < moves.length; i++) {
        var move = moves[i];
        chess.move(move);
        var evaluation = evaluatePosition(chess.board());
        evaluations.push({ move: move, evaluation: evaluation });
        chess.undo();
    }

    // 4. Select the best move
    var bestMove = null;
    var bestEvaluation = Number.NEGATIVE_INFINITY;
    for (var i = 0; i < evaluations.length; i++) {
        var evaluation = evaluations[i].evaluation;
        if (evaluation > bestEvaluation) {
            bestEvaluation = evaluation;
            bestMove = evaluations[i].move;
        }
    }


    // 5. Play the move
    chess.move(bestMove);

}


function evaluatePosition(board) {
    var materialAdvantage = 0;
    var mobility = 0;
    var centerControl = 0;

    // 1. Evaluate material advantage
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            var piece = board[i][j];
            if (piece) {
                materialAdvantage += pieceValue(piece.type);
            }
        }
    }

    // 2. Evaluate mobility
    var possibleMoves = generatePossibleMoves(board);
    mobility = possibleMoves.length;

    // 3. Evaluate center control
    var centerSquares = [
    board[3][3], board[3][4], board[4][3], board[4][4]
    ];
    for (var i = 0; i < centerSquares.length; i++) {
        var piece = centerSquares[i];
        if (piece) {
            centerControl += pieceValue(piece.type);
        }
    }

    // 4. Combine evaluations
    var evaluation = materialAdvantage + mobility + centerControl;
    return evaluation;
}

function pieceValue(pieceType) {
    switch (pieceType) {
        case 'p': return 1;
        case 'n': return 3;
        case 'b': return 3;
        case 'r': return 5;
        case 'q': return 9;
        default: return 0;
    }
}

function generatePossibleMoves() {
// Your code to generate all possible moves for the current player
// ...
return chess.moves();

}




refresh();








































    let mov;
    let dotted = [];
    let eatable = false;
    
    
    
    socket.on("op-disconnect",()=>{
        alert("Your opponent went offline");
        console.log("Your opponent is offline");
        exit();
    });
    
    function play(file) {
        let audioTrack = new Audio(file);
        audioTrack.preload = 'auto';
        // console.log("audio file " + file + "length:" + audioTrack.duration + "  sec.");
        audioTrack.onloadeddata = function () {
        // console.log("audio: " + file + " has successfully loaded."); 
        }; 
        audioTrack.play();
    }

    document.querySelectorAll(".box").forEach(elem=>{
        elem.addEventListener("click",()=>{
            id = elem.id;
            if(dotted){
                dotted.forEach(dots=>{
                    if(dots==id){
                        if(Ctype==0){
    
                            if("p"==chess.get(mov).type){
                                if("w"==chess.get(mov).color&&"8"==id.slice(1,2)){
                                    console.log("promotion");
                                    let prom = prompt("q=queen, b=bishop, n=knight, r=rock");
                                    chess.move({ from: mov, to: id ,  promotion: prom});
                                    refresh();
                                    socket.emit("mov",{ from: mov, to: id,  promotion: prom},room);
                                }else if("b"==chess.get(mov).color&&"1"==id.slice(1,2)){
                                    console.log("promotion");
                                    let prom = prompt("q=queen, b=bishop, n=knight, r=rock");
                                    chess.move({ from: mov, to: id ,  promotion: prom});
                                    refresh();
                                    socket.emit("mov",{ from: mov, to: id,  promotion: prom},room);
                                }else{
                                    chess.move({ from: mov, to: id });
                                    refresh();
                                    socket.emit("mov",{ from: mov, to: id},room);
                                }
    
                            }else{
                                chess.move({ from: mov, to: id });
                                refresh();
                                socket.emit("mov",{ from: mov, to: id},room);
                                
                            }
                            play("Sound/move.mp3");
                            startGame();
    
    
    
                        }else 
                        if("w"==chess.turn()){
                        
                            if(Ctype==1){
                                chess.move({ from: mov, to: "g1" });
                                chess.move({ from: "h1", to: "f1"});
                                refresh();
                                socket.emit("cas",{ from: mov, to: "g1"},{ from: "h1", to: "f1"},room);
                                play("Sound/castel.mp3");
                                startGame();
                            }else if(Ctype==2){
                                chess.move({ from: mov, to: "c1" });
                                chess.move({ from: "a1", to: "d1"});
                                refresh();
                                play("Sound/castel.mp3");
                                socket.emit("cas",{ from: mov, to: "c1"},{ from: "a1", to: "d1"},room);
                                startGame();
                            }
    
                        }else{
                            if(Ctype==1){
                                chess.move({ from: mov, to: "g8" });
                                chess.move({ from: "h8", to: "f8"});
                                refresh();
                                socket.emit("cas",{ from: mov, to: "g8"},{ from: "h8", to: "f8"},room);
                                play("Sound/castel.mp3");
                                startGame();
                            }else if(Ctype==2){
                                chess.move({ from: mov, to: "c8" });
                                chess.move({ from: "a8", to: "d8"});
                                refresh();
                                socket.emit("cas",{ from: mov, to: "c8"},{ from: "a8", to: "d8"},room);
                                play("Sound/castel.mp3");
                                startGame();
                            }
                            
                        }
                        if(elem.parentElement.style.border=="2px solid yellow"){//if the peices is yellow
                            if(eatable){
                                chess.move({ from: mov, to: pos });
                                movesMade++;
                                play("Sound/move.mp3");
                                socket.emit("mov",{ from: mov, to: pos},room);
                                refresh();
                                endCheck();
                            }
                        }
                        movesMade++;
                        endCheck();
                        
                    }
                    
                }); 
            }
        });  
    });
    
    
    
    
    
    socket.on("r-mov",(mov,cas)=>{
        console.log("opponent has played");
        if(chess.turn()==player2&&!aiMode){
            console.log("op has played");
            chess.move(mov);
            if(cas){
                chess.move(mov);
            }
            refresh();
            movesMade++;
            endCheck();
            play("Sound/move.mp3");
            startGame();
        }else{
            socket.on("op-disconnect",()=>{
                console.log("Your opponent is offline");
                aiMode=true;
                startGame();
            });
        }
    });


    function resolveAfter2Seconds() {
        return new Promise(resolve => {
          setTimeout(() => {
            chessAi();
            refresh();
            movesMade++;
            play("Sound/move.mp3");
            endCheck();
            startGame();
          }, 2000);
        });
      }
    
    
    async function asyncCall() {
        await resolveAfter2Seconds();
    }
    
    async function startGame(){
        
        
        if(chess.turn()==player2){
            if(!chess.in_checkmate()){
                if(aiMode){
                    asyncCall();
                }
            }
        }
        document.querySelectorAll(".peice").forEach(elem=>{

            elem.addEventListener("click",()=>{
                let color = elem.classList[2];
                let pos = elem.parentElement.id;
    
                if(elem.parentElement.style.border=="2px solid yellow"){//if the peices is yellow
                    if(eatable){
                        chess.move({ from: mov, to: pos });
                        movesMade++;
                        play("Sound/move.mp3");
                        refresh();
                        socket.emit("mov",{ from: mov, to: pos},room);
                        endCheck();
                    }
                }
                
                if(chess.turn()==player1||disc){
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
        if(player1=="b"){
            document.querySelectorAll(".box img").forEach(elem=>{
                elem.style.transform = "rotate(180deg)";
            })
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
                if(chess.turn()==player2){
                    play("Sound/win.mp3");
                }else{
                    play("Sound/fail.mp3");
                }
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


}    
























































