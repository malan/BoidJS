var scene, camera, renderer;
var geometry, material, mesh;

var NUM_BOIDS = 30;

WORLD_RADIUS = window.innerHeight/1.4;

boids = [];

init();
animate();

function randomVector() {
  v = new THREE.Vector3(Math.random()*1-0.5,Math.random()*1-0.5,Math.random()*1-0.5);
  return v.normalize()
}

function init() {

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 1000;


  for(i=0;i<NUM_BOIDS;i++) {
    boid = new Boid();
    boids.push(boid);
    scene.add( boid.mesh );
    boid.position;
  }

  renderer = new THREE.CanvasRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  document.body.appendChild( renderer.domElement );

}

function animate() {
  requestAnimationFrame( animate );

  for(i=0;i<boids.length;i++) {
    animateBoid(boids[i]);
  }

  renderer.render( scene, camera );
}
