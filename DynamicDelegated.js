// Sample implementation of classes for experimenting with movement
// as described by Millington in AI For Games, 3ed (ai4g).

// Combined behaviours

class LookWhereYouAreGoing extends Align {  
  constructor( 
    character, 
    target,
    maxAngularAcceleration,
    maxRotation,
    targetRadius,
    slowRadius,
    timeToTarget
  ) {
    super(
      character, 
      target,
      maxAngularAcceleration,
      maxRotation,
      targetRadius,
      slowRadius,
      timeToTarget
    );
  }

  getSteering() {
    // Calculate the target to delegate to align
    var velocity = this.character.velocity;
    // If not moving, then do nothing
    if ( velocity.length() == 0 ) {
      return null;
    }
    // Otherwise set target based on the velocity
    this.target.orientation = Math.atan2( -velocity.x, velocity.z );
    // Delegate rest to Align
    return super.getSteering();
  }
}