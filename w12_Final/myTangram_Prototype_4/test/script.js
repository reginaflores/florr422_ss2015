"use strict";

var undersample = 1.0;

var gui;

var dt;
var et = 0;

var clock;
var scene;
var camera;
var controls;
var renderer;
var stats;

var composer;
var hazePass;
var effectParams = {
	bloomEnabled     : true,
	applyZoomBlur    : true,
	blurAmount       : 0.18,
	zoomBlurStrength : 0.26
};

var galaxy;

THEW.load(resourcesLoaded);

function resourcesLoaded() {
	setup();
	run();
}


function setUpGui() {
	var params = galaxy.params;

	gui = new dat.GUI();
	gui.add(params, 'minSize').min(1.0).max(100.0);
	gui.add(params, 'maxBokehSize').min(0.1).max(1000.0);
	gui.add(params, 'dofCurve').min(1.0).max(5.0);
	// gui.add(params, 'soften').min(1.0).max(10.0);
	// gui.add(params, 'squash0').min(0.0).max(1.0);
	// gui.add(params, 'squash1').min(0.0).max(1.0);
	// gui.add(params, 'squash2').min(0.0).max(1.0);
	// gui.add(params, 'radius1').min(0.0).max(1.0);
	// gui.add(params, 'radius2').min(0.0).max(1.0);
	// gui.addColor(params, 'color0');
	// gui.addColor(params, 'color1');
	// gui.addColor(params, 'color2');
	gui.addColor(params, 'highColor');
	// gui.addColor(params, 'lowColor');
	// gui.addColor(params, 'distColor');
	// gui.addColor(params, 'color2');

	// gui.add(params, 'lightCurve').min(0.0).max(10.0);
	gui.add(params, 'aux').min(0.0).max(1.0);
	gui.add(params, 'aux2').min(0.0).max(1.0);
}


function setup() {
	clock = new THREE.Clock(true);
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 20, window.innerWidth/window.innerHeight, 0.1, 1000 );

	stats = new Stats();
	stats.setMode(0);
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';

	renderer = new THREE.WebGLRenderer({antialias:true, devicePixelRatio:1.0, premultipliedAlpha:true});
	renderer.setSize(window.innerWidth / undersample, window.innerHeight / undersample);
	renderer.setClearColor( 0x01011d, 1);
	// renderer.setClearColor( 0xFF0000, 1);
	document.body.appendChild(renderer.domElement);
	document.body.appendChild(stats.domElement);

	WAGNER.vertexShadersPath   = 'Extra/Wagner/vertex-shaders';
	WAGNER.fragmentShadersPath = 'Extra/Wagner/fragment-shaders';
	WAGNER.assetsPath          = 'Extra/Wagner/assets/'
	composer = new WAGNER.Composer(renderer, {useRGBA : false});
	composer.setSize(renderer.domElement.width, renderer.domElement.height);
	// hazePass = new WAGNER.GalaxyHazePass();

	camera.position.z = 4;
	
	controls = new THREE.OrbitControls( camera );
	
	window.addEventListener( 'resize', function () {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth / undersample, window.innerHeight / undersample );
		composer.setSize(renderer.domElement.width, renderer.domElement.height);

	}, false );

	galaxy = THEW.createGalaxy();
	scene.add(galaxy.galaxy);
	// scene.add(new THREE.AxisHelper(1.0));

	setUpGui();
}


function update() {
	controls.update();
	var rad = 1.0;
	// galaxy.galaxy.position.set(Math.sin(clock.elapsedTime)*rad,0,Math.cos(clock.elapsedTime)*rad);
	// galaxy.galaxy.rotation.y = clock.elapsedTime;
	// galaxy.galaxy.rotation.x = clock.elapsedTime;
	// galaxy.galaxy.position.set(0.4, 0.0, 0.0);
	galaxy.update(clock.getDelta());
}


function draw () {
	// composer.reset();
	// var gl = composer.renderer.context;
	// // console.log(gl);
	// gl.enable(gl.GL_SAMPLE_ALPHA_TO_COVERAGE);
	// // gl.enable(gl.GL_SAMPLE_ALPHA_TO_ONE);
	// composer.render(scene, camera);
	// // composer.pass(hazePass);
	// composer.toScreen();

	var gl = renderer.context;
	gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE);
	renderer.render(scene, camera);
	// console.log(gl.getParameter(gl.SAMPLES));
};


function run() {
	stats.begin();
	update();
	draw();
	stats.end();
	requestAnimationFrame(run);
}