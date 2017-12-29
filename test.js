var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var	controls = new THREE.OrbitControls(camera);
camera.position.z = 5;
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

//edge
var edgePos = [
	new THREE.Vector3(1,1,1),
	new THREE.Vector3(2,1,2),
];
var col =[0xffff00,0xff00ff];

var edgeGeometry = new THREE.Geometry();
edgeGeometry.vertices[0] = new THREE.Vector3(0,0,0);
edgeGeometry.colors[0] = new THREE.Color(0xffffff);

var edgePoint= new Array();
for(var key in edgePos){
	edgePoint[key] = new THREE.Points(edgeGeometry,new THREE.PointsMaterial({color:col[key],size:0.1,vertexColors:true}));
	scene.add(edgePoint[key]);
	edgePoint[key].position.copy(edgePos[key]);
}

//movongPoint
var point=new THREE.Points(edgeGeometry,new THREE.PointsMaterial({color:0x808080,size:0.1,vertexColors:true}));
scene.add(point);
point.position.copy(edgePos[0]);
var pos=new Array(10);
const N=10;
for(var i=0;i<10;i++){
	var t=i/N;
	pos[i]=new THREE.Vector3();
	pos[i].addVectors ( edgePos[0].clone().multiplyScalar ( 1-t ),edgePos[1].clone().multiplyScalar ( t ) );
}

var cnt=0;
function animate() {
	if(cnt==10)cnt=0;
	point.position.copy(pos[cnt])
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	cnt++;	
}
animate();