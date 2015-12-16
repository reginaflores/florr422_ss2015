"use strict";

var THEW = {};

THEW.numFlareMeshes = 5;
THEW.flares = [];

THEW.createGalaxy = function() {

	var butt = {};

	var seed = new Date().toString();
	var rng = new Math.seedrandom(seed);

	var et = 0.0;
	var pixelRatio  = 1.0;
	var aspectRatio = 1.0;

	var params = {

		aux  : 0.2,
		aux2 : 1.0,

		//Volume fog
		timeScale : 0.3,
		color0  : '#2E2B69',
		color1  : '#6B1A32',
		color2  : '#CAA707',
		squash0 : 0.18,
		squash1 : 0.46,
		squash2 : 0.5,
		radius1 : 0.83,
		radius2 : 0.44,
		soften  : 5.0,

		//Bokeh stars
		focalPoint   : new THREE.Vector3(0.0, 0.0, 0.0),
		minSize      : 15.0,
		maxBokehSize : 600.0,
		dofCurve     : 1.7,
		alpha        : 0.0,

		//Volumetric clouds
		lightCurve : 2.0,
		highColor : '#38416E',
		lowColor  : '#2F1616',
		distColor : '#04092D',
		// highColor : '#3E323B',
		// lowColor  : '#000209',
		// distColor : '#000000',
	};

	var hazeGlow;
	var spiralStarPointCloud;

	var volumetricCloud;

	var texturedClouds;

	var hazeMaterial;
	var galaxy = new THREE.Object3D();
	
	var galaxyVert   = THEW.shaders['Shaders/galaxy.vert'];
	var galaxyFrag   = THEW.shaders['Shaders/galaxy.frag'];

	var pointStarCloud;
	var pointStarMaterial;
	var pointStarVert = THEW.shaders['test/pointStar.vert'];
	var pointStarFrag = THEW.shaders['test/pointStar.frag'];

	var ditheredSpriteVert = THEW.shaders['Shaders/ditheredSprite.vert'];
	var ditheredSpriteFrag = THEW.shaders['Shaders/ditheredSprite.frag'];

	var texturedCloudsVert = THEW.shaders['Shaders/texturedClouds.vert'];
	var texturedCloudsFrag = THEW.shaders['Shaders/texturedClouds.frag'];

	// var ditheredSpriteTexture = THREE.ImageUtils.loadTexture("Textures/CloudSpriteThick.png");
	var ditheredSpriteTexture = THREE.ImageUtils.loadTexture("Textures/Puff.png");
	var textureCloudsTexture = THREE.ImageUtils.loadTexture("Textures/BakedCloudsSwirled.png");
	var starTex = THREE.ImageUtils.loadTexture("Textures/Bokeh.png");

	var bayerTexture = THREE.ImageUtils.loadTexture("Textures/Bayer.png");
	bayerTexture.wrapS = THREE.RepeatWrapping;
	bayerTexture.wrapT = THREE.RepeatWrapping;
	bayerTexture.minFilter = THREE.NearestFilter;
	bayerTexture.magFilter = THREE.NearestFilter;

	hazeMaterial = new THREE.ShaderMaterial( {
		fragmentShader : galaxyFrag,
		vertexShader   : galaxyVert,
		uniforms: {
			c           : {type : 'v3',  value : new THREE.Vector3(0, 0, 0)},
			elapsedTime : {type : 'f',   value : 1.0},
			color0      : {type : 'c',   value: new THREE.Color( 0xffaa00 )},
			color1      : {type : 'c',   value: new THREE.Color( 0xffaa00 )},
			color2      : {type : 'c',   value: new THREE.Color( 0xffaa00 )},
			squash0     : {type : 'f',   value : 1.0},
			squash1     : {type : 'f',   value : 1.0},
			squash2     : {type : 'f',   value : 1.0},
			radius1     : {type : 'f',   value : 1.0},
			radius2     : {type : 'f',   value : 1.0},
			soften      : {type : 'f',   value : 1.0},
			aux         : {type : 'f',   value : 1.0},
			aux2        : {type : 'f',   value : 1.0},
		},
		blending: THREE.AdditiveBlending,
		side : THREE.DoubleSide,
		transparent: true,
		depthWrite: false,
		depthTest: false
	} );
	
	var hazeGeometry = new THREE.IcosahedronGeometry(1, 3);
	hazeGlow = new THREE.Mesh( hazeGeometry, hazeMaterial );


	// Bokeh star material
	pointStarMaterial = new THREE.ShaderMaterial({
		fragmentShader : pointStarFrag,
		vertexShader   : pointStarVert,
		uniforms: {
			elapsedTime  : {type : 'f',   value : 0.0},
			minSize      : {type : 'f',   value : params.minSize},
			maxBokehSize : {type : 'f',   value : params.maxBokehSize},
			pixelRatio   : {type : 'f',   value : 0.0},
			aspectRatio  : {type : 'f',   value : 0.0},
			dofCurve     : {type : 'f',   value : params.dofCurve},
			alpha        : {type : 'f',   value : params.alpha},
			texture      : {type : 't',   value : starTex},

			center       : {type : 'v3',  value : new THREE.Vector3(0, 0, 0)},
			focalPoint   : {type : 'v3',  value : new THREE.Vector3(0, 0, 0)},

			aux         : {type : 'f',   value : 1.0},
			aux2        : {type : 'f',   value : 1.0},
		},

		transparent     : true,
		depthWrite      : false,
		// depthTest       : false,
		blending        : THREE.AdditiveBlending
	});


	// Regular stars
	var starPoints = new THREE.Geometry();
	var numStars = 5000;
	var scale = 0.75;
	var yAxis = new THREE.Vector3(0.0, 1.0, 0.0);
	for (var i=0; i<numStars; i++) {
		var x1 = 2;
		var x2 = 2;
		while (x1*x1 + x2*x2 >= 1.0) {
			x1 = rand(-1.0, 1.0);
			x2 = rand(-1.0, 1.0);
		}
		var v = new THREE.Vector3(
			2.0 * x1 * Math.sqrt(1.0 - x1*x1 - x2*x2),
			2.0 * x2 * Math.sqrt(1.0 - x1*x1 - x2*x2),
			1.0 - 2.0 * (x1*x1 + x2*x2)
		).normalize();
		v.multiplyScalar(randNormal());
		v.y *= params.squash0;
		starPoints.vertices.push(v);
	}

	pointStarCloud = new THREE.PointCloud(starPoints, pointStarMaterial);
	


	// Spiral stars
	var spiralStarPoints = new THREE.Geometry();
	var numSpiralStars = 5000;
	// var scale = 0.75;
	var xAxis = new THREE.Vector3(1.0, 0.0, 0.0);
	var yAxis = new THREE.Vector3(0.0, 1.0, 0.0);
	var mo = 0.01;
	var spins = 4.0;
	for (var i=0; i<numSpiralStars; i++) {
		var x = randNormal();//rand(-1.0, 1.0);
		var k = Math.pow(Math.cos(3.1415927*x/2.0) * 0.5, 2.5);
		var z = rand(-k, k);
		// z = Math.pow(z, 3.0);
		var v = new THREE.Vector3(x+rand(-mo, mo), 0.0, z+rand(-mo, mo));
		v.applyAxisAngle(xAxis, rand(0.0, 2.0*Math.PI));
		v.applyAxisAngle(yAxis, 2.0*Math.PI*Math.abs(Math.cos(x))*spins + 0.2);
		v.y *= 0.3;
		spiralStarPoints.vertices.push(v);
	}

	spiralStarPointCloud = new THREE.PointCloud(spiralStarPoints, pointStarMaterial);
	


	// Flat spiral gas texture
	texturedClouds = THEW.texturedClouds.clone();
	var textureCloudsMaterial = new THREE.ShaderMaterial({
		fragmentShader : texturedCloudsFrag,
		vertexShader   : texturedCloudsVert,
		uniforms: {
			elapsedTime  : {type : 'f',   value : 0.0},
			center       : {type : 'v3',  value : new THREE.Vector3(0, 0, 0)},
			texture      : {type : 't',   value : textureCloudsTexture},
			highColor    : {type : 'c',   value: new THREE.Color( 0x3E323B )},
			lowColor     : {type : 'c',   value: new THREE.Color( 0x000209 )},
			tendrilColor : {type : 'c',   value: new THREE.Color( 0xFF0000 )},

			aux          : {type : 'f',   value : 1.0},
			aux2         : {type : 'f',   value : 1.0},
		},
		transparent     : true,
		depthWrite      : false,
		depthTest       : false,
		blending        : THREE.AdditiveBlending
	});
	texturedClouds.children[0].scale.y = 0.2;
	texturedClouds.children[0].scale.x = 2.0;
	texturedClouds.children[0].scale.z = 2.0;
	texturedClouds.children[0].material = textureCloudsMaterial;
	


	// Volumetric clouds
	var cloudScale = 1.0/8.0;
	var scaler = new THREE.Vector3(cloudScale, cloudScale, cloudScale);
	var spiralCloud  = buildCloud(THEW.spiralCloudMesh.children[0].geometry, 0.1, scaler);
	var darkCloud = buildCloud(THEW.darkCloudMesh.children[0].geometry, 0.01, scaler);



	galaxy.add(hazeGlow);
	galaxy.add(pointStarCloud);
	galaxy.add(spiralStarPointCloud);
	galaxy.add(texturedClouds);
	galaxy.add(spiralCloud);
	// galaxy.add(darkCloud);








	function update(deltaTime) {
		dt = deltaTime * params.timeScale;
		et += dt;

		pixelRatio  = (window.devicePixelRatio) ? window.devicePixelRatio : 1.0;
		aspectRatio = window.innerHeight / 2000.0;

		// var rad = 3.0;
		// butt.galaxy.position.set(Math.sin(clock.elapsedTime)*rad,0,Math.cos(clock.elapsedTime)*rad);

		// UNIFORMS
		bindGalaxyUniforms();
		bindPointStarUniforms();
		bindTextureCloudsUniforms();
		bindVolumetricCloudUniforms(spiralCloud, 0.0, 112.5);
		bindVolumetricCloudUniforms(darkCloud, params.aux*50.0, params.aux2*50.0);
	}


	function bindGalaxyUniforms() {
		// hazeMaterial.uniforms.cameraPosition.copy(camera.position);
		hazeMaterial.uniforms.elapsedTime.value = et;
		hazeMaterial.uniforms.soften.value      = params.soften;
		hazeMaterial.uniforms.squash0.value     = params.squash0;
		hazeMaterial.uniforms.squash1.value     = params.squash1;
		hazeMaterial.uniforms.squash2.value     = params.squash2;
		hazeMaterial.uniforms.radius1.value     = params.radius1;
		hazeMaterial.uniforms.radius2.value     = params.radius2;
		hazeMaterial.uniforms.color0.value.setStyle(params.color0);
		hazeMaterial.uniforms.color1.value.setStyle(params.color1);
		hazeMaterial.uniforms.color2.value.setStyle(params.color2);
		hazeMaterial.uniforms.c.value.copy(butt.galaxy.position);

		hazeMaterial.uniforms.aux.value = params.aux;
	}

	function bindPointStarUniforms() {
		pointStarMaterial.uniforms.elapsedTime.value  = et;
		pointStarMaterial.uniforms.minSize.value      = params.minSize;
		pointStarMaterial.uniforms.maxBokehSize.value = params.maxBokehSize;
		pointStarMaterial.uniforms.pixelRatio.value   = pixelRatio;
		pointStarMaterial.uniforms.aspectRatio.value  = aspectRatio;
		pointStarMaterial.uniforms.dofCurve.value     = params.dofCurve;
		pointStarMaterial.uniforms.alpha.value        = params.alpha;
		pointStarMaterial.uniforms.texture.value      = starTex;
		pointStarMaterial.uniforms.center.value.copy(butt.galaxy.position);
		pointStarMaterial.uniforms.focalPoint.value.copy(params.focalPoint);

		pointStarMaterial.uniforms.aux.value = params.aux;
	}

	function bindTextureCloudsUniforms() {
		textureCloudsMaterial.uniforms.elapsedTime.value = et;
		// textureCloudsMaterial.uniforms.highColor.value.setStyle(params.highColor);
		textureCloudsMaterial.uniforms.tendrilColor.value.setStyle(params.highColor);

		textureCloudsMaterial.uniforms.aux.value = params.aux;
		textureCloudsMaterial.uniforms.aux2.value = params.aux2;
	}

	function bindVolumetricCloudUniforms(cloud, minSize, maxSize) {
		var uniforms = cloud.material.uniforms;
		uniforms.pixelRatio.value  = pixelRatio;
		uniforms.aspectRatio.value = aspectRatio;
		uniforms.lightCurve.value = params.lightCurve;
		uniforms.minSize.value = minSize;
		uniforms.maxSize.value = maxSize;

		uniforms.aux.value = params.aux;
		uniforms.aux2.value = params.aux2;

		// uniforms.highColor.value.setStyle(params.highColor);
		// uniforms.lowColor.value.setStyle(params.lowColor);
		// uniforms.distColor.value.setStyle(params.distColor);

		var angles = cloud.material.attributes.angle.value;
		var vertexCount = cloud.geometry.vertices.length / 3;
		for (var v=0; v < vertexCount; v++) {
			angles[v] = et;
		}
		cloud.material.attributes.angle.needsUpdate = true;
	}





	function buildCloud(geometry, inset, scale) {

		var cloudSpriteAttributes = {
			angle      : {type : 'f',  value : []},
			hackNormal : {type : 'v3', value : []}
		};

		var volumetricCloudMaterial = new THREE.ShaderMaterial({
			fragmentShader : ditheredSpriteFrag,
			vertexShader   : ditheredSpriteVert,
			uniforms       : {
				elapsedTime : {type : 'f',   value : 0.0},
				pixelRatio  : {type : 'f',   value : 0.0},
				aspectRatio : {type : 'f',   value : 0.0},
				center      : {type : 'v3',  value : new THREE.Vector3(0, 0, 0)},
				texture     : {type : 't',   value : ditheredSpriteTexture},
				bayer       : {type : 't',   value : bayerTexture},
				highColor   : {type : 'c',   value: new THREE.Color( 0x91758A )},
				lowColor    : {type : 'c',   value: new THREE.Color( 0x2F1616 )},
				distColor   : {type : 'c',   value: new THREE.Color( 0x04092D )},
				minSize     : {type : 'f',   value : 1.0},
				maxSize     : {type : 'f',   value : 1.0},
				lightCurve  : {type : 'f',   value : 1.0},

				aux         : {type : 'f',   value : 1.0},
				aux2        : {type : 'f',   value : 1.0},
			},
			attributes     : cloudSpriteAttributes,
			transparent    : false,
		});
		
		var positions = geometry.attributes.position.array;
		var normals   = geometry.attributes.normal.array;
		var numPositions = positions.length;
		var pointsGeometry = new THREE.Geometry();
		for (var v=0; v<numPositions; v+=3) {
			var vec = new THREE.Vector3(
				(positions[v]   + normals[v]   * rand(0.0, -1.0) * inset) * scale.x,
				(positions[v+1] + normals[v+1] * rand(0.0, -1.0) * inset) * scale.y,
				(positions[v+2] + normals[v+2] * rand(0.0, -1.0) * inset) * scale.z
			);
			pointsGeometry.vertices.push(vec);
		}

		var nAttr = cloudSpriteAttributes.hackNormal.value;
		var numNormals = geometry.attributes.normal.array.length / 3;
		for (var n=0; n<numNormals; n++) {
			nAttr[n] = new THREE.Vector3(normals[n*3], normals[n*3+1], normals[n*3+2]);
		}
		cloudSpriteAttributes.hackNormal.needsUpdate = true;

		return new THREE.PointCloud(pointsGeometry, volumetricCloudMaterial);
	}


	function rand(min, max) {
		return rng() * (max - min) + min;
	}

	function randNormal() {
		return (rng() + rng() - 1.0) / 1.0;
	}

	function randInt(min, max) {
	  return Math.floor(rng() * (max - min)) + min;
	}



	butt.update = update;
	butt.galaxy = galaxy;
	butt.params = params;

	return butt;
}




// RESOURCE LOADING CRAP
THEW.load = function(callback) {
	var shaderPaths = [
		'Shaders/galaxy.vert',
		'Shaders/galaxy.frag',
		'Shaders/pointStar.vert',
		'Shaders/pointStar.frag',
		'Shaders/ditheredSprite.vert',
		'Shaders/ditheredSprite.frag',
		'Shaders/texturedClouds.vert',
		'Shaders/texturedClouds.frag',
	];

	var failed               = false;
	var basicCloudLoaded     = false;
	var texturedCloudsLoaded = false;
	var spiralCloudsLoaded     = false;
	var darkCloudsLoaded    = false;
	var shadersLoaded        = false;

	function tryFinish() {
		if (failed) {
			console.warn('RESOURCE LOADING ABORTED');
			return;
		}
		if (shadersLoaded && basicCloudLoaded && texturedCloudsLoaded && spiralCloudsLoaded && darkCloudsLoaded) {
			callback();
		}
	}

	function failure() {
		failed = true;
		tryFinish();
	}


	var objLoader = new THREE.OBJLoader();
	objLoader.load(
		'Meshes/BasicCloud.obj',
		// 'Meshes/Cube.obj',
		function(parsedObj) {
			console.log('Loaded BasicCloud succesfully');
			THEW.basicCloud = parsedObj;
			basicCloudLoaded = true;
			tryFinish();
		},
		function() {},
		failure
	);

	objLoader.load(
		'Meshes/TexturedClouds.obj',
		function(parsedObj) {
			console.log('Loaded TexturedClouds succesfully');
			THEW.texturedClouds = parsedObj;
			texturedCloudsLoaded = true;
			tryFinish();
		},
		function() {},
		failure
	);

	objLoader.load(
		'Meshes/GalaxySpiral.obj',
		function(parsedObj) {
			console.log('Loaded GalaxySpiral succesfully');
			THEW.spiralCloudMesh = parsedObj;
			spiralCloudsLoaded = true;
			tryFinish();
		},
		function() {},
		failure
	);

	objLoader.load(
		'Meshes/GalaxyDarkClouds.obj',
		function(parsedObj) {
			console.log('Loaded GalaxyDarkClouds succesfully');
			THEW.darkCloudMesh = parsedObj;
			darkCloudsLoaded = true;
			tryFinish();
		},
		function() {},
		failure
	);


	//Heavily modified from resources.js
	function getResourceLoadCommand( shaderPaths ){
		var commands = [];
		for( var i in shaderPaths ){
			commands.push( $.get( shaderPaths[i] ) );
		}
		console.log( shaderPaths );
		return commands;
	}

	var resourceCommands = getResourceLoadCommand(shaderPaths);
	$.when.apply( this, resourceCommands )
	.done( function(){
	//  todo:
	//  handle failure cases

	var loadedShaderDict = {};
		//  Warning: this breaks if less than two shaderPaths loaded...
		for( var i in arguments ){
			if( shaderPaths[i] === undefined ){
				continue;
			}
			var filename = shaderPaths[i];
			console.log( '..loaded', filename );
			if( shaderPaths.length === 1 ){
				loadedShaderDict[ filename ] = arguments[0];
			}
			else{
				loadedShaderDict[ filename ] = arguments[i][0];
			}
		}

		console.log('Loaded shaders successfully');
		THEW.shaders = loadedShaderDict;
		shadersLoaded = true;
		tryFinish();
	})
	.fail(function(){
		console.warn('FAILED TO LOAD SHADERS');
		console.log(arguments);
		failure();
	});
};