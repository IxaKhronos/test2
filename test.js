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
const N=10;
var pos=new Array(N+1);
for(var i=0;i<N+1;i++){
	var t=i/N;
	pos[i]=new THREE.Vector3();
	pos[i].addVectors ( edgePos[0].clone().multiplyScalar ( 1-t ),edgePos[1].clone().multiplyScalar ( t ) );
}
//line
var geometry = new THREE.BufferGeometry();
var positions = new Float32Array((N+1) * 3);
geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
var array = geometry.attributes.position.array;
for(var i in pos){
	console.log(i)
	array[i*3]=pos[i].x;
	array[i*3+1]=pos[i].y;
	array[i*3+2]=pos[i].z;
	console.log(array[i*3])
}
console.log(geometry)
//geometry.addGroup(0, 1, 0);
var lMaterial = new THREE.LineBasicMaterial({ color: 0x990000, linewidth : 1});
var line = new THREE.Line(geometry, lMaterial);
scene.add(line);

var cnt=0;
function animate() {
	if(cnt>N)cnt=0;
	point.position.copy(pos[cnt])
	line.geometry.setDrawRange(0, cnt);
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	cnt++;	
}
animate();