var origin = new THREE.Vector3(0, 0, 0);

var INSIDE    = 0.05,
    INSIDE_AT = 10,
    AVOID_AT  = 50,
    LOCAL     = 150,

    AVOID     = 0.01,
    GROUP     = 0.09,
    FOLLOW    = 0.02,

    RANDOM    = 0.05,
    SPEED     = 5;

function Boid() {
  this.mesh = initSphere();

  this.direction = randomVector();
  this.position = randomVector().multiplyScalar(400);
}

function initTriangle() {
  var geometry = new THREE.Geometry();

  geometry.vertices.push(
    new THREE.Vector3( -10,  10, 0 ),
    new THREE.Vector3( -10, -10, 0 ),
    new THREE.Vector3(  10, -10, 0 )
  );

  geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );

  geometry.computeBoundingSphere();

  var sphere = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());
  sphere.overdraw = true;
  return sphere;

};

function initSphere() {
  var sphere = new THREE.Mesh(new THREE.SphereGeometry(25, 5, 5), new THREE.MeshNormalMaterial());
  sphere.overdraw = true;
  return sphere;
};

function animateBoid(boid){
  boid.direction.normalize();

  stayInside(boid);

  group(boid);
  avoid(boid);
  moveRandomly(boid);
  follow(boid);

  boid.direction.normalize();

  move(boid);
};

// Is another boid nearby
function isNearby(boid, otherBoid) {
  if (otherBoid == boid)
    return false;

  distance = boid.position.distanceTo(otherBoid.position);
  return (distance < LOCAL);
};

//Move randomly
function moveRandomly(boid) {
  boid.direction.add(randomVector().multiplyScalar(RANDOM));
};


//Avoid the World Sphere
function stayInside(boid) {
  if(WORLD_RADIUS - boid.position.length() < INSIDE_AT) {
    //Head back to center
    toOriginForce = origin.clone().sub(boid.position);

    boid.direction.add(toOriginForce.normalize().multiplyScalar(INSIDE));
  }
};


//Force that makes Boids want to group together
function group(boid) {
  boidCenter = new THREE.Vector3();
  numBoids = 0;

  for(k=0;k<boids.length;k++) {

    if(isNearby(boid, boids[k])) {
      boidCenter.add(boids[k].position);
      numBoids += 1;
    }
  }

  if (numBoids > 0) {
    //Get the centoid of the group
    boidCenter.divideScalar(numBoids);

    toBoidCentroid = boidCenter.sub(boid.position).normalize();

    boid.direction.add(toBoidCentroid.multiplyScalar(GROUP));
  }
};


//Force that makes Boids want to avoid each other
function avoid(boid) {
  avoidBoids = new THREE.Vector3();
  numBoids = 0;

  for(k=0;k<boids.length;k++) {

    if(isNearby(boid, boids[k])) {
      //Direction away from this boid
      awayFromBoid = boid.position.clone().sub(boids[k].position);

      //Scale inverse of distance to boid
      distance = boid.position.distanceTo(boids[k].position);
      avoidBoids.add(awayFromBoid.divideScalar(Math.abs(boid.position.distanceTo(boids[k].position)-80)));
      numBoids += 1;
    }
  }

  if (numBoids > 0) {
    boid.direction.add(avoidBoids.multiplyScalar(AVOID));
  }
};


//Force that makes Boids want to flow in the same direction
function follow(boid) {
  //Direction of boid group
  boidDirection = new THREE.Vector3();
  numBoids = 0;

  for(k=0;k<boids.length;k++) {

    if(isNearby(boid, boids[k])) {
      boidDirection.add(boids[k].direction.normalize());
      numBoids += 1;
    }
  }
  boidDirection.normalize();

  if (numBoids > 0) {
    boid.direction.add(boidDirection.multiplyScalar(FOLLOW));
  }
};


//Update boid's position and move mesh to new position
function move(boid) {
  boid.position.add(boid.direction.multiplyScalar(SPEED));

  boid.mesh.position = boid.position.clone();

  boid.mesh.lookAt(boid.direction.clone().multiplyScalar(10000));
};


