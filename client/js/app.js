'use strict';

/* 
*
* Variable Principal para el 
* manejo de la aplicación
* Autor: Daniel M. Sánchez
* Github: https://github.com/dmsanchez86
*
*/

var App = {
    // Escena
    scene: null,
    
    // Camara
    camera: null,
    
    // Render
    renderer: null,
    
    // Contenedor
    container: null,
    
    // Controles de la camara
    controls: null,
    
    // Reloj
    clock: null,
    
    // Estadisticas del renderizado y consumo de memoria
    stats: null,
    
    // Variables Constantes
    const: {
      WINDOW_WIDTH: window.innerWidth,
      WINDOW_HEIGHT: window.innerHeight,
      PIXEL_RATIO: window.devicePixelRatio
    },
    
    // variable que me dice el actual diente que se renderiza
    current_tooth: null,
    
    // variable que me va a contener todos los materiales
    objects: {
        worldmap: null,
        plane: null,
        axis: null,
        bracket: null,
        ambientScene: null,
    },
    
    // variable que me contendra todos los dientes
    tooths: {
        canino: null,
        incisivo_central: null,
        incisivo_lateral: null,
        primer_molar: null,
        primer_premolar: null,
        segundo_molar: null,
        segundo_premolar: null,
        tercer_molar: null,
    },
    
    // variables de las caras de los dientes
    faces: {
        occlusal: null,
        buccal: null,
        lingual: null,
        mesial: null,
        distal: null,
    },
    
    // variable que me va a contener todas las luces que valla a aplicar
    lights: {
        ambient: null,
        point: null,
        pointSide: null,
        directional: null,
        spot: null,
        hemisphere: null
    },
    
    // variables que son usadas en los events de los helpers
    helpers: {
        edges: null,
        faceNormal: null,
        vertexNormal: null,
        camera: null,
        pointLight: null,
        directionalLight: null,
        spotLight: null,
    },
    
    // variables que me serviran de switches
    switches: {
        instanced_controls: false,
    },
    
    // variable que me guardara el cache
    cache: {
        current_faces: null,
    },
    
    // Inicializacion de todo el entorno
    init: function(){
        this.createContainer();
        this.createScene();
        this.createCamera();
        this.createRender();
        this.createAmbientScene();
        this.events.fullScreen();
        this.events.plane();
        this.events.worldmap();
        this.createAxis();
        this.createTooth('primer_molar');
        this.createLights();
    },
    
    // funcion que me crea el contenedor
    createContainer: function(){
        // div donde se carga el dom del render
        this.container = document.querySelector('#box_teeth');
        this.container.className = 'container_tooth';
    },
    
    // funcion que me crea la escena
    createScene: function(){
        this.scene = new THREE.Scene();
    },
    
    // funcion que me crea la camara
    createCamera: function(){
        /*
        * Constructor
        *
        * PerspectiveCamera( fov, aspect, near, far )
        *
        * fov — Camera frustum vertical field of view.
        * aspect — Camera frustum aspect ratio.
        * near — Camera frustum near plane.
        * far — Camera frustum far plane.
        */
        
        // parametros de la camara
        var fov = 90;
        var aspect = this.const.WINDOW_WIDTH / this.const.WINDOW_HEIGHT;
        var near = 1;
        var far = 1000;
        
        // creacion de la camara con sus parametros
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        // this.camera = new THREE.OrthographicCamera( this.const.WINDOW_WIDTH / - 2, this.const.WINDOW_WIDTH / 2, this.const.WINDOW_HEIGHT / 2, this.const.WINDOW_HEIGHT / - 2, 1, 1000 );
        
        // posiciono la camara
        App.camera.position.set(-18.967, 280.920,-1.672);
        
        // rotacion de la camara
        App.camera.rotation.set(-1.5707,9.935,1.4567);
        
        // insertamos la camara a la escena
        this.scene.add(this.camera);
        
        // Camera look at
	    this.camera.lookAt( this.scene.position );
    },
    
    // funcion que me crea el renderizado
    createRender: function(){
        
      this.renderer = new THREE.WebGLRenderer({
          antialias: true,
          preserveDrawingBuffer: true, // funcion que me permite tomar las capturas de las caras del diente
      }); 
      
      // pixel del render
      this.renderer.setPixelRatio(this.const.PIXEL_RATIO);
      
      // tamaño del render
      this.renderer.setSize(this.const.WINDOW_WIDTH, this.const.WINDOW_HEIGHT);
      
      // le agregamos un color de fondo al render
      this.renderer.setClearColor( 0x349EEA );
      
      // añadimos la gama de entrada
      this.renderer.gammaInput = true;
      
      // añadimos la gama de salida
      this.renderer.gammaOutput = true;
      
      // activamos las sombras en el mapa
      this.renderer.shadowMapEnabled = true;
      this.renderer.shadowMapSoft = true;
      
      // añadimos un id al renderer(canvas)
      this.renderer.domElement.id = "canvas_3d";
      
      // añadimos el render al container
      this.container.appendChild(this.renderer.domElement);
    },
    
    // funcion que me crea los controles
    createControls: function(){
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        
        // ponemos la distancia minima y la maxima del zoom
        this.controls.minDistance = 50;
        this.controls.maxDistance = 2000;
        
        // añadimos el evento change para que se actualicen los controles
        this.controls.addEventListener('change', render);
    },
    
    // funcion que me crea un ambiente en la escena
    createAmbientScene: function(){
        
        var materialArray = [];
        
        // insertamos las imagenes
    	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/ambient/sky/px.jpg' ) }));
    	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/ambient/sky/nx.jpg' ) }));
    	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/ambient/sky/py.jpg' ) }));
    	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/ambient/sky/ny.jpg' ) }));
    	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/ambient/sky/pz.jpg' ) }));
    	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/ambient/sky/nz.jpg' ) }));
    	
    	// recorremos las imagenes
    	for (var i = 0; i < 6; i++)
    	   materialArray[i].side = THREE.BackSide;    	
    	   
    	var ambientSceneMaterial = new THREE.MeshFaceMaterial( materialArray );
    	var ambientSceneGeometry = new THREE.CubeGeometry( 5000, 5000, 5000, 1, 1, 1 );
    	App.objects.ambientScene = new THREE.Mesh( ambientSceneGeometry, ambientSceneMaterial );
    	
    	App.objects.ambientScene.visible = false;
    	
    	// escalamos el cubo
    // 	ambientScene.scale.set(5,5,5);
    	
    	// agregamos el cubo a la escena
    	this.scene.add( App.objects.ambientScene );
    },
    
    // funcion que me crea el diente
    createTooth: function($tooth){
        // Diente actual renderizado
        App.current_tooth = $tooth;
        
        var loader = new THREE.JSONLoader();
        
        loader.load('objects/tooths/'+ $tooth +'.json', function(object, materials){
            
            // material del diente
            var material = new THREE.MeshFaceMaterial( materials );
    		
    		// creo la malla del diente
    		var mesh = new THREE.Mesh( object, material );
    		
    		mesh.scale.set( 20, 20, 20 ); // escalo el diente
    		mesh.position.set( -9.9998, 18,0.04496 ); // posicion del diente
    		mesh.rotation.set( 0, 0, 0 ); // rotacion del diente
    		
    		App.tooths[App.current_tooth] = mesh; // 
    		mesh.castShadow = true;	// permito que emita sombra el diente
    		// mesh.receiveShadow = true;
    		
    		App.scene.add( mesh ); // añado el diente a la escena
    		
    		// ocultamos el cargador
    		setTimeout(function(){
    		    $('.loader').css('opacity','0');
    		}, 2000);
    		setTimeout(function(){
    		    $('.loader').css('display','none');
    		}, 3000);
    		
		    // miramos si ya hay cache de las imagenes
		    App.cache.current_faces = (JSON.parse(localStorage.getItem('load_faces')) == null) ? [] : JSON.parse(localStorage.getItem('load_faces')) ;
		    
		    // si ya hay imagenes guardadas, cargamos las cacheadas
		    if(App.cache.current_faces.length > 0){
		        // recorro todas las caras y le asigno la imagen
		        for(var i = 0; i < $('.face').length; i++)
		            $('.face').eq(i).css("background-image", App.cache.current_faces[i]).addClass('load');
                // quito el cargador
                $('.render_message').fadeOut('1000');
                
                // creo la instancia de los controles
                App.createControls();
                App.switches.instanced_controls = true;
                
                // agregor la clase active al primer elemento
                $('.face').eq(0).addClass('active');
		    }else{ // si no hay imagenes en la cache tomo las imagenes
		        setTimeout(function(){
		            App.events.takeFaces();
		        }, 5000);
		    }
        });
        
    //     var loader2 = new THREE.JSONLoader();
        
    //     loader2.load('objects/tooth_color_material.json', function(object,materials){
            
    //         // material del diente
    //         var material = new THREE.MeshFaceMaterial( materials );
    		
    // 		// creo la malla del diente
    // 		var mesh = new THREE.Mesh( object, material );
    		
    // 		mesh.scale.set( 20, 20,20 ); // escalo el diente
    // 		mesh.position.set( -9.9998, 18,0.04496 ); // posicion del diente
    // 		mesh.rotation.set( 0, 0, 0 ); // rotacion del diente
    		
    // 		App.objects.tooths.blend = mesh; // 
    // 		mesh.castShadow = true;	// permito que emita sombra el diente
    // 		// mesh.receiveShadow = true;
    		
    // 		App.scene.add( mesh ); // añado el diente a la escena
    //     });
        
        var bracket = new THREE.JSONLoader();
        
        bracket.load('objects/bracket.js', function(object){
            var material = new THREE.MeshLambertMaterial( {
    			color: 0x555555,
    		} );
    		
    		var mesh = new THREE.Mesh( object, material );
    		mesh.scale.set( 22, 22,22 );
    		mesh.position.set(-71,190,0);
    		mesh.rotation.x = 3.14;
    		mesh.rotation.y = -7.9;
    		mesh.rotation.z = 0;
    		mesh.visible = false;
    		
    		App.objects.bracket = mesh;
    		
    		App.scene.add( mesh );
        });
    },
    
    // funcion que me crea los ejes de apoyo (x,y,z)
    createAxis: function(){
        // creo el axis
        this.axis = new THREE.AxisHelper(1000);
        this.axis.visible = false;
        
        // lo añado a la camara
        this.scene.add(this.axis);
    },
    
    // funcion que me crea las luces
    createLights: function(){
        this.events.pointLight();
        this.events.ambientLight();
        this.events.directionalLight();
        this.events.spotLight();
    },
    
    events: {
        // funcion que me permite poner pantalla completa
        fullScreen: function(){
            THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
        },
        
        // funcion que me carga el mapamundi
        worldmap: function(){
            // cargo la textura
            var map = THREE.ImageUtils.loadTexture( 'textures/mapamundi.jpg' );
            
            // le asigno un material
            var material = new THREE.MeshLambertMaterial( {
                map: map,
                side: THREE.DoubleSide, 
                wireframe : false 
            } );
    	    
    	    // creo la malla
        	App.objects.worldmap = new THREE.Mesh( new THREE.SphereGeometry( 30,32,32, 0, 6.3, 0, 3.1), material );
        	
        	App.objects.worldmap.position.set( 0, 100, 0 );
        	App.objects.worldmap.scale.set( 3, 3, 3 );
        	App.objects.worldmap.castShadow = true;
        	App.objects.worldmap.visible = false; // mostrar o ocultar el mapamundi
        	App.scene.add( App.objects.worldmap );
        	
        // 	App.events.edgesHelper(App.objects.worldmap, 0x000000);
        // 	App.events.faceNormalHelper(App.objects.worldmap, 5, 0x000000, 1);
        // 	App.events.vertexNormalHelper(App.objects.worldmap, 5, 0xff0000, 1);
        },
        
        // funcion que me carga el plano
        plane: function(){
            // Textura
            var texturePlane = new THREE.ImageUtils.loadTexture("textures/checkerboard.jpg");
            
            // Geometria
            var planeGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
            texturePlane.wrapS = texturePlane.wrapT = THREE.RepeatWrapping; // repeticion de la textura
            texturePlane.repeat.set(10,10); // segmentos de la repeticion
            
            // Material
            var planeMaterial = new THREE.MeshLambertMaterial({
            	map: texturePlane,
            	side: THREE.DoubleSide,
            });
            
            // Malla
            App.objects.plane = new THREE.Mesh(planeGeometry, planeMaterial);
            App.objects.plane.receiveShadow = true;
            App.objects.plane.castShadow = true;
            App.objects.plane.visible = false;
        
            // Rotacion del plano
            App.objects.plane.rotation.x = -0.5 * Math.PI;
        
            // añado el plano a la escena
            App.scene.add(App.objects.plane);
        },
        
        // funcion que me carga el evento de la luz point
        pointLight: function(){
            // PointLight
            App.lights.point = new THREE.PointLight(0xF9F2F2, .0, 0, 2);
            App.lights.point.position.set(0,500,-500); // posicion
            // configuracion de la camra para sombras
            App.lights.point.castShadow = false; // permito a la luz que emita sombras
            App.lights.point.shadowCameraVisible = true;
            
            // App.lights.point.shadowCameraNear = 250;
            // App.lights.point.shadowCameraFar = 20000;
            
            // App.lights.point.shadowCameraLeft = -100;
            // App.lights.point.shadowCameraRight = 100;
            // App.lights.point.shadowCameraTop = -100;
            // App.lights.point.shadowCameraBottom = 100;
            
            // App.lights.point.visible = true;
            
            App.scene.add(App.lights.point); // añado la luz a la escena
            
            // añado el helper
            // App.events.helpers.pointLight(App.lights.point, 30);
            
            // ----------------------------------------
            // Otra luz con las mismas caracteristicas
            // ----------------------------------------
            
            // PointLight
            App.lights.pointSide = new THREE.PointLight(0xF9F2F2, .0, 0, 2);
            App.lights.pointSide.position.set(-500,500,0); // posicion
            
            App.scene.add(App.lights.pointSide); // añado la luz a la escena
            
            // añado el helper
            // App.events.helpers.pointLight(App.lights.pointSide, 30);
        },
        
        // funcion que me crea la luz de ambiente
        ambientLight: function(){
            App.lights.ambient = new THREE.AmbientLight(0x555555);
            App.scene.add(App.lights.ambient);
        },
        
        // funcion que crea la luz direccional
        directionalLight: function(){
            App.lights.directional = new THREE.DirectionalLight(0xF9F2F2, .05); // color y intensidad de la luz
            App.lights.directional.position.set(0, 300, 500); // posicion de la luz
            App.lights.directional.castShadow = true; // le digo que me emita sombras a la luz
            
            App.scene.add(App.lights.directional);
            
            // helper de la luz direccional
            // App.events.helpers.directionalLight(App.lights.directional, 50);
            
            // ----------------------------------
            // Otra luz directional
            // ----------------------------------
            
            App.lights.directionalSide = new THREE.DirectionalLight(0xF9F2F2, .05); // color y intensidad de la luz
            App.lights.directionalSide.position.set(500, 300, 0); // posicion de la luz
            
            App.scene.add(App.lights.directionalSide);
            
            // helper de la luz direccional
            // App.events.helpers.directionalLight(App.lights.directionalSide, 50);
        },
        
        // funcion que me crea la luz spot
        spotLight: function(){
            /*
            SpotLight(hex, intensity, distance, angle, exponent, decay)

            hex — Numeric value of the RGB component of the color. 
            intensity — Numeric value of the light's strength/intensity. 
            distance -- Maximum distance from origin where light will shine whose intensity is attenuated linearly based on distance from origin. 
            angle -- Maximum angle of light dispersion from its direction whose upper bound is Math.PI/2.
            exponent -- Rapidity of the falloff of light from its target direction.
            decay -- The amount the light dims along the distance of the light.
            */
            
            App.lights.spot = new THREE.SpotLight(0xffffff, .0);
            App.lights.spot.position.set(0, 2800, 0);
            App.scene.add(App.lights.spot); // añadimos la luz a la escena
            
            // añadimos el helper de la luz spot
            // App.events.helpers.spotLight(App.lights.spot);
        },
        
        // funcion que me toma las diferentes caras del diente
        takeFaces: function(){
            $('.render_message').fadeIn('1000');
            $('.face').css("background-image", "url(../img/loader_face.gif)").removeClass('load');
            App.events.faceOcclusal();
        },
        
        // funcion que toma la primera imagen del diente
        faceOcclusal: function($position){
            
            if($position == undefined){
                setTimeout(function(){
                    var $tooth_image = App.renderer.domElement.toDataURL('image/png');
                    var $nameTooth = 'primer_molar';
                    var $positionTooth = 'superior';
                    var $sideTooth = 'derecha';
                    var $faceTooth = 'occlusal';
                    
                    App.faces[$faceTooth] = $('.face.'+$faceTooth);
                    
                    // ajax que me toma la primera captura del diente
                    $.ajax({
                        url: 'generateImage',
                        type: 'POST',
                        data: {
                            base64img: $tooth_image,
                            nameTooth: $nameTooth,
                            positionTooth: $positionTooth, 
                            sideTooth: $sideTooth,
                            faceTooth: $faceTooth
                        },
                        success: function(res){
                            console.log(JSON.parse(res));
                            var response = JSON.parse(res);
                            App.faces[$faceTooth].removeClass('load');
                            App.faces[$faceTooth].css("background-image", "url(../img/loader_face.gif)");
                            setTimeout(function(){
                                App.faces[$faceTooth].css("background-image", "url(tooths_faces/"+ $nameTooth +"/"+ $positionTooth +"/"+ $sideTooth +"/"+ $faceTooth + ".jpg)");
                                App.faces[$faceTooth].addClass('load active');
                            },20);
                            
                            if(response.status == "OK"){
                                App.events.faceBuccal();
                                App.cache.current_faces.push("url(tooths_faces/"+ $nameTooth +"/"+ $positionTooth +"/"+ $sideTooth +"/"+ $faceTooth + ".jpg)");
                            }
                        }
                    });
                }, 1000);
            }else{
                // posiciono la camara
                App.camera.position.set(-18.967, 280.920,-1.672);
                
                // rotacion de la camara
                App.camera.rotation.set(-1.5707,9.935,1.4567);
                
                App.switches.instanced_controls = true;
            }
        },
        
        // funcion que me toma la cara bucal del dinete
        faceBuccal: function($position){
            // posiciono la camara
            App.camera.position.set(-176.970052, 154.114494,-29.828953);
            
            // rotacion de la camara
            App.camera.rotation.set(-2.166,-1.3499,-2.1784);
            
            App.switches.instanced_controls = false;
            
            if($position == undefined){
                setTimeout(function(){
                    var $tooth_image = App.renderer.domElement.toDataURL('image/png');
                    var $nameTooth = 'primer_molar';
                    var $positionTooth = 'superior';
                    var $sideTooth = 'derecha';
                    var $faceTooth = 'buccal';
                    
                    App.faces[$faceTooth] = $('.face.'+$faceTooth);
                    
                    // ajax que me toma la primera captura del diente
                    $.ajax({
                        url: 'generateImage',
                        type: 'POST',
                        data: {
                            base64img: $tooth_image,
                            nameTooth: $nameTooth,
                            positionTooth: $positionTooth, 
                            sideTooth: $sideTooth,
                            faceTooth: $faceTooth
                        },
                        success: function(res){
                            console.log(JSON.parse(res));
                            var response = JSON.parse(res);
                            App.faces[$faceTooth].removeClass('load');
                            App.faces[$faceTooth].css("background-image", "url(../img/loader_face.gif)");
                            setTimeout(function(){
                                App.faces[$faceTooth].css("background-image", "url(tooths_faces/"+ $nameTooth +"/"+ $positionTooth +"/"+ $sideTooth +"/"+ $faceTooth + ".jpg)");
                                App.faces[$faceTooth].addClass('load');
                            },20);
                            if(response.status == "OK"){
                                App.events.faceLingual();
                                App.cache.current_faces.push("url(tooths_faces/"+ $nameTooth +"/"+ $positionTooth +"/"+ $sideTooth +"/"+ $faceTooth + ".jpg)");
                            }
                        }
                    });
                }, 1000);
            }
        },
        
        // funcion que me toma la cara Lingual del dinete
        faceLingual: function($position){
            // posiciono la camara
            App.camera.position.set(158.20162, 166.560875,24.780153);
            
            // rotacion de la camara
            App.camera.rotation.set(-1.0308,1.30497,1.014);
            
            App.switches.instanced_controls = false;
            
            if($position == undefined){
                setTimeout(function(){
                    var $tooth_image = App.renderer.domElement.toDataURL('image/png');
                    var $nameTooth = 'primer_molar';
                    var $positionTooth = 'superior';
                    var $sideTooth = 'derecha';
                    var $faceTooth = 'lingual';
                    
                    App.faces[$faceTooth] = $('.face.'+$faceTooth);
                    
                    // ajax que me toma la primera captura del diente
                    $.ajax({
                        url: 'generateImage',
                        type: 'POST',
                        data: {
                            base64img: $tooth_image,
                            nameTooth: $nameTooth,
                            positionTooth: $positionTooth, 
                            sideTooth: $sideTooth,
                            faceTooth: $faceTooth
                        },
                        success: function(res){
                            console.log(JSON.parse(res));
                            var response = JSON.parse(res);
                            App.faces[$faceTooth].removeClass('load');
                            App.faces[$faceTooth].css("background-image", "url(../img/loader_face.gif)");
                            setTimeout(function(){
                                App.faces[$faceTooth].css("background-image", "url(tooths_faces/"+ $nameTooth +"/"+ $positionTooth +"/"+ $sideTooth +"/"+ $faceTooth + ".jpg)");
                                App.faces[$faceTooth].addClass('load');
                            },20);
                            if(response.status == "OK"){
                                App.events.faceMesial();
                                App.cache.current_faces.push("url(tooths_faces/"+ $nameTooth +"/"+ $positionTooth +"/"+ $sideTooth +"/"+ $faceTooth + ".jpg)");
                            }
                        }
                    });
                }, 1000);
            }
        },
        
        // funcion que me toma la cara Mesial del dinete
        faceMesial: function($position){
            // posiciono la camara
            App.camera.position.set(51.0038, 173.38995,-162.01455);
            
            // rotacion de la camara
            App.camera.rotation.set(-2.844,0.334,3.04145);
            
            App.switches.instanced_controls = false;
            
            if($position == undefined){
                setTimeout(function(){
                    var $tooth_image = App.renderer.domElement.toDataURL('image/png');
                    var $nameTooth = 'primer_molar';
                    var $positionTooth = 'superior';
                    var $sideTooth = 'derecha';
                    var $faceTooth = 'mesial';
                    
                    App.faces[$faceTooth] = $('.face.'+$faceTooth);
                    
                    // ajax que me toma la primera captura del diente
                    $.ajax({
                        url: 'generateImage',
                        type: 'POST',
                        data: {
                            base64img: $tooth_image,
                            nameTooth: $nameTooth,
                            positionTooth: $positionTooth, 
                            sideTooth: $sideTooth,
                            faceTooth: $faceTooth
                        },
                        success: function(res){
                            console.log(JSON.parse(res));
                            var response = JSON.parse(res);
                            App.faces[$faceTooth].removeClass('load');
                            App.faces[$faceTooth].css("background-image", "url(../img/loader_face.gif)");
                            setTimeout(function(){
                                App.faces[$faceTooth].css("background-image", "url(tooths_faces/"+ $nameTooth +"/"+ $positionTooth +"/"+ $sideTooth +"/"+ $faceTooth + ".jpg)");
                                App.faces[$faceTooth].addClass('load');
                            },20);
                            if(response.status == "OK"){
                                App.events.faceDistal();
                                App.cache.current_faces.push("url(tooths_faces/"+ $nameTooth +"/"+ $positionTooth +"/"+ $sideTooth +"/"+ $faceTooth + ".jpg)");
                            }
                        }
                    });
                }, 1000);
            }
        },
        
        // funcion que me toma la cara Distal del dinete
        faceDistal: function($position){
            // posiciono la camara
            App.camera.position.set(-46.8414, 198.428,143.630);
            
            // rotacion de la camara
            App.camera.rotation.set(-0.4474,-0.229,-0.1087);
            
            App.switches.instanced_controls = false;
            
            if($position == undefined){
                setTimeout(function(){
                    var $tooth_image = App.renderer.domElement.toDataURL('image/png');
                    var $nameTooth = 'primer_molar';
                    var $positionTooth = 'superior';
                    var $sideTooth = 'derecha';
                    var $faceTooth = 'distal';
                    
                    App.faces[$faceTooth] = $('.face.'+$faceTooth);
                    
                    // ajax que me toma la primera captura del diente
                    $.ajax({
                        url: 'generateImage',
                        type: 'POST',
                        data: {
                            base64img: $tooth_image,
                            nameTooth: $nameTooth,
                            positionTooth: $positionTooth, 
                            sideTooth: $sideTooth,
                            faceTooth: $faceTooth
                        },
                        success: function(res){
                            console.log(JSON.parse(res));
                            var response = JSON.parse(res);
                            App.faces[$faceTooth].removeClass('load');
                            App.faces[$faceTooth].css("background-image", "url(../img/loader_face.gif)");
                            setTimeout(function(){
                                App.faces[$faceTooth].css("background-image", "url(tooths_faces/"+ $nameTooth +"/"+ $positionTooth +"/"+ $sideTooth +"/"+ $faceTooth + ".jpg)");
                                App.faces[$faceTooth].addClass('load');
                            },20);
                            if(response.status == "OK"){
                                // guardamos la ultima imagen cargada en cache
                                App.cache.current_faces.push("url(tooths_faces/"+ $nameTooth +"/"+ $positionTooth +"/"+ $sideTooth +"/"+ $faceTooth + ".jpg)");
                                
                                // guardamos la carga de las imagenes en cache
                                localStorage.setItem('load_faces', JSON.stringify(App.cache.current_faces));
                                
                                // posiciono la camara
                                App.camera.position.set(-18.967, 280.920,-1.672);
                                
                                // rotacion de la camara
                                App.camera.rotation.set(-1.5707,9.935,1.4567);
                                
                                // creo la instancia de los controles
                                App.createControls();
                                App.switches.instanced_controls = true;
                                
                                setTimeout(function() {
                                    $('.render_message').fadeOut('1000');
                                }, 1500);
                            }
                        }
                    });
                }, 1000);
            }
        },
        
        helpers: {
            // funcion que me imprime el objeto con la malla
            edges: function(mesh, color){
                App.helpers.edges = new THREE.EdgesHelper(mesh, color);
                
                App.scene.add(App.helpers.edges);
            },
            
            // funcion que me imprime el objeto con flechas en cada cara
            faceNormal: function(mesh, size, color, lineWidth){
                App.helpers.faceNormal = new THREE.FaceNormalsHelper(mesh, size, color, lineWidth);
                
                App.scene.add(App.helpers.faceNormal);
            },
            
            // funcion que me imprime el objeto con
            vertexNormal: function(mesh, size, color, lineWidth){
                App.helpers.vertexnormal = new THREE.VertexNormalsHelper(mesh, size, color, lineWidth);
                
                App.scene.add(App.helpers.vertexnormal);
            },
            
            // funcion que me crea el helper de la camara
            camera: function(camera){
                App.helpers.camera = new THREE.CameraHelper(camera);
                
                App.scene.add(App.helpers.camera);
            },
            
            // funcion que me carga el helper de la luz point
            pointLight: function(pointLight, sphere){
                // HelperPoint
                App.helpers.pointLight = new THREE.PointLightHelper( pointLight, sphere );
                App.scene.add( App.helpers.pointLight );
            },
            
            // funcion que me carga el helper de la luz direccional
            directionalLight: function(directionalLight, size){
                App.helpers.directionalLight = new THREE.DirectionalLightHelper(directionalLight, size);
                
                App.scene.add(App.helpers.directionalLight);
            },
            
            // funcion que me pone el helper de la luz spot
            spotLight: function(spotLight){
                App.helpers.spotLight = new THREE.SpotLightHelper(spotLight);
                App.scene.add(App.helpers.spotLight);
            }
        },
    }
};

// funcion cuando carga la pagina
window.onload = load_page();

function load_page(){
    App.init();
    animate();
    
    // evento de la imagen occlusal
    $('.face.occlusal').unbind('click').click(function(){
        App.controls.reset();
        event_face($(this));
        App.events.faceOcclusal('only_position');
    });
    
    // evento de la imagen buccal
    $('.face.buccal').unbind('click').click(function(){
        App.controls.reset();
        event_face($(this));
        App.events.faceBuccal('only_position');
    });
    
    // evento de la imagen lingual
    $('.face.lingual').unbind('click').click(function(){
        App.controls.reset();
        event_face($(this));
        App.events.faceLingual('only_position');
    });
    
    // evento de la imagen mesial
    $('.face.mesial').unbind('click').click(function(){
        App.controls.reset();
        event_face($(this));
        App.events.faceMesial('only_position');
    });
    
    // evento de la imagen distal
    $('.face.distal').unbind('click').click(function(){
        App.controls.reset();
        event_face($(this));
        App.events.faceDistal('only_position');
    });
    
    // click para añadir el bracket
    $('#add_bracket').unbind('click').click(function(){
        App.objects.bracket.visible = !App.objects.bracket.visible;
        $(this).toggleClass('checked');
    });
    
    // click para añadir el plano
    $('#add_plane').unbind('click').click(function(){
        App.objects.plane.visible = !App.objects.plane.visible;
        $(this).toggleClass('checked');
    });
    
    // click para añadir los ejes dce referencia
    $('#add_axis').unbind('click').click(function(){
        App.axis.visible = !App.axis.visible;
        $(this).toggleClass('checked');
    });
    
    // click para añadir al ambiente de la escena
    $('#add_ambient_scene').unbind('click').click(function(){
        App.objects.ambientScene.visible = !App.objects.ambientScene.visible;
        $(this).toggleClass('checked');
    });
    
    // click para añadir el helper de la luz point
    $('#add_point_light').unbind('click').click(function(){
        App.events.helpers.pointLight(App.lights.point, 30);
        $(this).toggleClass('checked');
    });
    
    // click para añadir el helper de la luz point
    $('#add_point_light_side').unbind('click').click(function(){
        App.events.helpers.pointLight(App.lights.pointSide, 30);
        $(this).toggleClass('checked');
    });
    
    $('.render_message h1').textillate({ 
      in: { effect: 'splat' },
      out: { effect: 'foldUnfold', sync: true },
      loop: true
    });
    
    // evento que me añade la clase activa a la carilla seleccionada
    function event_face($face){
        $('.face').removeClass('active');
        $face.addClass('active');
    }
}

// funcion render() por defecto de three js
function animate(){
    requestAnimationFrame( animate );
    render();
}

// render()
function render(){
    App.renderer.render(App.scene, App.camera);
    
    // verificamos primero si ya se hizo la instancia
    if(App.switches.instanced_controls){
        // actualizamos los controles
        App.controls.update();
    }
    
    // Giro el mapamundi
    // App.objects.worldmap.rotation.y += 0.005;
    
    // var time = Date.now() * 0.0005;
    
//     App.lights.point.position.x = Math.sin( time * 0.7 ) * 300;
// 	App.lights.point.position.y = Math.cos( time * 0.5 ) * 400;
// 	App.lights.point.position.z = Math.cos( time * 0.3 ) * 300;
}
