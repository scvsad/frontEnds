//plar starting position. canvas size 600x600, top left corner = 0,0

var inputStates={};
inputStates.zToggle = true;
var playerX=300, playerY=550;
var playerR=10;
var playerSpeed = 10;
var playerScore = 0;
var playerBullets = [];
var mapPosition = 0;
var enemyArray = [];
var currentGameState = 0;
var isoEnemyBullets=[];

let gameStateEnum = {
    HOME_SCREEN : {description : "Home Screen"},
    GAME_OVER : {description : "Game Over"},
    RUNNING : {description : "Game Running"},
    PAUSED : {description : "Game Paused"}
}

// Inits
window.onload = function init() {

    canvas = document.querySelector("#shooterGame");
    w = canvas.width;
    h = canvas.height;
    ctx = canvas.getContext('2d');
    canvas.tabIndex=1;
    currentGameState = gameStateEnum.HOME_SCREEN;

    gameInitialize();

    requestAnimationFrame(mainLoop);


};


var mainLoop = function(time){
    // Main function, called each frame
    //measureFPS(time);
    // Clear the canvas
 
    switch (currentGameState){

        case gameStateEnum.HOME_SCREEN:
            gameHomescreen();
            break;
        
        case gameStateEnum.GAME_OVER:
            gameOverscreen();
            break;

        case gameStateEnum.RUNNING:
            clearCanvas();
            playerControl(inputStates, playerSpeed);
            // Draw the monster
            enemyUpdates(enemyArray);
            playerShoot(mapPosition);

            drawEnemy(enemyArray);
            drawPlayer(playerX,playerY);
            displayStats();
            // Call the animation loop every 1/60th of second
            createEnemy(mapPosition);
            creepCollision(playerBullets, enemyArray);
            screenWindowDetect();
            mapPosition += 1;
            requestAnimationFrame(mainLoop);

        case gameStateEnum.PAUSED:
            //todo
            break;

        default:
            gameHomescreen();
            break;
        }
    
    //playerControl();
};


function gameInitialize(){
// using inputState to update current command gives much smoother control
// than simply changing position upon keydown events.

    window.addEventListener('keydown', function(event){
        if (event.keyCode === 37) {
          inputStates.left = true;
        } else if (event.keyCode === 38) {
          inputStates.up = true;
        } else if (event.keyCode === 39) {
          inputStates.right = true;
        } else if (event.keyCode === 40) {
          inputStates.down = true;
        } else if (event.keyCode === 16){
          playerSpeed = 2;  // hold down shift for precise move
        } else if (event.keyCode === 90){
            inputStates.zToggle = !(inputStates.zToggle);
            console.log("zToggle = " +inputStates.zToggle+" ");
        }
        
        //only allows game restart in gameover screen
        else if (event.keyCode === 32 && currentGameState === gameStateEnum.GAME_OVER) {
          //inputStates.space = true;
            gameReset();
        }

        //prevents window from scrolling when controlling game
        event.preventDefault();
        return false;

      });

    window.addEventListener('keyup', function(event){
        if (event.keyCode === 37) {
          inputStates.left = false;
        } else if (event.keyCode === 38) {
          inputStates.up = false;
        } else if (event.keyCode === 39) {
          inputStates.right = false;
        } else if (event.keyCode === 40) {
          inputStates.down = false;
        } else if (event.keyCode === 16){
            playerSpeed = 10;  // release shift for regular move
        } 
        
        else if (event.keyCode === 32) {
          //inputStates.space = false;
          currentGameState = gameStateEnum.RUNNING;
        }

        //prevents window from scrolling when controlling game
        event.preventDefault();
        return false;

      });

      
}

function playerControl(inputStates, speed){

    if (inputStates.left) {
        playerX = playerX - speed;
      }
      if (inputStates.right) {
        playerX = playerX + speed;
      }
     if (inputStates.up) {
        playerY = playerY - speed;
     }
     if (inputStates.down) {
        playerY = playerY + speed;
     }
     if (inputStates.space) {
        playerX = playerX - speed;
     }
}


function clearCanvas() {
    ctx.clearRect(0, 0, w, h);
}


// Functions for drawing the monster and perhaps other objects
function drawPlayer(playerX, playerY) {
    // GOOD practice: save the context, use 2D trasnformations
    ctx.save();
  
    // translate the coordinate system, draw relative to it
    ctx.translate(playerX, playerY);
  
    ctx.fillStyle = 'blue';
    // (0, 0) is the top left corner of the monster.
    ctx.beginPath();
    ctx.arc(0, 0, playerR, 0, 2*Math.PI);
    ctx.fill();
 
    // GOOD practice: restore the context
    ctx.restore();
}

  
function createEnemy(mapPosition){
    //create enemy object every set interval). calls functions to creat specific enemy. this function only act as mapPostion activated callers
    //creep(type, creepX, creepY, creepR, creepSpeedX, creepSpeedY, alive)
    /*if (mapPosition%500==1){
        var creeper= new creep('dumb', 300, 0, 10, 0, 2, true);
        enemyArray.push(creeper);
        console.log(enemyArray);
    }
    */

   createEnemyBullet(enemyArray, mapPosition);

    if (mapPosition%300==1){
        var creeper= new creep('simpleShooter', 200, 0, 7, 0, 1, true);
        enemyArray.push(creeper);
        var creeper= new creep('simpleShooter', 400, 0, 7, 0, 1, true);
        enemyArray.push(creeper);
    }

    /*
    if (mapPosition%500==1){
        var creeper= new creep('simpleShooter', 250, 0, 7, 0, 0, true);
        enemyArray.push(creeper);
        var creeper= new creep('simpleShooter', 300, 0, 7, 0, 0, true);
        enemyArray.push(creeper);
    }
    */
   
    if (mapPosition%700==1){
        var creeper= new creep('dumb', 250, 0, 8, 1, 2, true);
        enemyArray.push(creeper);
        var creeper= new creep('dumb', 300, 0, 8, -1, 2, true);
        enemyArray.push(creeper);

    }


    if (mapPosition%400==1){
        var creeper= new creep('simpleShooter', 50, 0, 5, 1, 0.5, true);
        enemyArray.push(creeper);
        var creeper= new creep('simpleShooter', 550, 0, 5, -1, 0.5, true);
        enemyArray.push(creeper);

    }

    if (mapPosition%200==1){
        var creeper= new creep('dumb', 50, 20, 5, 2, 0.5, true);
        enemyArray.push(creeper);
        var creeper= new creep('dumb', 550, 20, 5, -2, 0.5, true);
        enemyArray.push(creeper);

    }


    

    /*
    if (mapPosition %100==1){

        for (let i=0; i<enemyArray.length; i++){
            enemyArray[i].addBullet();
        }

    }
    */
}

class creep{
    //template for creep creation
    constructor(type, creepX, creepY, creepR, creepSpeedX, creepSpeedY, alive){
        this.type = type;
        this.creepX = creepX;
        this.creepY = creepY;
        this.creepR = creepR;
        this.creepSpeedX = creepSpeedX;
        this.creepSpeedY = creepSpeedY;
        this.bulletX = creepX;
        this.bulletY = creepY;
        this.bulletArray= [];

        this.alive = alive;

        /*
        if (type=='dumb'){
            this.shooter=false;
            
        }

        if (type=='simpleShooter'){
            var bullet;
            this.shooter=true;
            this.bulletX=creepX;
            this.bulletY=creepY;
            this.bulletspdX=0;
            this.bulletspdY=20;
        }
        */
    }

    move() {
        if (this.type =="simpleShooter"){
            this.creepX += this.creepSpeedX;
            this.creepY += this.creepSpeedY;
            return;
        }

        if(this.type == "dumb"){
            this.dumbMove();
            return;
        }
        if(this.type = "b"){
           // bTypeMove();
           return;
        }
    }
    
    dumbMove(){
        this.creepX += parseInt(Math.sin(mapPosition/30));
        this.creepY += this.creepSpeedY;
    }

    


}

class creepBullet{
    constructor(bulletType){

        if (bulletType == 'dumb'){
            this.spdX=0;
            this.spdY=0;
        }

        if (bulletType == 'simpleShooter'){
            this.spdX=0;
            this.spdY=5;
        }

        //more types
}
}



function drawEnemy(enemyArray){
    //animate enemy on canvas. remember to refine drawings
    for (let i=0; i<enemyArray.length; i++){
        ctx.save();
        ctx.translate(enemyArray[i].creepX, enemyArray[i].creepY);
        ctx.fillStyle = 'red';
        // (0, 0) is the top left corner of the monster.
        ctx.beginPath();
        ctx.arc(0, 0, enemyArray[i].creepR, 0, 2*Math.PI);
        ctx.fill();        
        ctx.restore();

        drawBullet(isoEnemyBullets);
    }
}


// 0= not-hit, 1= hit, 2= barely hit
function collisionDetect (ax, ay, ar, bx, by, br){
    let collisionRange= ar+br;
    let centerDistance= Math.sqrt(Math.pow((ax-bx),2)+Math.pow((ay-by),2));

    if (centerDistance<collisionRange) {
        return 1; //hit
    }
    else if(centerDistance>=collisionRange && centerDistance<=(collisionRange+3)){
        return 2; //barely hit
    }
    else if(centerDistance>(collisionRange+3)){
        return 0; //not hit
    }
}

 
function creepCollision(hitArray, colliderArray){
    for (let i=0; i<colliderArray.length; i++){
        let collisionResult= collisionDetect(playerX, playerY, playerR, colliderArray[i].creepX, colliderArray[i].creepY, colliderArray[i].creepR);
        
        for (let j=0; j<isoEnemyBullets.length;j++){
            //enemyArray[i].bulletArray.push(enemyBullets);
            let playerHitten= collisionDetect(playerX, playerY, playerR, isoEnemyBullets[j].posX, isoEnemyBullets[j].posY, isoEnemyBullets[j].r);
            
            if (playerHitten == 1){
                console.log('hit');
                currentGameState = gameStateEnum.GAME_OVER;
            }
            else if(playerHitten == 2){
                playerScore +=1;
                console.log('cadan');
            }
    
        }



        if (collisionResult == 1){
            console.log('hit');
            currentGameState = gameStateEnum.GAME_OVER;
        }
        else if(collisionResult == 2){
            playerScore +=1;
            console.log('cadan');
        }

        let aliveFlag=true; //alive flag used to determine if creepArray cell needs to be removed. removal inside for loop creates size access problem.
        for(let j=0; j<hitArray.length;j++){
            let result = collisionDetect(hitArray[j].posX, hitArray[j].posY, hitArray[j].r, colliderArray[i].creepX, colliderArray[i].creepY, colliderArray[i].creepR);
            if (result == 1){
                aliveFlag=false;                
                hitArray.splice(j,1);
                j=j-1;
                playerScore +=10;
            }
        }

        if (aliveFlag == false){
            colliderArray.splice(i,1);
            i=i-1;
        }

        //colliderArray[i].posX<-10 || colliderArray[i].posX>610 ||             
        else if (colliderArray[i].creepY>610){
            colliderArray.splice(i,1);
            i=i-1;
        }
    }

    for (let j=0; j<isoEnemyBullets.length; j++){
        if (isoEnemyBullets[j].posY>610 || isoEnemyBullets[j].posX<-20 || isoEnemyBullets[j].posX>620){
            isoEnemyBullets.splice(j,1);
            j=j-1;
        }
    }
}

function gameHomescreen(){
    clearCanvas();
    ctx.font = "30px Arial";
    ctx.fillText("Press Spacebar to start game", 100, 200);
    requestAnimationFrame(mainLoop);
}

function gameOverscreen(){
    clearCanvas();
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", 200, 200);
    ctx.fillText("Score:  " + playerScore + " ", 200, 300)
    ctx.fillText("Press spacebar to restart", 130, 400);
    requestAnimationFrame(mainLoop);
}

function gameReset(){
    //reset game data
    enemyArray=[];
    playerX=300;
    playerY=550;
    mapPosition=1;
    playerScore=0;
    isoEnemyBullets=[];
}


function displayStats(){
    ctx.save();

    ctx.font = "10px Arial";
    ctx.fillText("Score:  " + playerScore + " ", 480, 20);
    

    ctx.restore();
}



function screenWindowDetect(){
    if (playerX <= (0 +playerR)){
        playerX = 1+playerR;
    }
    if (playerY <= (0 +playerR)){
        playerY = 1+playerR;
    }
    
    if(playerX >= (w -playerR)){
        playerX =600-playerR;
    }
    if(playerY >= (h -playerR)){
        playerY =600-playerR;
    }

    for (let i=0; i<playerBullets.length; i++){
        if (playerBullets[i].posY<10){
            playerBullets.splice(i,1);
        }
    }

}



function playerShoot(mapPosition){
    
    if (mapPosition %5 == 1  &&  inputStates.zToggle==true){ // shoot frequency and shoot toggle
        var bullet = new playerBullet(playerX, playerY, 1);
        playerBullets.push(bullet);
    }
    

    for(let i=0;i<playerBullets.length;i++){
        playerBullets[i].posX +=playerBullets[i].spdX;
        playerBullets[i].posY +=playerBullets[i].spdY;
    }

    drawBullet(playerBullets);
}


class playerBullet{
    constructor (playerX, playerY, type){
        this.posX=playerX;
        this.posY=playerY;
        this.type=type;
        this.spdX=0;
        this.spdY=0;

        if (type===1){
            this.r=5;
            this.spdX=0;
            this.spdY=-10;
        }
        else if (type===2){
            this.r=3;
            this.spdX=0;
            this.spdY=-20;
        }

    }

}


function drawBullet(bulletArray){

    for (let i=0; i<bulletArray.length; i++){
        ctx.save();
    
        // translate the coordinate system, draw relative to it
        ctx.translate(bulletArray[i].posX, bulletArray[i].posY);
    
        ctx.fillStyle = 'black';
        // (0, 0) is the top left corner of the monster.
        ctx.beginPath();
        ctx.arc(0, 0, bulletArray[i].r, 0, 2*Math.PI);
        ctx.fill();
    
        // GOOD practice: restore the context
        ctx.restore();
    }
}

class enemyBullet{

    constructor(enemyArrayI){

    if (enemyArrayI.type == "simpleShooter"){ //straight down bullets
        this.posX= enemyArrayI.creepX;
        this.posY= enemyArrayI.creepY;
        this.spdX = 0;
        this.spdY = 10;
        this.r = 5;
    }

    else if (enemyArrayI.type == "dumb"){
        this.posX= 0;
        this.posY= 0;
        this.spdX = 0;
        this.spdY = 0;
        this.r = 0;
    }

    }

}

class isoBullet{

    constructor(enemyArrayI){

        if (enemyArrayI.type == "simpleShooter"){ //straight down bullets
            this.posX= enemyArrayI.creepX;
            this.posY= enemyArrayI.creepY;
            this.spdX = 0;
            this.spdY = 10;
            this.r = 5;
        }
    
        else if (enemyArrayI.type == "dumb"){
            this.posX= 0;
            this.posY= 0;
            this.spdX = 0;
            this.spdY = 0;
            this.r = 0;
        }
    
        }

}



function createEnemyBullet(enemyArray, mapPosition){
    for (let i=0; i<enemyArray.length; i++){
        if (enemyArray[i].type == "simpleShooter" && mapPosition%50==1){
            var oneEnemyBullet = new isoBullet(enemyArray[i]);
            isoEnemyBullets.push(oneEnemyBullet);

        }

    }

}


function enemyUpdates(enemyArray){
    //enemy position and bullet position updates
    for (let i=0; i<enemyArray.length; i++){
        enemyArray[i].move();
        //enemy bulets position updates, and creation?
        //for (let j=0; j)
    }
    
    if(isoEnemyBullets.length>0){
        for (let j=0; j<isoEnemyBullets.length; j++){
            isoEnemyBullets[j].posX += isoEnemyBullets[j].spdX;
            isoEnemyBullets[j].posY += isoEnemyBullets[j].spdY;

        }
    }




    /*
    for (let i=0; i<enemyArray.length; i++){
        enemyArray[i].creepX = enemyArray[i].creepX + enemyArray[i].creepSpeedX;
        enemyArray[i].creepY = enemyArray[i].creepY + enemyArray[i].creepSpeedY;
    }
    */
}
