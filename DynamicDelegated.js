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
    // <GH: 2020-06-13
    //  I made some adjustments to this algorithm because
    //  character kept wobbling and rotating
    //  1. original had return of null if velocity 0; instead
    //    for LOW velocity, return null
    //  2. introduce dampening of the rotation in the update method
    //  3. swapped z and x in argument to atan2, to more naturally
    //    achieve expected behaviour on HTML5 canvas
    // >
    var velocity = this.character.velocity;
    // If not moving, then do nothing
    if ( velocity.length() <= 2.5 ) {
      return null;
    }
    // Otherwise set target based on the velocity
    this.target.orientation = Math.atan2( velocity.z, velocity.x );
    // Delegate rest to Align
    return super.getSteering();
  }
}