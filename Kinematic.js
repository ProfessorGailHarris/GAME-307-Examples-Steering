// Sample implementation of classes for experimenting with movement
// as described by Millington in AI For Games, 3ed (ai4g).

// As per ai4g, y-axis will be up, x and z will be game plane.

// Kinematic Steering:
// input: static data about position and orientation
// output: desired velocity

// These kinematic algorithms are bread and butter.
// Dynamic algorithms, to be covered later, in widespread use, more complex. (p.51)

class Kinematic {
  constructor( position, orientation, velocity, rotation ) {
    this.position = position;       // vector
    this.orientation = orientation; // float
    this.velocity = velocity;       // vector
    this.rotation = rotation;       // float
  }
  
  update( steering, time ) {
    // Update the position and orientation 
    Vector.add( 
      this.position,  
      this.velocity.multiply( time ), 
      this.position 
    );
    this.orientation += this.rotation * time
    
    // Update velocity and rotation
    Vector.add( 
      this.velocity,
      steering.linear.multiply(time), 
      this.velocity
    );
    this.rotation += steering.angular * time;
  }
}

// an acceleration vector, used for Kinematic.update() 
// set to 0 in many examples
class SteeringOutput {
  constructor( linear, angular ) {
    this.linear = linear;   // Vector
    this.angular = angular; // float
  }
}

class KinematicSteeringOutput {
  constructor( velocity, rotation ) {
    this.velocity = velocity;   // Vector
    this.rotation = rotation;   // float
  }
}

function newOrientation( orientation, velocity ) {
  var result;
  if ( velocity.length() > 0 ) {
    result = velocity.toAngles().theta;
  }
  else {
    result = orientation;
  }
  return result;
}

class KinematicSeek {
  constructor( character, target, maxSpeed ) {
    this.character = character;
    this.target = target;
    this.maxSpeed = maxSpeed;
  }
  
  getSteering() {
    var result = new KinematicSteeringOutput();
    
    // Get direction to the target, as a new vector
    result.velocity = this.target.position.subtract( this.character.position );
    
    // velocity is along this direction, at full speed
    result.velocity.unit();     // normalize 
    result.velocity.multiply( this.maxSpeed );
    
    // face in direction we want to move
    this.character.orientation = newOrientation(
      this.character.orientation,
      result.velocity
    );
    result.rotation = 0;
    return result;
  }
}

class KinematicArrive {
  // ai4g says this should solve oscillation at arrival
  // however this seems to oscillate more than Seek
  constructor( character, target, maxSpeed ) {
    this.character = character;
    this.target = target;
    this.maxSpeed = maxSpeed;
    this.radius = 0.5;
    this.timeToTarget = 0.25;
  }
  
  getSteering() {
    var result = new KinematicSteeringOutput();
    
    // Get direction to the target, as a new vector
    result.velocity = this.target.position.subtract( this.character.position );
    
    // check if we're within radius
    if ( result.velocity.length() < this.radius ) {
      // request no steering
      return null;
    }
    
    // we need to move to our target, and we'd like
    // to get there in timeToTarget seconds.
    result.velocity = result.velocity.divide(this.timeToTarget);
    // n.b. generates new vector object
    
    // If this is too fast, clip it to max speed
    if ( result.velocity.length() > this.maxSpeed ) {   
      result.velocity.unit();     // normalize 
      result.velocity.multiply( this.maxSpeed );
    }
    
    // face in direction we want to move
    this.character.orientation = newOrientation(
      this.character.orientation,
      result.velocity
    );
    result.rotation = 0;
    return result;
  }
}
