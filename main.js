// Main program
// Test the Kinematic.js and Vector.js library

// In JS: assignment for classes, new object NOT created!

// create a kinematic body with these 
// position, orientation, velocity, rotation, maxSpeed, maxAcceleration
// (p, o, v, r, m, a)

// Suppose 100 pixels on canvas represents 2cm, or 0.02 m
// Or, we think in pixels per second, rather than meters per second.

let p = new Vector(300,0,300);
let o = 0;
let v = new Vector( 0, 0, 0 );
let r = 0;
let m = 100;
let a = 80;

// create a character c1 with Kinematic body
let c1 = {
  body: new Kinematic( p, o, v, r, m, a ),
  draw: function(context) {
    x = this.body.position.x;
    z = this.body.position.z;
    context.beginPath();
    
    // Adjust canvas transform:
    //   set origin of canvas to center of character shape
    //   and rotate to desired orientation
    context.translate(x, z);
    context.rotate( this.body.orientation );
    
    // Set origin back to original position, to prepare for drawing
    context.translate(-(x), -z);

    // Draw triangle for the character
    context.moveTo( x, z );
    context.lineTo( x-20, z+15);
    context.lineTo( x-20, z-15);
    context.fill();
        
    // Restore canvas transform to default (identity)
    context.setTransform();
  },
}

// Create a steering object s1, to steer the character c1
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

// create a mouse character, a small circle
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
// monitor position of the mouse
document.onmousemove = function(e){
    mouse.position.x = e.pageX;
    mouse.position.z = e.pageY;
}

function kinematic_motion( nowTime, lastTime )
{           
  // Have character c1 seek the mouse.
  // Experiment with different algorithms: Seek, Arrive, etc.

//  var k1 = new KinematicSeek( c1.body, mouse, c1.body.maxSpeed );
  var k1 = new KinematicArrive( c1.body, mouse, c1.body.maxSpeed );

    
  // Apply the kinematic steering to the character, if it exists.
  // If using dynamic movement, or if character has caught up,
  // then steering won't exist
  // n.b. object assignment does NOT create a copy of the object
  if ( typeof k1 !== "undefined" ) {
    var steering = k1.getSteering();
    if ( typeof steering !== "undefined" && steering !== null) {
      c1.body.velocity = steering.velocity;
      c1.body.rotation = steering.rotation;
    }
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
        kinematic_motion( timestamp, nowTime );
      }
  );
}

function dynamic_motion( nowTime, lastTime )
{           
  // Have character c1 seek the mouse.
  // Experiment with different algorithms: Seek, Arrive, etc.

  var movement;
//  movement = new Seek( c1.body, mouse, c1.body.maxAcceleration );
//  movement = new VelocityMatch( c1.body, mouse,  c1.body.maxAcceleration );
  movement = new Arrive( c1.body, mouse,  c1.body.maxAcceleration, c1.body.maxSpeed, 3, 50 );

  var l1 = null;
  if ( typeof movement !== "undefined" && movement !== null ) {
    l1 = movement.getSteering();
  }
  
  // Can't test Align by following mouse, cuz mouse has no orientation
  // Instead we will use LookWhereYouAreGoing class
  var rotation;
  
  // Arguments to Align and subclasses:
  //  maxAngularAcceleration,
  //  maxRotation,
  //  targetRadius,
  //  slowRadius,
  
  rotation = new LookWhereYouAreGoing( c1.body, mouse, 0.5, 1, 0.5, 2, 0.1 );

  var a1 = null;
  if ( typeof rotation !== "undefined" && rotation !== null ) {
    a1 = rotation.getSteering();
  }
    
  // Apply the dynamic steering for use by the character
  if ( l1 !== null ) {
    s1.linear = l1.linear;
  }
  if ( a1 !== null ) {
    s1.angular = a1.angular;
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
        dynamic_motion( timestamp, nowTime );
      }
  );
}


// Initialize the frame animation
//kinematic_motion( 0, 0 );
dynamic_motion( 0, 0 );
