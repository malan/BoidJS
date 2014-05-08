var origin = new THREE.Vector3(0, 0, 0);

var RANDOM    = 0.05,
    INSIDE    = 0.05,
    INSIDE_AT = 10,
    GROUP     = 0.09,
    AVOID     = 0.01,
    AVOID_AT  = 50,
    FOLLOW    = 0.02,
    LOCAL     = 150;

function Boid(boidVars) {
  this.boids = boidVars;
  this.mesh = initSphere();

  this.direction = randomVector();
  this.position = randomVector().multiplyScalar(400);

  this.speed = 5;

  this.worldRadius = window.innerHeight/1.4;

}

function initSphere() {
  var sphere = new THREE.Mesh(new THREE.SphereGeometry(25, 5, 5), new THREE.MeshNormalMaterial());
  sphere.overdraw = true;
  return sphere;
};

Boid.prototype.animate = function() {
  this.direction.normalize();

  this.stayInside();

  this.group();
  this.avoid();
  this.moveRandomly();
  this.follow();

  this.direction.normalize();

  this.move();
};

// Is another boid nearby
Boid.prototype.isNearby = function(otherBoid) {
  if (this.boids[k] == this)
    return false;

  distance = this.position.distanceTo(otherBoid.position);
  return (distance < LOCAL);
};

//Move randomly
Boid.prototype.moveRandomly = function() {
  this.direction.add(randomVector().multiplyScalar(RANDOM));
};


//Avoid the sphere
Boid.prototype.stayInside = function() {
  if(this.worldRadius - this.position.length() < INSIDE_AT) {
    //Head back to center
    toOriginForce = origin.clone().sub(this.position);

    this.direction.add(toOriginForce.normalize().multiplyScalar(INSIDE));
  }
};


//Force that makes Boids want to group together
Boid.prototype.group = function() {
  //Direction to the center of the group
  boidCenter = new THREE.Vector3();
  numBoids = 0;

  for(k=0;k<this.boids.length;k++) {

    if(this.isNearby(this.boids[k])) {
      boidCenter.add(boids[k].position);
      numBoids += 1;
    }
  }

  if (numBoids > 0) {
    //Get the centoid of the group
    boidCenter.divideScalar(numBoids);

    toBoidCentroid = boidCenter.sub(this.position).normalize();

    this.direction.add(toBoidCentroid.multiplyScalar(GROUP));
  }
};


//Force that makes Boids want to avoid each other
Boid.prototype.avoid = function() {
  avoidBoids = new THREE.Vector3();
  numBoids = 0;

  for(k=0;k<this.boids.length;k++) {

    if(this.isNearby(this.boids[k])) {
      //Direction away from this boid
      awayFromBoid = this.position.clone().sub(boids[k].position);

      //Scale inverse of distance to boid
      distance = this.position.distanceTo(boids[k].position);
      avoidBoids.add(awayFromBoid.divideScalar(Math.abs(this.position.distanceTo(boids[k].position)-80)));
      numBoids += 1;
    }
  }

  if (numBoids > 0) {
    this.direction.add(avoidBoids.multiplyScalar(AVOID));
  }
};

//Force that makes Boids want to flow in the same direction
Boid.prototype.follow = function() {
  //Direction of boid group
  boidDirection = new THREE.Vector3();
  numBoids = 0;

  for(k=0;k<this.boids.length;k++) {

    if(this.isNearby(this.boids[k])) {
      boidDirection.add(boids[k].direction.normalize());
      numBoids += 1;
    }
  }
  boidDirection.normalize();

  if (numBoids > 0) {
    this.direction.add(boidDirection.multiplyScalar(FOLLOW));
  }
};


Boid.prototype.move = function() {
  this.position.add(this.direction.multiplyScalar(this.speed));

  this.mesh.position = this.position.clone();

  this.mesh.lookAt(this.direction.clone().multiplyScalar(10000));
};


