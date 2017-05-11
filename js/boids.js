var origin = new THREE.Vector3(0, 0, 0);

    
var
    //How hard boids avoid the outside of the world
    INSIDE    = 0.05, 

    //How close to the outside of the world boids can get before being pulled back
    INSIDE_AT = 10, 

    //Distance below which a boid is considered "local"
    LOCAL     = 150, 

    //How hard boids try to avoid each other
    AVOID     = 0.01,
    //How hard boids try to group together
    GROUP     = 0.09,
    //How hard boids try to follow each other
    FOLLOW    = 0.02,

    //How much boids move around randomly
    RANDOM    = 0.05,

    //How fast the boids move
    SPEED     = 5;

//Create a single boid
function Boid() {
  //This defines what the boid will actually look like :-)
  this.mesh = initCube(); //initCube();

  //Sets the direction and position of the boid
  this.direction = randomVector();
  this.position = randomVector().multiplyScalar(400);
}

function ColourfulBoid() {
  //This defines what the boid will actually look like :-)
  this.mesh = initColourfulSphere(); //initCube();

  //Sets the direction and position of the boid
  this.direction = randomVector();
  this.position = randomVector().multiplyScalar(400);
}

//Draw a Sphere Boid of a single colour
function initSphere() {
  var sphereMaterial = new THREE.MeshNormalMaterial();
  var sphereMaterial = new THREE.MeshBasicMaterial();

  var sphere = new THREE.Mesh(new THREE.SphereGeometry(25, 5, 5), sphereMaterial);

  sphere.material.color.setHex( 0xabcdef );
  sphere.overdraw = true;
  return sphere;
};

//Draw a Cube Boid of a single colour
function initCube() {
  var cubeMaterial = new THREE.MeshNormalMaterial();
  var cubeMaterial = new THREE.MeshBasicMaterial();

  var cube = new THREE.Mesh(new THREE.CubeGeometry(50, 50, 50), cubeMaterial);

  cube.material.color.setHex( 0xabcdef );
  cube.overdraw = true;
  return cube;
}


//Draw a colourful Sphere boid!
function initColourfulSphere() {
  var sphereMaterial = new THREE.MeshNormalMaterial();

  var sphere = new THREE.Mesh(new THREE.SphereGeometry(25, 5, 5), sphereMaterial);
  sphere.overdraw = true;
  return sphere;
};

//This groups together everything that makes the Boids flock
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


