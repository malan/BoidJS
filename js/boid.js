var origin = new THREE.Vector3(0, 0, 0);

function Boid(boidVars) {
  this.boids = boidVars;
  this.mesh = initSphere();

  this.direction = new THREE.Vector3();
  this.position = randomVector().multiplyScalar(400);

  this.moveForce = randomVector().multiplyScalar(1);
  this.direction.add(this.moveForce);

  this.speed = 3;

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

//Move randomly
Boid.prototype.moveRandomly = function() {
  this.direction.add(randomVector().multiplyScalar(0.002));
};


//Avoid the sphere
Boid.prototype.stayInside = function() {
  if(this.worldRadius - this.position.length() < 80) {
    //Head back to center
    toOriginForce = origin.clone().sub(this.position);

    this.direction.add(toOriginForce.normalize().multiplyScalar(0.05));
  }
};


//Force that makes Boids want to group together
Boid.prototype.group = function() {
  //Direction to the center of the group
  boidCenter = new THREE.Vector3();

  for(k=0;k<this.boids.length;k++) {

    if(this.boids[k] == this)
      continue;

    boidCenter.add(boids[k].position);
  }
  //Get the centoid of the group. Ignore this boid
  boidCenter.divideScalar(boids.length-1);

  toBoidCentroid = boidCenter.sub(this.position).normalize();

  this.direction.add(toBoidCentroid.multiplyScalar(0.35));
};


//Force that makes Boids want to avoid each other
Boid.prototype.avoid = function() {
  avoidBoids = new THREE.Vector3();

  for(k=0;k<this.boids.length;k++) {

    if(this.boids[k] == this)
      continue;

    //Direction away from this boid
    awayFromBoid = this.position.clone().sub(boids[k].position);

    //Scale inverse of distance to boid
    avoidBoids.add(awayFromBoid.divideScalar(this.position.distanceTo(boids[k].position)-80));
  }

   this.direction.add(avoidBoids.multiplyScalar(0.25).divideScalar(boids.length));
};

//Force that makes Boids want to flow in the same direction
Boid.prototype.follow = function() {
  //Direction of boid group
  boidDirection = new THREE.Vector3();

  for(k=0;k<this.boids.length;k++) {

    if(this.boids[k] == this)
      continue;

    boidDirection.add(boids[k].direction.normalize());
  }
  boidDirection.normalize();

  this.direction.add(boidDirection.multiplyScalar(0.15));
};


Boid.prototype.move = function() {
  this.position.add(this.direction.multiplyScalar(this.speed));

  this.mesh.position = this.position.clone();

  this.mesh.lookAt(this.direction.clone().multiplyScalar(10000));
};


