var container = document.body;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 5000 );
camera.position.set( 400, 200, 0 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
//document.body.appendChild( renderer.domElement );
container.appendChild( renderer.domElement );

controls = new THREE.OrbitControls( camera, renderer.domElement );
//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 100;
controls.maxDistance = 500;
controls.maxPolarAngle = Math.PI / 2;

// controls = new THREE.TrackballControls( camera, renderer.domElement );
//   controls.rotateSpeed = 1.0;
//   controls.zoomSpeed = 1.2;
//   controls.panSpeed = 0.8;
//   controls.noZoom = false;
//   controls.noPan = false;
//   controls.staticMoving = true;
//   controls.dynamicDampingFactor = 0.3;

window.addEventListener("resize", function(){
  renderer.setSize( window.innerWidth, window.innerHeight );
  camera.aspect	= window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
camera.position.z = 8;

// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
// var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe:true } );
// var cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

var skyboxGeometry = new THREE.SphereBufferGeometry( 1000, 64, 64 );
skyboxGeometry.scale( - 1, 1, 1 );
var skyboxTexture = new THREE.TextureLoader().load( 'assets/images/locations/phoenix/360/phoenix_01.jpg' );
var skyboxMaterial = new THREE.MeshBasicMaterial( { map: skyboxTexture } );
var skyboxMesh = new THREE.Mesh( skyboxGeometry, skyboxMaterial );
scene.add( skyboxMesh );

// scene.add( new THREE.AmbientLight( 0xffffff, 2 ) );
// var pointLight = new THREE.PointLight( 0xffffff, 2 );
// pointLight.position.copy( camera.position );
// scene.add( pointLight );

// var stats = new Stats();
// container.appendChild( stats.dom );

// var loader = new THREE.FontLoader();
//
// loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
//   var geometry = new THREE.PlaneGeometry( 6, 4, 1 );
//   var material = new THREE.MeshBasicMaterial( {color: 0x666666, side: THREE.DoubleSide, opacity: 0.75, transparent: true} );
//   var plane = new THREE.Mesh( geometry, material );
//   plane.position.set(0,0,4);
//   scene.add( plane );
//
//   var textGeometry = new THREE.TextGeometry( 'Press button to start!', {
//     font: font,
//       size: 16,
//       height: 4,
//       curveSegments: 24
//       // bevelEnabled: false,
//       // bevelThickness: 1,
//       // bevelSize: 1,
//       // bevelOffset: 0,
//       // bevelSegments: 1
//   } );
//
//   var textMaterials = new THREE.MeshBasicMaterial({color:0xffffff});
//
//   var textMesh = new THREE.Mesh( textGeometry, textMaterials );
//   console.log(textGeometry);
//   console.log(textMesh);
//   textMesh.position.set( -1, 0, 0 );
//   textMesh.scale.set(0.01,0.01,0.0001);
//   plane.add( textMesh );
// } );

var clock = new THREE.Clock();

var update = function(){


  var delta = clock.getDelta();
  // mixer.update( delta );
  controls.update( delta );

  // stats.update();
  // console.log(stats);
  // console.log(stats.fps);
}

var render = function(){
  renderer.render( scene, camera );
}

var appLoop = function() {
  requestAnimationFrame( appLoop );

  update();
  render();
}

if ( THREE.WEBGL.isWebGLAvailable() ) {
  appLoop();
} else {

  var warning = WEBGL.getWebGLErrorMessage();
  document.getElementById( 'three-container' ).appendChild( warning );
}

function setSkyboxTexture(src){
  skyboxMesh.material.map = new THREE.TextureLoader().load( src );
  skyboxMesh.material.needsUpdate = true;
}
