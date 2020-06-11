// Sample implementation of classes for experimenting with movement
// as described by Millington in AI For Games, 3ed (ai4g).

// As per ai4g, y-axis will be up, x and z will be game plane.

// Dynamic Steering:
// input: static data about position and orientation
// output: desired accelerations

// Kinematic algorithms are bread and butter, in Kinematic.js
// Dynamic algorithms in widespread use, more complex. (p.51)

class Seek {
  constructor( character, target, maxAcceleration ) {
    this.character = character;
    this.target = target;
    this.maxAcceleration = maxAcceleration;
  }
  
  getSteering() {
    var result = new SteeringOutput();
    
    // Get direction to the target, as a new vector
    result.linear = this.target.position.subtract( this.character.position );
    
    // acceleration is along this direction, at full
    result.linear.unit();     // normalize 
    result.linear.multiply( this.maxAcceleration );
    
    result.angular = 0;
    return result;
  }
}

class Arrive {
  constructor( character, target, maxAcceleration, maxSpeed, targetRadius, slowRadius, timeToTarget = 0.1 ) 
  {
    this.character = character;
    this.target = target;
    this.maxAcceleration = maxAcceleration;
    this.maxSpeed = maxSpeed;
    // The radius for arriving at the target
    this.targetRadius = targetRadius;
    // Radius for beginning to slow down
    this.slowRadius = slowRadius;
    // Time over which to achieve target speed
    this.timeToTarget = timeToTarget;
  }
  getSteering() {
    var result = new SteeringOutput();
    
    // Get direction to the target, as a new vector
    var direction = this.target.position.subtract( this.character.position );
    var distance = direction.length();
    
    // Check if we are there, return no steering
    if ( distance < this.targetRadius ) {
      return null;
    }
    
    // If we are outside the slowRadius, then move at max speed
    // otherwise calculate a scaled speed
    var targetSpeed;
    if ( distance > this.slowRadius ) {
      targetSpeed = this.maxSpeed;
    }
    else {
      targetSpeed = this.maxSpeed * distance / this.slowRadius;
    }
    
    // Target velocity combines speed and direction.
    var targetVelocity;
    targetVelocity = direction.unit();
    targetVelocity = targetVelocity.multiply( targetSpeed );
    
    // Acceleration tries to get to the target velocity
    result.linear = targetVelocity.subtract( this.character.velocity );
    result.linear = result.linear.divide( this.timeToTarget );
    
    // Clip to max acceleration if needed
    if ( result.linear.length() > this.maxAcceleration ) {
      result.linear = result.linear.unit();
      result.linear = result.linear.multiply( this.maxAcceleration );
    }  

    result.angular = 0;
    return result;
  }
}
