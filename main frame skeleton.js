// Inits
window.onload = function init() {
    var game = new GF();
    game.start();
  };
   
   
  // GAME FRAMEWORK STARTS HERE
  var GF = function(){
    // Vars relative to the canvas
    var canvas, ctx, w, h;
    canvas = querySelector("#shooterGamer");
    
    
    var measureFPS = function(newTime){
    
  };
  // Clears the canvas content
  function clearCanvas() {
     ctx.clearRect(0, 0, w, h);
  }
  // Functions for drawing the monster and perhaps other objects
  function drawMyMonster(x, y) {
     ...
  }
  var mainLoop = function(time){
      // Main function, called each frame
      measureFPS(time);
      // Clear the canvas
      clearCanvas();
      // Draw the monster
      drawMyMonster(10+Math.random()*10, 10+Math.random()*10);
      // Call the animation loop every 1/60th of second
      requestAnimationFrame(mainLoop);
  };
   
  
  var start = function(){
      ...
      // Canvas, context etc.
      canvas = document.querySelector("#myCanvas");
      // often useful
      w = canvas.width;
      h = canvas.height;
      // important, we will draw with this object
      ctx = canvas.getContext('2d');
   
      // Start the animation
      requestAnimationFrame(mainLoop);
  };
   
  //our GameFramework returns a public API visible from outside its scope
  return {
     start: start
  };
  };




  function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
    var testX=cx;
    var testY=cy;
    if (testX < x0) testX=x0;
    if (testX > (x0+w0)) testX=(x0+w0);
    if (testY < y0) testY=y0;
    if (testY > (y0+h0)) testY=(y0+h0);
    return (((cx-testX)*(cx-testX)+(cy-testY)*(cy-testY))< r*r);
 }

 


  function testCollisionWithPlayer(b, index) {
    if(circRectsOverlap(player.x, player.y,
                       player.width, player.height,
                       b.x, b.y, b.radius)) {
      // we remove the element located at index
      // from the balls array
      // splice: first parameter = starting index
      //         second parameter = number of elements to remove
      balls.splice(index, 1);
    }
  }
  
  function testCollisionBallWithWalls(b) {
      // COLLISION WITH VERTICAL WALLS ?
      if((b.x + b.radius) > w) {
      // the ball hit the right wall
      // change horizontal direction
      b.speedX = -b.speedX;
      
      // put the ball at the collision point
      b.x = w - b.radius;
    } else if((b.x -b.radius) < 0) {
      // the ball hit the left wall
      // change horizontal direction
      b.speedX = -b.speedX;
      
      // put the ball at the collision point
      b.x = b.radius;
    }
    
    // COLLISIONS WTH HORIZONTAL WALLS ?
    // Not in the else as the ball can touch both
    // vertical and horizontal walls in corners
    if((b.y + b.radius) > h) {
      // the ball hit the right wall
      // change horizontal direction
      b.speedY = -b.speedY;
      
      // put the ball at the collision point
      b.y = h - b.radius;
    } else if((b.y -b.radius) < 0) {
      // the ball hit the left wall
      // change horizontal direction
      b.speedY = -b.speedY;
      
      // put the ball at the collision point
      b.Y = b.radius;
    }  
  }
  