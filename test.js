var scene,renderer,camera,controls;
var cntrlPos,cntrlPoint
var point,pos,line;
const N=20;
var cnt=0;
var dcnt=0;
const DN=5
var ord3;
$(function(){
ord3=$("#ord3").prop('checked');

scene = new THREE.Scene();
var canvas=document.querySelector('#myCanvas');
renderer = new THREE.WebGLRenderer({canvas:canvas});
camera = new THREE.PerspectiveCamera( 90, canvas.width / canvas.height, 0.1, 1000 );
camera.position.set(0,0,-1);
camera.lookAt(0,0,0)
controls = new THREE.OrbitControls(camera,canvas);

var axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

//cntrlPoint
cntrlPos = [
	new THREE.Vector3(1,0,0),
	new THREE.Vector3(1,0.5528,0),
	new THREE.Vector3(0.5528,1,0),
	new THREE.Vector3(0,1.0)
];
var col =[0xffff00,0xff00ff,0x00ffff,0xff0000];
var cpGeometry = new THREE.SphereGeometry( 0.05, 16 ,8 );
cntrlPoint= [];
for(var key in cntrlPos){
	cntrlPoint[key] = new THREE.Mesh(cpGeometry,new THREE.MeshBasicMaterial({color:col[key]}));
	cntrlPoint[key].name="cntrl"+key
	scene.add(cntrlPoint[key]);
	cntrlPoint[key].position.copy(cntrlPos[key]);
}

//movingPoint
var pGeometry = new THREE.SphereGeometry( 0.01, 16 ,8 );
point=[];
for(var i=0;i<6;i++) point.push(new THREE.Mesh(cpGeometry,new THREE.MeshBasicMaterial({color:0x808080})))
for(var key in point) scene.add(point[key]);
pos=[new Array(N+1),new Array(N+1),new Array(N+1),new Array(N+1),new Array(N+1),new Array(N+1)];
//制御点からの計算処理（初回と移動時に呼び込む)
function calcPos(){
	for(var key in cntrlPos){
		var pin=$(".po").eq(key);
		pin.find(".x").val(cntrlPos[key].x)
		pin.find(".y").val(cntrlPos[key].y)
		pin.find(".z").val(cntrlPos[key].z)
	}
	for(var i=0;i<N+1;i++){
		var t=i/N;
		pos[0][i]=new THREE.Vector3();
		pos[0][i].addVectors ( cntrlPos[0].clone().multiplyScalar ( 1-t ),cntrlPos[1].clone().multiplyScalar ( t ) );
		pos[1][i]=new THREE.Vector3();
		pos[1][i].addVectors ( cntrlPos[1].clone().multiplyScalar ( 1-t ),cntrlPos[2].clone().multiplyScalar ( t ) );
		pos[2][i]=new THREE.Vector3();
		pos[2][i].addVectors ( cntrlPos[2].clone().multiplyScalar ( 1-t ),cntrlPos[3].clone().multiplyScalar ( t ) );

		pos[3][i]=new THREE.Vector3();
		pos[3][i].addVectors ( pos[0][i].clone().multiplyScalar ( 1-t ),pos[1][i].clone().multiplyScalar ( t ) );
		pos[4][i]=new THREE.Vector3();
		pos[4][i].addVectors ( pos[1][i].clone().multiplyScalar ( 1-t ),pos[2][i].clone().multiplyScalar ( t ) );
		pos[5][i]=new THREE.Vector3();
		pos[5][i].addVectors ( pos[3][i].clone().multiplyScalar ( 1-t ),pos[4][i].clone().multiplyScalar ( t ) );
	}
	for(var key in lineGeometry){

			positions[key]=new Float32Array((N+1) * 3);
			lineGeometry[key].addAttribute('position', new THREE.BufferAttribute(positions[key], 3));
			var array = lineGeometry[key].attributes.position.array;
			for(var i in pos[key]){
				array[i*3]=pos[key][i].x;
				array[i*3+1]=pos[key][i].y;
				array[i*3+2]=pos[key][i].z;
			}

	}
}
//line
var lineGeometry = []
for(var i=0;i<6;i++)lineGeometry.push(new THREE.BufferGeometry());
var lineCol=[0x404040,0xA0A0A0,0xFFFFFF]//直線、2次Bezie、3次Bezie
var lMaterial =[];
for(var i=0;i<3;i++) lMaterial.push(new THREE.LineBasicMaterial({color:lineCol[0]}))	//直線
for(var i=0;i<2;i++) lMaterial.push(new THREE.LineBasicMaterial({ color:lineCol[1]}))	//2次Bezie
lMaterial.push(new THREE.LineBasicMaterial({ color:lineCol[2]}))						//3次Bezie
var positions =new Array(6);
line = new Array(6);
calcPos();
for(var key in lineGeometry){
	line[key] = new THREE.Line(lineGeometry[key], lMaterial[key]);
	scene.add(line[key]);
}
//制御点移動CUIここから
$(document).on("change",".x",function(e){
	var k=$(".x").index($(this));
	cntrlPos[k].x=$(this).val();
	cntrlPoint[k].position.copy(cntrlPos[k]);
	calcPos();
})
$(document).on("change",".y",function(e){
	var k=$(".y").index($(this));
	cntrlPos[k].y=$(this).val();
	cntrlPoint[k].position.copy(cntrlPos[k]);
	calcPos();
})
$(document).on("change",".z",function(e){
	var k=$(".z").index($(this));
	cntrlPos[k].z=$(this).val();
	cntrlPoint[k].position.copy(cntrlPos[k]);
	calcPos();
})
//制御点移動CUIここまで
//制御点移動GUI（ここから
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2()
var intersection = new THREE.Vector3();
var draggedObj,mouseoveredObj;
var offset = new THREE.Vector3();
var plane = new THREE.Plane();
$(document).on("mousedown",'canvas',function(e){
	e.preventDefault();
	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObjects( cntrlPoint );
	if ( intersects.length > 0 ) {
		controls.enabled=false;
		draggedObj=intersects[0].object;
		if ( raycaster.ray.intersectPlane( plane, intersection ) ) offset.copy(intersection ).sub(draggedObj.position );
	}
})
$(document).on("mousemove",'canvas',function(e){
	e.preventDefault();
	mouse.x = ( e.offsetX / canvas.width ) * 2 - 1;
	mouse.y = - ( e.offsetY / canvas.height ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );
	if ( draggedObj ) {
		if ( raycaster.ray.intersectPlane( plane, intersection ) ) draggedObj.position.copy( intersection.sub( offset ) );
	}else{
		var intersects = raycaster.intersectObjects( cntrlPoint );
		if ( intersects.length > 0 ) {
			if ( mouseoveredObj != intersects[ 0 ].object ) {
				mouseoveredObj = intersects[ 0 ].object;
				camera.getWorldDirection( plane.normal );
			}
		}else{
			mouseoveredObj =null;
		}	
	}
})
$(document).on("mouseup",'canvas',function(e){
	e.preventDefault();
	if(mouseoveredObj){
		if(draggedObj){
			var kNo=Number(draggedObj.name.charAt(5));
			cntrlPos[kNo].copy(mouseoveredObj.position);
			calcPos();
		}
		draggedObj=null;
	}
	controls.enabled=true;
})
//制御点移動（ここまで
$(document).on("click",'#ord3',function(e){
	ord3=$("#ord3").prop("checked");
	calcPos();
	if(ord3){
		$(".po").eq(3).find("td input").prop("disabled",false);
		cntrlPoint[3].visible=true;
		point[2].visible=true;
		point[4].visible=true;
		point[5].visible=true;
		line[2].visible=true;
		line[4].visible=true;
		line[5].visible=true;
	}else{
		$(".po").eq(3).find("td input").prop("disabled",true);
		cntrlPoint[3].visible=false;
		point[2].visible=false;
		point[4].visible=false;
		point[5].visible=false;
		line[2].visible=false;
		line[4].visible=false;
		line[5].visible=false;
	}
})

animate();
})
function animate() {
	if(controls.enabled){
		if(cnt>N)cnt=0;
		for(var key in point){
			point[key].position.copy(pos[key][cnt])
			line[key].geometry.setDrawRange(0, cnt+1);
		}
		if(dcnt==DN){
			cnt++;
			dcnt=0;
		}else{
			dcnt++;
		}
	}
	requestAnimationFrame( animate );
	controls.update();
	renderer.render( scene, camera );
}