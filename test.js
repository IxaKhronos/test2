var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var	controls = new THREE.OrbitControls(camera);
camera.position.z = 5;
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
var pos = [
	new THREE.Vector3(1,1,1),
	new THREE.Vector3(2,1,2),
	new THREE.Vector3(0,0,2)
];

var col =[0xffff00,0xff00ff,0x808080];

var geometry = new THREE.Geometry();
geometry.vertices[0] = new THREE.Vector3(0,0,0);
geometry.colors[0] = new THREE.Color(0xffffff);

var point= new Array();
for(var key in pos){
	point[key] = new THREE.Points(geometry,new THREE.PointsMaterial({color:col[key],size:0.1,vertexColors:true}));
	scene.add(point[key]);
	point[key].position.copy(pos[key]);
}
var t=0;
function animate() {
	if(t>1)t=0;
	pos[2].addVectors ( pos[0].clone().multiplyScalar ( 1-t ),pos[1].clone().multiplyScalar ( t ) );
	point[2].position.copy(pos[2])
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	t += 0.1;

	
}
animate();