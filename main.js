// Main program
// Test the Kinematic.js and Vector.js library

// In JS: assignment for classes, new object NOT created!

// create a kinematic body with these 
// position, orientation, velocity and rotation (p, o, v, r)

// Suppose 100 pixels on canvas represents 2cm, or 0.02 m
// Or, we think in pixels per second, rather than meters per second.

let p = new Vector(300,0,300);
let o = 0;
let v = new Vector( 0, 0, 0 );
let r = 0;

// create a character c1 with Kinematic body
let c1 = {
  body: new Kinematic( p, o, v, r),
  draw: function(context) {
    x = this.body.position.x;
    z = this.body.position.z;
    context.save();
    context.beginPath();
    // when I add the transforms, the mouse cursor stops working
//    context.translate(x+25, z);
//    context.rotate( this.body.orientation * Math.PI / 180 );
//    context.translate(-(x+25), -z);

    // draw triangle
//    context.moveTo( x, z );
//    context.lineTo( x+25, z+25);
//    context.lineTo( x+25, z-25);
//    context.fill();
    
    // draw a circle
    context.arc( x, z, 20, 0, 2 * Math.PI);
    context.stroke();
    
    context.restore;
  },
}

// create a steering object s1, to steer the character c1
let s1 = new SteeringOutput( 
  new Vector( 0, 0, 0 ),
  0,
);

// Set up the canvas
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var canvasPosition = canvas.getBoundingClientRect();

// Set the line style
context.lineWidth = 5;
context.strokeStyle = "rgb(33,66,99)";

// create a mouse character
var mouse = {
  position: new Vector( 0, 0, 0 ),
  draw: function(context) {
    // Adjust for the position of the canvas
    // https://www.w3schools.com/jsref/event_clientx.asp
    var x = this.position.x - canvasPosition.left;
    var z = this.position.z - canvasPosition.top;
    context.beginPath();
    context.arc( x, z, 10, 0, 2 * Math.PI);
    context.stroke();
  }
}
document.onmousemove = function(e){
    mouse.position.x = e.pageX;
    mouse.position.z = e.pageY;
}
setInterval(checkCursor, 1000);
function checkCursor(){
//  console.log("x: " + mouse.x + ", y: " + mouse.z + ".");
}

function frame( nowTime, lastTime )
{           
  // Have character c1 seek the mouse.
  // Experiment with different algorithms: Seek, Arrive, etc.
  var maxSpeed = 100;
//  var k1 = new KinematicSeek( c1.body, mouse, maxSpeed );
  var k1 = new KinematicArrive( c1.body, mouse, maxSpeed );
  var steering = k1.getSteering();
  
//  console.log( c1.body.orientation );

  // Apply the steering to the character, if it exists
  // n.b. object assignment does NOT create a copy of the object
  if (typeof steering !== "undefined" && steering !== null) {
    c1.body.velocity = steering.velocity;
    c1.body.rotation = steering.rotation;
  }

  // Clear canvas
  context.clearRect( 0, 0, 600, 600 );

  var time = (nowTime - lastTime) / 1000;

  // Update character movement
  c1.body.update( s1, time );
  
  // Draw the bodies
  // Should this be before or after the position update?
  c1.draw(context);
  mouse.draw(context);

// Repeat the animation when ready 
  requestAnimationFrame(
      function(timestamp){ 
        frame( timestamp, nowTime );
      }
  );
}

// Initialize the frame animation
frame( 0, 0 );

