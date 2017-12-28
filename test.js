var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var	controls = new THREE.OrbitControls(camera);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var materials = new Array();
//var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
materials.push(new THREE.MeshBasicMaterial( { color: 0xff0000 } ));
materials.push(new THREE.MeshBasicMaterial( { color: 0xffff00 } ));
materials.push(new THREE.MeshBasicMaterial( { color: 0xff00ff } ));
materials.push(new THREE.MeshBasicMaterial( { color: 0x00ffff } ));
materials.push(new THREE.MeshBasicMaterial( { color: 0x00ff00 } ));
materials.push(new THREE.MeshBasicMaterial( { color: 0x0000ff } ));
var cube = new THREE.Mesh( geometry, materials );
scene.add( cube );

camera.position.z = 5;

function animate() {
	cube.rotation.x+=0.05;
	cube.rotation.y+=0.1;
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();