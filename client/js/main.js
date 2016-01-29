'use strict';

// var test = require("./test");

// variables globales
var camera, scene, renderer, cameraHelper;

var container, mixers = [];

var clock = new THREE.Clock();

var cube, tooth, object; 

var keyboard;

var edges_tooth, edges_tooth1, edges_tooth2, boxTooth;

var controls, ambient, stats, datGUI, line, raycaster, guiControls, mesh;

var spotlLight, ambientLight, light1, light2, pointLight, hemiLight;

var planeGeometry, planeMaterial, plane;

var grid, color;

var axis;

var manual_controls = false;

var figure, cylinder;

// Carga de la página
window.onload = load_page;

function load_page(){
    // funcion de inicio
    init();
	animate();
}

// Init function
function init(){
	// Container
	container = document.createElement('div');
	container.className = "container_tooth";
	container.id = "container_tooth";
	document.body.appendChild(container);
	
	// Camera
	camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(-1600, 600, 1200);
	
	cameraHelper = new THREE.CameraHelper( camera );
	
	// Scene
	scene = new THREE.Scene();
	
	scene.add(cameraHelper);
	
	// renderer
	renderer = new THREE.WebGLRenderer({ 
		antialias: true, 
		preserveDrawingBuffer: true
		// alpha: true
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor( 0xffffff );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.domElement.id = "canvas_3d"; // agrego un id al canvas que renderiza el diente
	renderer.shadowMapEnabled = true;
	// renderer.shadowMapSoft = true;
	container.appendChild(renderer.domElement);
	
	grid = new THREE.GridHelper(500,5);
	color = new THREE.Color("rgb(255,255,255");
	grid.setColors(color, 0xaaaaaa);
	grid.visible = false;
	
	scene.add(grid);
	
	// events
    THREEx.WindowResize(renderer, camera);
	
	var map = THREE.ImageUtils.loadTexture( 'textures/mapamundi.jpg' );
	// map.wrapS = map.wrapT = THREE.RepeatWrapping;
	map.anisotropy = 16;

	var material = new THREE.MeshLambertMaterial( { map: map, side: THREE.DoubleSide } );
	
	object = new THREE.Mesh( new THREE.SphereGeometry( 10,32,32), material );
	object.position.set( 30, 10, 0 );
	// object.material.wireframe = true
	// scene.add( object );
	
	var box = new THREE.BoxHelper( object );
	// scene.add( box );
	
	var edges = new THREE.EdgesHelper( object, 0xffffff );
	var edges1 = new THREE.FaceNormalsHelper( object, 2, 0x000000, 1 );
	var edges3 = new THREE.VertexNormalsHelper( object, 2, 0x00ff00, 1 );
	
	// scene.add( edges );
	// scene.add( edges1 );
	// scene.add( edges3 );
	
	// Axis Helper
	axis = new THREE.AxisHelper(30);
  	scene.add(axis);
  	
  	// PointLight
  	var luz = new THREE.PointLight(0xffffff);
  	luz.position.set(-100,200,100);
  	scene.add(luz);
  	
  	// AmbientLight
  	var luz_ambiente = new THREE.AmbientLight(0x000000);
  	scene.add(luz_ambiente);
  	
  	light1 = new THREE.DirectionalLight();
  	light1.position.set(500,500,-500);
  	light1.intensity = 0.09;
  	light1.castShadow = true;
  	light1.shadowCameraVisible = true;
  	light1.shadowCameraNear = 250;
  	light1.shadowCameraFar = 20000;
  	light1.shadowCameraLeft = -100;
  	light1.shadowCameraRight = 100;
  	light1.shadowCameraTop = -100;
  	light1.shadowCameraBottom = 100;
  	
  	scene.add(light1);
  	
  	var helper_light1 = new THREE.DirectionalLightHelper(light1, 100);
  	scene.add(helper_light1);
  	
	light2 = new THREE.DirectionalLight( 0xccccff, 1 );
	light2.position.set( -15, 4.85, 0.73 ).normalize();
	light2.intensity = 0.42;
	
	scene.add( light2 );
	
	var helper_light2 = new THREE.DirectionalLightHelper(light2, 100);
  	scene.add(helper_light2);
	
	pointLight = new THREE.PointLight( 0xffaa00, .2 );
	pointLight.position.set( 0, -200, 1220 );
	// scene.add( pointLight );

	hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
	hemiLight.color.setHSL( 0.6, 1, 0.6 );
	hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
	hemiLight.position.set( 0, 500, 0 );
	// scene.add( hemiLight );

	var geometry = new THREE.Geometry();
	geometry.vertices.push( new THREE.Vector3(), new THREE.Vector3() );

	line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { linewidth: 4 } ) );
	// scene.add( line );

	raycaster = new THREE.Raycaster();

	var mouseHelper = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 10 ), new THREE.MeshNormalMaterial() );
	mouseHelper.visible = false;
	// scene.add( mouseHelper );
	
	// Ambient light 
	ambientLight = new THREE.AmbientLight( 0x0c0c0c );
	// scene.add(ambientLight);
	
	// Other light
	spotlLight = new THREE.SpotLight( 0xffffff );
	spotlLight.position.set(-3000, 441, -1600);
	spotlLight.castShadow = true;
	spotlLight.intensity = 0.26;
	// scene.add(spotlLight);
	
	var spotLightHelper = new THREE.SpotLightHelper( spotlLight );
	// scene.add( spotLightHelper );
	
	var dir = new THREE.Vector3( 1, 0, 0 );
	var origin = new THREE.Vector3( 0, 0, 0 );
	var length = 1;
	var hex = 0xffff00;
	
	var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
	// scene.add( arrowHelper );
	
	// Load object
	var loader = new THREE.JSONLoader();
	loader.load('objects/tooth_molar.js', createScene);
	
	function createScene(object){
		
		var material = new THREE.MeshLambertMaterial( {
			color: 0xffffff,
			specular: 0x111111,
			map: THREE.ImageUtils.loadTexture( 'textures/map_n.jpg' ),
			normalMap: THREE.ImageUtils.loadTexture( 'textures/map_p.jpg' ),
			normalScale: new THREE.Vector2( 0.75, 0.75 ),
			shininess: 25
		} );
		
		mesh = new THREE.Mesh( object, material );
		
		edges_tooth = new THREE.EdgesHelper( mesh, 0xffffff );
		edges_tooth1 = new THREE.FaceNormalsHelper( mesh, 2, 0x000000, 1 );
		edges_tooth2 = new THREE.VertexNormalsHelper( mesh, 2, 0x00ff00, 1 );
		
		// mesh.add( edges_tooth );
		// mesh.add( edges_tooth1 );
		// mesh.add( edges_tooth2 );
		
		mesh.add( new THREE.LineSegments(

			new THREE.Geometry(),

			new THREE.LineBasicMaterial({
				color: 0xffffff,
				transparent: true,
				opacity: 0.5
			})

		));
		
		boxTooth = new THREE.BoxHelper( mesh );
		boxTooth.visible = false;
		mesh.add( boxTooth );
		
		mesh.scale.set( 2.5, 2.5, 2.5 );
		
		tooth = mesh;
		mesh.translateY(5);
		mesh.translateX(-8);
		mesh.castShadow = true;	
		// mesh.receiveShadow = true;
		
		scene.add( mesh );
	}
	
	// var Modelo3D=new THREE.JSONLoader();
	// Modelo3D.load("mario/layers260a.js",funcionAgregarModelo);
	
	// function funcionAgregarModelo(geometry,materials){
		
	// 	var imagen=new THREE.ImageUtils.loadTexture("mario/mario.jpg");
	// 	var material=new THREE.MeshLambertMaterial({map:imagen});
	// 	var ModeloFinal=new THREE.Mesh(geometry,material);
	// 	// scene.add(ModeloFinal);
		
	// 	ModeloFinal.scale.set(10,10,10);	
	// 	ModeloFinal.position.set(20,13,10);
	// 	ModeloFinal.rotation.y=Math.PI;
		
	// 	ModeloFinal.castShadow = true;
	// }
	
	// var Modelo3D2=new THREE.JSONLoader();
	// Modelo3D2.load("mario/naruto_2.js",funcionAgregarModelo2);
	
	// function funcionAgregarModelo2(geometry,materials){
		
	// 	var imagen=new THREE.ImageUtils.loadTexture("mario/naruto_uv.jpg");
	// 	var material=new THREE.MeshLambertMaterial({map:imagen});
	// 	var ModeloFinal=new THREE.Mesh(geometry,material);
	// 	// scene.add(ModeloFinal);
		
	// 	ModeloFinal.scale.set(10,10,10);	
	// 	ModeloFinal.position.set(10,13,10);
	// 	ModeloFinal.rotation.y=Math.PI;
		
	// 	ModeloFinal.castShadow = true;
	// }
	
	// var Modelo3D3=new THREE.JSONLoader();
	// Modelo3D3.load("objects/tooth_molar.js",funcionAgregarModelo3);
	
	// function funcionAgregarModelo3(geometry,materials){
		
	// 	// var imagen=new THREE.ImageUtils.loadTexture("mario/naruto_uv.jpg");
	// 	var material=new THREE.MeshLambertMaterial({});
	// 	var ModeloFinal=new THREE.Mesh(geometry,material);
	// 	// scene.add(ModeloFinal);
		
	// 	ModeloFinal.scale.set(5,5,5);	
	// 	ModeloFinal.position.set(10,30,10);
	// 	ModeloFinal.rotation.y=Math.PI;
		
	// 	ModeloFinal.castShadow = true;
	// 	ModeloFinal.material.wireframe = true;
	// }
	
	var p = new THREE.Object3D()
	
	p.add( new THREE.LineSegments(

		new THREE.Geometry(),

		new THREE.LineBasicMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 0.5
		})

	));

	p.add( new THREE.Mesh(

		new THREE.Geometry(),

		new THREE.MeshPhongMaterial({
			color: 0x156289,
			emissive: 0x072534,
			side: THREE.DoubleSide,
			shading: THREE.FlatShading
		})

	));
	
	var geo = new THREE.Geometry();
	
	var vertices = [
		[2,7,0],[7,2,0],[12,7,0],[12,17,0],[7,12,0],[2,17,0],[2,7,0],//[2,7,2],[2,17,2]
	];
	
	var long_vertices = vertices.length;
	var array = [];
	
	for(var i = 0; i < long_vertices; i++){
		var x = vertices[i][0];
		var y = vertices[i][1];
		var z = vertices[i][2];
		
		var vector = new THREE.Vector3(x,y,z);
		
		geo.vertices.push(vector);
		array.push(vector);
		
	}
	//CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, thetaStart, thetaLength)
	
	var textureCylinder = new THREE.ImageUtils.loadTexture("textures/barril.jpg");
	textureCylinder.wrapS = textureCylinder.wrapT = THREE.RepeatWrapping;
    textureCylinder.repeat.set(1,1);
	
	// cilindro
	var geometry = new THREE.CylinderGeometry( 10.9, 10.9, 30, 64,64,false,6,6.3 );
	var material = new THREE.MeshBasicMaterial( {
		color: 0x323232, 
		wireframe: false,
		map: textureCylinder,
		emissive: 0x072534,
		side: THREE.DoubleSide,
		shading: THREE.FlatShading
	} );
	cylinder = new THREE.Mesh( geometry, material );
	
	cylinder.translateX(-50);
	cylinder.translateY(10);
	cylinder.castShadow = true;
	cylinder.receiveShadow = true;
	
	// scene.add( cylinder );
	
	var form_figure = new THREE.Shape(array);
	
	var data_extrude = {
		amount: 10,
		bevelEnabled: false,
		bevelSegment: 1,
		steps: 5,
		bevelThickness: 1
	}
	
	var extrude_geometry = new THREE.ExtrudeGeometry(form_figure, data_extrude);
	
	var mat = new THREE.ParticleBasicMaterial({color: 0xffff00});
	
	var mat_malla = new THREE.MeshBasicMaterial({
		// wireframe: true
	}); 
	var malla_extrude = new THREE.Mesh(extrude_geometry,mat_malla);
	
	figure = new THREE.Line(geo, mat);
	
	// scene.add(malla_extrude);
	// scene.add(figure);
	
	// create the ground plane
    planeGeometry = new THREE.PlaneGeometry(10000, 10000, 10, 10);
    var texturePlane = new THREE.ImageUtils.loadTexture("textures/checkerboard.jpg");
    texturePlane.wrapS = texturePlane.wrapT = THREE.RepeatWrapping;
    texturePlane.repeat.set(100,100);
    planeMaterial = new THREE.MeshBasicMaterial({
    	map: texturePlane,
    	side: THREE.DoubleSide,
    	// color: 0xffffff
    });
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.castShadow = true;
    plane.visible = true;

    // rotate and position the plane
    plane.rotation.x = -0.5*Math.PI;
    plane.position.y = 0;
    plane.position.z = 0;

    // add the plane to the scene
    scene.add(plane);
	
	/* datGui controls object */
	guiControls = new function(){
		// gui rotation movement
		this.rotationX = 0.00;
		this.rotationY = 0.005;
		this.rotationZ = 0.00;
		
		// gui rotation only
		this.rotationAxisX = 0;
		this.rotationAxisY = 0;
		this.rotationAxisZ = 0;
		
		// gui position tooth
		this.positionX = 0;
		this.positionY = 5;
		this.positionZ = 0;
		
		// positions light back
		this.positionLightBackX = 500;
		this.positionLightBackY = 500;
		this.positionLightBackZ = -500;
		this.intensityLightBack = 0.7;
		
		// positions light front
		this.positionLightFrontX = 0.74;
		this.positionLightFrontY = 0.55;
		this.positionLightFrontZ = 0.37;
		this.intensityLightFront = 0.3;
		
		// position point light
		this.positionLightPointX = 0;
		this.positionLightPointY = 0;
		this.positionLightPointZ = 0;
		this.intensityLightPoint = 0.2;
		
		// position pont light
		this.positionLightSpotX = -3000;
		this.positionLightSpotY = 441;
		this.positionLightSpotZ = -1600;
		this.intensityLightSpot = 0.26;
		
		// position camara
		this.positionCameraX = 40;
		this.positionCameraY = 40;
		this.positionCameraZ = 40;
		this.controlsCamera = false;
		
		// tooth
		this.color = 0x000000;
		this.form = 0;
		this.castShadow = true;
		this.wireframe = false;
		this.visible = true;
		this.boxHelper = false;
		this.scaleTooth = 2.5;
		
		// plane
		this.visible_plane = false;
		
		// grid
		this.visible_grid = false;
		this.receive = true;
		
		// Axis
		this.visible_axis = true;
		
		// Mesh or line
		this.lineshape = true;
	}
	
	// dai gui settings
	datGUI = new dat.GUI();
	// datGUI.domElement.style.position = "absolute";
	// datGUI.domElement.style.top = "0";
	// datGUI.domElement.style.right = "0";
	// container.appendChild( datGUI.domElement );
	
	var materialFolder = datGUI.addFolder('Tooth Options');
	var rotFolder = datGUI.addFolder('Rotation Options');
	var posFolder = datGUI.addFolder('Position Options');
	var renderFolder = datGUI.addFolder('Render Options');
	var planeFolder = datGUI.addFolder('Plane Options');
	var gridFolder = datGUI.addFolder('Grid Options');
	var lightBackFolder = datGUI.addFolder('Light Back Options');
	var lightFrontFolder = datGUI.addFolder('Light Front Options');
	var lightPointFolder = datGUI.addFolder('Light Point Options');
	var lightSpotFolder = datGUI.addFolder('Light Spot Options');
	var cameraFolder = datGUI.addFolder('Camera Options');
	var axisFolder = datGUI.addFolder('Axis Options');
	
	// materialFolder.open();
	
	rotFolder.add(guiControls, 'rotationX', 0,0.5);
	rotFolder.add(guiControls, 'rotationY', 0,0.5);
	rotFolder.add(guiControls, 'rotationZ', 0,0.5);
	
	rotFolder.add(guiControls, 'rotationAxisX', 0,7);
	rotFolder.add(guiControls, 'rotationAxisY', 0,7);
	rotFolder.add(guiControls, 'rotationAxisZ', 0,7);
	
	lightBackFolder.add(guiControls, 'positionLightBackX', -700,700).name('Posicion X');
	lightBackFolder.add(guiControls, 'positionLightBackY', -700,700).name('Posicion Y');
	lightBackFolder.add(guiControls, 'positionLightBackZ', -700,700).name('Posicion Z');
	lightBackFolder.add(guiControls, 'intensityLightBack', 0,2).name('Intensidad');
	
	lightFrontFolder.add(guiControls, 'positionLightFrontX', -700,700).name('Posicion X');
	lightFrontFolder.add(guiControls, 'positionLightFrontY', -700,700).name('Posicion Y');
	lightFrontFolder.add(guiControls, 'positionLightFrontZ', -700,700).name('Posicion Z');
	lightFrontFolder.add(guiControls, 'intensityLightFront', 0,2).name('Intensidad');
	
	lightPointFolder.add(guiControls, 'positionLightPointX', -3000,3000);
	lightPointFolder.add(guiControls, 'positionLightPointY', -3000,3000);
	lightPointFolder.add(guiControls, 'positionLightPointZ', -2000,2000);
	lightPointFolder.add(guiControls, 'intensityLightPoint', 0,2);
	
	lightSpotFolder.add(guiControls, 'positionLightSpotX', -3000,3000);
	lightSpotFolder.add(guiControls, 'positionLightSpotY', -3000,3000);
	lightSpotFolder.add(guiControls, 'positionLightSpotZ', -2000,2000);
	lightSpotFolder.add(guiControls, 'intensityLightSpot', 0,2);
	
	cameraFolder.add(guiControls, 'positionCameraX', -100,100);
	cameraFolder.add(guiControls, 'positionCameraY', -100,100);
	cameraFolder.add(guiControls, 'positionCameraZ', -100,100);
	cameraFolder.add(guiControls, 'controlsCamera').name('Controles Manuales').onChange(function(value){
		if(value) manual_controls = true;
		else manual_controls = false;
	});
	
	posFolder.add(guiControls, 'positionX', -100,100);
	posFolder.add(guiControls, 'positionY', 0,30);
	posFolder.add(guiControls, 'positionZ', -100,100);
	
	materialFolder.addColor(guiControls, 'color').onChange(function(value){
		tooth.material.color.setHex(value);
		tooth.material.color.setHex(value);
	});
	
	materialFolder.add(guiControls, 'scaleTooth', 1,5).name('Tamaño');
	
	materialFolder.add(guiControls, 'wireframe').name('Malla').onChange(function(value){
		if(value) tooth.material.wireframe = true;
		else tooth.material.wireframe = false;
	});
	
	materialFolder.add(guiControls, 'boxHelper').name('Caja').onChange(function(value){
		if(value) tooth.children[0].visible = true;
		else tooth.children[0].visible = false;
	});
	
	materialFolder.add(guiControls, 'visible').name('Visible').onChange(function(value){
		if(!value) tooth.visible = false;
		else tooth.visible = true;
	});
	
	materialFolder.add(guiControls, 'castShadow').name('Sombra').onChange(function(value){
		if(!value) tooth.castShadow = false;
		else tooth.castShadow = true;
	});
	
	renderFolder.addColor(guiControls, 'color').name('Color Escena').onChange(function(value){
		renderer.setClearColor(value);
	});
	
	planeFolder.addColor(guiControls, 'color').name('Color Plano').onChange(function(value){
		planeMaterial.color.setHex(value);
	});
	
	planeFolder.add(guiControls, 'visible_plane').name('Visible').onChange(function(value){
		if(!value) plane.visible = false;
		else plane.visible = true;
	});
	
	planeFolder.add(guiControls, 'receive').name('Recibir Sombra').onChange(function(value){
		if(value) plane.receiveShadow = false;
		else plane.receiveShadow = true;
	});
	
	gridFolder.addColor(guiControls, 'color').name('Color Plano').onChange(function(value){
		grid.setColors(new THREE.Color("#000000"), value);
	});
	
	gridFolder.add(guiControls, 'visible_grid').name('Visible').onChange(function(value){
		if(value) grid.visible = true;
		else grid.visible = false;
	});
	
	axisFolder.add(guiControls, 'visible_axis').name('Visible').onChange(function(value){
		if(!value) axis.visible = false;
		else axis.visible = true;
	});
	
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.minDistance = 10;
	controls.maxDistance = 1000;
	controls.addEventListener('change', render);
	
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );
	
	var r = "textures/";
	var urls = [ r + "posx.jpg", r + "negx.jpg",
				 r + "posy.jpg", r + "negy.jpg",
				 r + "posz.jpg", r + "negz.jpg" ];

	var textureCube = THREE.ImageUtils.loadTextureCube( urls );
	
	var shader = THREE.ShaderLib[ "cube" ];
	// console.table(shader);
	
	shader.uniforms[ "tCube" ].value = textureCube;

	var material = new THREE.ShaderMaterial( {
		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: shader.uniforms,
		side: THREE.BackSide
	} );
	
	var geometry = new THREE.BoxGeometry( 15,15, 15 );
	var material = new THREE.MeshLambertMaterial( { color: 0x000000, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 1 } );
	cube = new THREE.Mesh( geometry, material );
	cube.position.set(2.5, 2.5, 2.5);
	cube.castShadow = true;
	// scene.add( cube );
	
	// Camera look at
	camera.lookAt( scene.position );
	
	keyboard = new THREEx.KeyboardState();
}

function animate(){
	requestAnimationFrame( animate );
	render();
	stats.update();
	
	var time = 0.01;
	var distance = 100;
	var way = distance * time;
	
	// control camera with keyboard
	if(keyboard.pressed('w')) camera.position.z -= way;
	if(keyboard.pressed('s')) camera.position.z += way;
	if(keyboard.pressed('a')) camera.position.x -= way;
	if(keyboard.pressed('d')) camera.position.x += way;
	if(keyboard.pressed('q')) camera.position.y += way;
	if(keyboard.pressed('e')) camera.position.y -= way;
}

// funtion to render object
function render(){
	
	var delta = clock.getDelta();

	
	try{
		
		tooth.rotation.x = guiControls.rotationAxisX;
	    tooth.rotation.y = guiControls.rotationAxisY;
	    tooth.rotation.z = guiControls.rotationAxisZ;
		
		tooth.rotation.x += guiControls.rotationX;
	    tooth.rotation.y += guiControls.rotationY;
	    tooth.rotation.z += guiControls.rotationZ;
	    
	    tooth.position.x = guiControls.positionX;
	    tooth.position.y = guiControls.positionY;
	    tooth.position.z = guiControls.positionZ;
	    
	    tooth.scale.x = guiControls.scaleTooth;
	    tooth.scale.y = guiControls.scaleTooth;
	    tooth.scale.z = guiControls.scaleTooth;
	    
	    light1.position.x = guiControls.positionLightBackX;
	    light1.position.y = guiControls.positionLightBackY;
	    light1.position.z = guiControls.positionLightBackZ;
	    light1.intensity = guiControls.intensityLightBack;
	    
	    light2.position.x = guiControls.positionLightFrontX;
	    light2.position.y = guiControls.positionLightFrontY;
	    light2.position.z = guiControls.positionLightFrontZ;
	    light2.intensity = guiControls.intensityLightFront;
	    
	    pointLight.position.x = guiControls.positionLightPointX;
	    pointLight.position.y = guiControls.positionLightPointY;
	    pointLight.position.z = guiControls.positionLightPointZ;
	    pointLight.intensity = guiControls.intensityLightPoint;
	    
	    spotlLight.position.x = guiControls.positionLightSpotX;
	    spotlLight.position.y = guiControls.positionLightSpotY;
	    spotlLight.position.z = guiControls.positionLightSpotZ;
	    spotlLight.intensity = guiControls.intensityLightSpot;
	    
	    if(manual_controls){
		    camera.position.y = guiControls.positionCameraY;
		    camera.position.z = guiControls.positionCameraZ;
		    camera.position.x = guiControls.positionCameraX;
	    }
	    
	}catch(e){}
	
	controls.update();
	
	renderer.render(scene, camera);
	
	function get_image_canvas(){
		window.open(renderer.domElement.toDataURL('image/png'), 'test');
	}
}