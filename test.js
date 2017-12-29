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
	new THREE.Vector3(2,0,1)
];
var col =[0xffff00,0xff00ff,0x00ffff];

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
var point=[
	new THREE.Points(edgeGeometry,new THREE.PointsMaterial({color:0x808080,size:0.1,vertexColors:true})),
	new THREE.Points(edgeGeometry,new THREE.PointsMaterial({color:0x808080,size:0.1,vertexColors:true})),
	new THREE.Points(edgeGeometry,new THREE.PointsMaterial({color:0x808080,size:0.1,vertexColors:true}))
];
for(var key in point) scene.add(point[key]);

point[0].position.copy(edgePos[0]);
point[1].position.copy(edgePos[1]);
point[2].position.copy(edgePos[0]);
const N=10;
var pos=[new Array(N+1),new Array(N+1),new Array(N+1)];
for(var i=0;i<N+1;i++){
	var t=i/N;
	pos[0][i]=new THREE.Vector3();
	pos[0][i].addVectors ( edgePos[0].clone().multiplyScalar ( 1-t ),edgePos[1].clone().multiplyScalar ( t ) );
	pos[1][i]=new THREE.Vector3();
	pos[1][i].addVectors ( edgePos[1].clone().multiplyScalar ( 1-t ),edgePos[2].clone().multiplyScalar ( t ) );
	pos[2][i]=new THREE.Vector3();
	pos[2][i].addVectors ( pos[0][i].clone().multiplyScalar ( 1-t ),pos[1][i].clone().multiplyScalar ( t ) );
}

//line
var lineGeometry = [
new THREE.BufferGeometry(),
new THREE.BufferGeometry(),
new THREE.BufferGeometry()
]
var lMaterial =[
	new THREE.LineBasicMaterial({ color: 0x990000, linewidth : 1}),
	new THREE.LineBasicMaterial({ color: 0x990000, linewidth : 1}),
	new THREE.LineBasicMaterial({ color: 0x999900, linewidth : 1})
]
var positions =new Array(3);
var line = new Array(3);
for(var key in lineGeometry){
	positions[key]=new Float32Array((N+1) * 3);
	lineGeometry[key].addAttribute('position', new THREE.BufferAttribute(positions[key], 3));
	var array = lineGeometry[key].attributes.position.array;
	for(var i in pos[key]){
		array[i*3]=pos[key][i].x;
		array[i*3+1]=pos[key][i].y;
		array[i*3+2]=pos[key][i].z;
	}
	line[key] = new THREE.Line(lineGeometry[key], lMaterial[key]);
	scene.add(line[key]);
}

var cnt=0;
var dcnt=0;
const DN=10
function animate() {
	if(cnt>N)cnt=0;
	for(var key in point){
		point[key].position.copy(pos[key][cnt])
		line[key].geometry.setDrawRange(0, cnt+1);
	}
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	if(dcnt==DN){
		cnt++;
		dcnt=0;
	}else{
		dcnt++;
	}
}
animate();