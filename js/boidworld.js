var scene, camera, renderer;
var geometry, material, mesh;

//How many boids to create
var NUM_BOIDS = 30;

//How big is the (spherical) world the boids live in?
WORLD_RADIUS = window.innerHeight/1.4;

boids = [];

init();
animate();

//This creates a random 3D direction - used in other functions
function randomVector() {
  v = new THREE.Vector3(Math.random()*1-0.5,Math.random()*1-0.5,Math.random()*1-0.5);
  return v.normalize()
}

//This is called when the web page loads
function init() {

  //Setup the 3D boid world
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 1000;

  //Add a single normal boid
  boid = new Boid();
  boids.push(boid);
  scene.add( boid.mesh );
  boid.position;

  //Add a bunch of colourful boids
  for(i=0;i<NUM_BOIDS;i++) {
    boid = new ColourfulBoid();
    boids.push(boid);
    scene.add( boid.mesh );
    boid.position;
  }

  //Start drawing the world
  renderer = new THREE.CanvasRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  document.body.appendChild( renderer.domElement );

}

//This is called all the time, to refresh the screen and move the boids along
function animate() {
  requestAnimationFrame( animate );

  for(i=0;i<boids.length;i++) {
    animateBoid(boids[i]);
  }

  renderer.render( scene, camera );
}
