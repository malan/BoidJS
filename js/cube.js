var scene, camera, renderer;
var geometry, material, mesh;

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

  this.boids = [];
  direction = randomVector();

  for(i=0;i<25;i++) {
    boid = new Boid(this.boids);
    this.boids.push(boid);
    scene.add( boid.mesh );
  }


  renderer = new THREE.CanvasRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  document.body.appendChild( renderer.domElement );

}

function animate() {

  // note: three.js includes requestAnimationFrame shim
  requestAnimationFrame( animate );


  direction.add(randomVector());

  for(i=0;i<boids.length;i++) {
    boids[i].animate();
  }


  renderer.render( scene, camera );
}
