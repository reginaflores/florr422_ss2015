if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
//Global variables:
var container, stats;
var camera, scene, renderer, composer;
var controls;
var width = window.innerWidth || 2;
var height = window.innerHeight || 2;
var windowHalfX = width / 2;
var windowHalfY = height / 2;
var clock = new THREE.Clock();
var mouseX = 0, mouseY = 0,
lat = 0, lon = 0, phy = 0, theta = 0;
//Shader variables:
var uniforms, mesh, mesh2;

	uniforms = {

		fogDensity: { 
			type: "f", 
			value: 0.45 
		},
		fogColor: { 
			type: "v3", 
			value: new THREE.Vector3( 0, 0, 0 ) 
		},
		time: { 
			type: "f", 
			value: 1.0 
		},
		resolution: { type: "v2", 
			value: new THREE.Vector2() 
		},
		uvScale: { 
			type: "v2", 
			value: new THREE.Vector2( 3.0, 1.0 ) 
		},
		texture1: { 
			type: "t", 
			value: THREE.ImageUtils.loadTexture( "js/textures/earth.jpg" ) 
		},
		texture2: { 
			type: "t", 
			value: THREE.ImageUtils.loadTexture( "js/textures/land.jpg" ) 
		}

};
	uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.RepeatWrapping;
	uniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = THREE.RepeatWrapping;

//Function borrowed from Jaskirat
//This allows me to load more than one
//shader in the scene at a time! 
//////////////////////////////////
var shadersHolder = {
    vertex: '',
    fragment: ''
};
var shaderCount = 0;

function loadShaders(url, shaderType, position) {
    // console.log(url, shaderType);
    $.ajax({
        url: url,
        type: "GET",
        dataType: "text",
        success: function(data, textStatus, jqxhr) {
            shadersHolder[shaderType] = data;
            // console.log(shadersHolder);
            shaderCount++;
            if (shaderCount == 6) {
                init();
                animate();
            }
        }
    });
}
//////////////////////////////////

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

	camera = new THREE.PerspectiveCamera( 35, windowHalfX / windowHalfY, 1, 3000 );
	camera.position.z = 30;

	controls = new THREE.OrbitControls(camera);
	controls.addEventListener('change', render);

	scene = new THREE.Scene();
	
	////////////////////
	//Lava Torus 
	var material = new THREE.ShaderMaterial( {

		uniforms: uniforms,
		vertexShader: shadersHolder.lava_vertex,
		fragmentShader: shadersHolder.fragment

	} );

	var size = 0.35;
	mesh = new THREE.Mesh( new THREE.TorusGeometry( size, 0.1, 30, 30 ), material );
	// mesh.position.set(20,0,0);
	mesh.position.z+=20;
		// mesh.position.x+=5;

	mesh.rotation.x = 0.3;
	scene.add( mesh );
	////////////////////

	// var material2 = new THREE.ShaderMaterial( {

	// 	uniforms: uniforms,
	// 	vertexShader: shadersHolder.lava_vertex,
	// 	fragmentShader: shadersHolder.fragment

	// } );
	
	// mesh2 = new THREE.Mesh( new THREE.TorusGeometry( size + .01, 0.1, 30, 30 ), material2 );
	
	// mesh2.rotation.x = 0.3;
	// scene.add( mesh2 );
	
	// var mesh3 = new THREE.Mesh( new THREE.SphereGeometry(20,32,32), material2 );
	
	// // mesh3.rotation.x = 0.3;
	// scene.add( mesh3 );

	// var geometry = new THREE.SphereGeometry( 0.5, 32, 32 );
	// // var material2 = new THREE.MeshBasicMaterial( {color: 0xffff00} );
	// var sphere = new THREE.Mesh( geometry, material );
	// scene.add( sphere );

	// //testing w jas's shader:
	// // Plane CROSS
 //    var geometry = new THREE.PlaneBufferGeometry(150, 150);
 //    geometry.rotateY(-Math.PI / 4.5);
 //    // geometry.rotateX(-Math.PI / 4.3);
 //    geometry.translate(20, 0, -40);
 //    // geometry.translate(50, 0, -40);

 //    var material = new THREE.ShaderMaterial({
 //        uniforms: uniforms,
 //        vertexShader: shadersHolder.dot_vertex,
 //        fragmentShader: shadersHolder.crosses

 //    });
 //    var plane = new THREE.Mesh(geometry, material);
 //    scene.add(plane);
    ///////////////////////
	
	// var material = new THREE.ShaderMaterial( {

	// 	uniforms: uniforms,
	// 	vertexShader: shadersHolder.lava_vertex,
	// 	fragmentShader: shadersHolder.fragment

	// } );

	// var object = new THREE.Mesh( new THREE.SphereGeometry( 20, 30, 30 ), material );
	// 	console.log("loaded object");
	// 	// object.position.set( -400, 0, 200 );
	// 	scene.add( object );

	// var material = new THREE.ShaderMaterial( {

	// 	uniforms: { 
	// 		tShine: { 
	// 			type: "t", 
	// 			value: THREE.ImageUtils.loadTexture( 'js/textures/lavatile.jpg' ) 
	// 		},
	// 		time: { type: "f", value: 0 },
	// 		weight: { type: "f", value: 0 }
	// 	},
	// 	vertexShader: shadersHolder.noise_vert,
	// 	fragmentShader: shadersHolder.noise_frag
		
	// } );
	// var sphere = new THREE.Mesh( new THREE.SphereGeometry( 0.5, 32, 32 ), material);
	// sphere.scale.x = -1;
	// sphere.doubleSided = true;
	// scene.add( sphere );

	// var mesh = new THREE.Mesh( new THREE.IcosahedronGeometry( 20, 5 ), material );
	// scene.add( mesh );


 //    var sphere = new THREE.Mesh( new THREE.SphereGeometry( 500, 60, 60 ), material);

 //    sphere.scale.x = -1;
	// sphere.doubleSided = true;
 //    scene.add(sphere);


	// var material = new THREE.ShaderMaterial( {

	// 	uniforms: uniforms,
	// 	vertexShader: shadersHolder.noise_vertex,
	// 	fragmentShader: shadersHolder.noise_frag

	// } );

	// var mesh = new THREE.Mesh( new THREE.IcosahedronGeometry( 20, 5 ), material );
	// scene.add( mesh );
	
	// var mesh2 = new THREE.Mesh( new THREE.TorusGeometry( size, 0.3, 30, 30 ), material );
	// mesh2.rotation.x = 0.3;
	// scene.add( mesh2 );




	//////////////////////////////////////////////////////////
	//
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	container.appendChild( renderer.domElement );
	renderer.autoClear = false;
	//
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	//container.appendChild( stats.domElement );

	var renderModel = new THREE.RenderPass( scene, camera );
	var effectBloom = new THREE.BloomPass( 1.25 );
	var effectFilm = new THREE.FilmPass( 0.35, 0.95, 2048, false );

	effectFilm.renderToScreen = true;

	composer = new THREE.EffectComposer( renderer );

	composer.addPass( renderModel );
	composer.addPass( effectBloom );
	composer.addPass( effectFilm );
	//
	onWindowResize();
	window.addEventListener( 'resize', onWindowResize, false );
	//////////////////////////////////////////////////////////
}

function onWindowResize( event ) {

	uniforms.resolution.value.x = window.innerWidth;
	uniforms.resolution.value.y = window.innerHeight;

	renderer.setSize( window.innerWidth, window.innerHeight );

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	composer.reset();

}

function animate() {
	requestAnimationFrame( animate );
	render();
	stats.update();
}


function render() {
	var delta = 5 * clock.getDelta();
	uniforms.time.value += 0.2 * delta;
	mesh.rotation.y += 0.0125 * delta;
	mesh.rotation.x += 0.05 * delta;
	// mesh2.rotation.y += 0.05 * delta;
	// mesh2.rotation.x += 0.2 * delta;

	camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY - camera.position.y ) * .05;
	camera.lookAt( scene.position );

	renderer.clear();
	composer.render( 0.01 );
}

$(document).ready(function() {
    loadShaders("js/shaders/shader.frag", "fragment", 1);
    loadShaders("js/shaders/vertex.vert", "lava_vertex", 2);
    loadShaders("js/shaders/shader2.frag", "noise_frag", 3);
    loadShaders("js/shaders/vertex2.vert", "noise_vertex", 4);
	loadShaders("js/shaders/dot_vertex.vert", "dot_vertex", 5);
    loadShaders("js/shaders/crosses.frag", "crosses", 6);



});

