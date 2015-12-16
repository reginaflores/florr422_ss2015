window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
                return window.setTimeout(callback, 1000/60);
         };
})();

var map = (function () {
    'use strict';

    //Defaut to Crown Heights Location:
    //654 Park Place, Brooklyn, NY
    //40.6738101, -73.9584195
    // 40.70531887544228, -74.00976419448853
    var map_start_location = [40.7310, -73.9001 , 13.08];


    
    var style_file = 'styles/pointCloudBuildingsFINAL2.yaml';

    /*** Map ***/
    var map = L.map('map', {
        maxZoom: 20,
        trackResize: true,
        keyboard: false
});

var layer = Tangram.leafletLayer({
    scene: style_file,

});

window.layer = layer;
var scene = layer.scene;
window.scene = scene;

map.setView(map_start_location.slice(0, 2), map_start_location[2]);
var hash = new L.Hash(map);

// Resize map to window
function resizeMap() {
    document.getElementById('map').style.width = window.innerWidth + 'px';
    document.getElementById('map').style.height = window.innerHeight + 'px';
    map.invalidateSize(false);
}

window.addEventListener('resize', resizeMap);
resizeMap();

window.addEventListener('load', function () {
    // Scene initialized
    layer.addTo(map);
    renderCanvas();
});

//disable mousewheel zoom if iframed
if (window.self !== window.top) {
  map.scrollWheelZoom.disable();
}
return map;


var camera, 
    tick = 0,
    scene, 
    renderer, 
    clock = new THREE.Clock(true),
    controls, 
    container, //gui = new dat.GUI(),
    options, 
    spawnerOptions, 
    particleSystem;

    init();
    animate();

    function init() {


      container = document.createElement('div');
      document.body.appendChild(container);

      camera = new THREE.PerspectiveCamera(28, window.innerWidth / window.innerHeight, 1, 10000);
      camera.position.z = 100;

      scene = new THREE.Scene();

      // The GPU Particle system extends THREE.Object3D, and so you can use it
      // as you would any other scene graph component.  Particle positions will be
      // relative to the position of the particle system, but you will probably only need one
      // system for your whole scene
      particleSystem = new THREE.GPUParticleSystem({
        maxParticles: 250000
      });
      scene.add( particleSystem);


      // options passed during each spawned
      options = {
        position: new THREE.Vector3(),
        positionRandomness: .3,
        velocity: new THREE.Vector3(),
        velocityRandomness: .5,
        color: 0xaa88ff,
        colorRandomness: .2,
        turbulence: .5,
        lifetime: 2,
        size: 5,
        sizeRandomness: 1
      };

      spawnerOptions = {
        spawnRate: 15000,
        horizontalSpeed: 1.5,
        verticalSpeed: 1.33,
        timeScale: 1
      }

      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      // setup controls
      controls = new THREE.TrackballControls(camera, renderer.domElement);
      controls.rotateSpeed = 5.0;
      controls.zoomSpeed = 2.2;
      controls.panSpeed = 1;
      controls.dynamicDampingFactor = 0.3;


    }

    function animate() {

      requestAnimationFrame(animate);

      controls.update();

      var delta = clock.getDelta() * spawnerOptions.timeScale;
      tick += delta;

      if (tick < 0) tick = 0;

      if (delta > 0) {
        options.position.x = Math.sin(tick * spawnerOptions.horizontalSpeed) * 20;
        options.position.y = Math.sin(tick * spawnerOptions.verticalSpeed) * 10;
        options.position.z = Math.sin(tick * spawnerOptions.horizontalSpeed + spawnerOptions.verticalSpeed) * 5;

        for (var x = 0; x < spawnerOptions.spawnRate * delta; x++) {
          // Yep, that's really it.  Spawning particles is super cheap, and once you spawn them, the rest of
          // their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
          particleSystem.spawnParticle(options);
        }
      }

      particleSystem.update(tick);

      render();

    }

    function render() {

      renderer.render(scene, camera);

    }


}());






  // GUI options for rendering style/effects
    // var style_options = {
    //     // effect: '',
    //     // options: {
    //     //     // 'None': '',
    //     //     // 'Water animation': 'water',
    //     //     // 'Elevator': 'elevator',
    //     //     // 'Pop-up': 'popup',
    //     //     // 'Halftone': 'halftone',
    //     //     // 'Windows': 'windows',
    //     //     // 'Environment Map': 'envmap',
    //     //     // 'Rainbow': 'rainbow'
    //     },
    //     saveInitial: function() {
    //         this.initial = { config: JSON.stringify(scene.config) };
    //     },
    //     setup: function (style) {
    //         // Restore initial state
    //         scene.config = JSON.parse(this.initial.config);

    //         // Remove existing style-specific controls
    //         gui.removeFolder(this.folder);

    //         // Style-specific settings
    //         if (style != '') {
    //             if (this.settings[style] != null) {
    //                 var settings = this.settings[style] || {};

    //                 // Change projection if specified
    //                 // if (settings.camera) {
    //                 //     scene.setActiveCamera(settings.camera);
    //                 // }

    //                 // Style-specific setup function
    //                 if (settings.setup) {
    //                     settings.uniforms = function() {
    //                         return scene.styles[style] && scene.styles[style].shaders.uniforms;
    //                     };
    //                     settings.state = {}; // dat.gui needs a single object to old state

    //                     this.folder = style[0].toUpperCase() + style.slice(1); // capitalize first letter
    //                     settings.folder = gui.addFolder(this.folder);
    //                     settings.folder.open();

    //                     settings.setup(style);

    //                     if (settings.folder.__controllers.length === 0) {
    //                         gui.removeFolder(this.folder);
    //                     }
    //                 }
    //             }
    //         }

    //         // Recompile/rebuild
    //         scene.updateConfig({ rebuild: true });
    //         updateURL();

    //         // Force-update dat.gui
    //         for (var i in gui.__controllers) {
    //             gui.__controllers[i].updateDisplay();
    //         }
    //     },
    //     settings: {
    //         'water': {
    //             setup: function (style) {
    //                 scene.config.layers.water.draw.polygons.style = style;
    //             }
    //         },
    //         'rainbow': {
    //             setup: function (style) {
    //                 scene.config.layers.earth.draw.polygons.color = '#333';
    //                 scene.config.layers.roads.draw.lines.color = '#777';
    //                 scene.config.layers.poi_icons.visible = false;
    //                 scene.config.layers.buildings.draw.polygons.style = style;
    //                 scene.config.layers.buildings.extruded.draw.polygons.style = style;
    //             }
    //         },
    //         'popup': {
    //             setup: function (style) {
    //                 scene.config.layers.buildings.extruded.draw.polygons.style = style;
    //             }
    //         },
    //         'elevator': {
    //             setup: function (style) {
    //                 scene.config.layers.buildings.extruded.draw.polygons.style = style;
    //             }
    //         },
    //         'halftone': {
    //             setup: function (style) {
    //                 scene.config.scene.background.color = 'black';

    //                 var layers = scene.config.layers;
    //                 layers.earth.draw.polygons.style = 'halftone_polygons';
    //                 layers.water.draw.polygons.style = 'halftone_polygons';
    //                 // layers.water.outlines.draw.lines.style = 'halftone_lines';
    //                 layers.landuse.draw.polygons.style = 'halftone_polygons';
    //                 layers.buildings.draw.polygons.style = 'halftone_polygons';
    //                 layers.buildings.extruded.draw.polygons.style = 'halftone_polygons';
    //                 layers.buildings.draw.polygons.color = 'Style.color.pseudoRandomColor()';
    //                 layers.roads.draw.lines.style = 'halftone_lines';
    //                 layers.poi_icons.visible = false;

    //                 var visible_layers = ['landuse', 'water', 'roads', 'buildings'];
    //                 Object.keys(layers).forEach(function(l) {
    //                     if (visible_layers.indexOf(l) === -1) {
    //                         layers[l].visible = false;
    //                     }
    //                 });
    //             }
    //         },
    //         'windows': {
    //             camera: 'isometric', // force isometric
    //             setup: function (style) {
    //                 scene.config.layers.earth.draw.polygons.color = '#333';
    //                 scene.config.layers.roads.draw.lines.color = '#777';
    //                 scene.config.layers.poi_icons.visible = false;

    //                 scene.config.layers.buildings.draw.polygons.style = style;
    //                 scene.config.layers.buildings.extruded.draw.polygons.style = style;
    //                 // scene.config.layers.pois.visible = false;
    //             }
    //         },
    //         'envmap': {
    //             setup: function (style) {
    //                 scene.config.layers.earth.draw.polygons.color = '#333';
    //                 scene.config.layers.roads.draw.lines.color = '#777';

    //                 scene.config.layers.buildings.draw.polygons.style = style;
    //                 scene.config.layers.buildings.extruded.draw.polygons.style = style;

    //                 var envmaps = {
    //                     'Sunset': window.location.origin+window.location.pathname+'demos/images/sunset.jpg',
    //                     'Chrome': window.location.origin+window.location.pathname+'demos/images/LitSphere_test_02.jpg',
    //                     'Matte Red': window.location.origin+window.location.pathname+'demos/images/matball01.jpg',
    //                     'Color Wheel': window.location.origin+window.location.pathname+'demos/images/wheel.png'
    //                 };

    //                 this.state.envmap = scene.styles.envmap.material.emission.texture;
    //                 this.folder.add(this.state, 'envmap', envmaps).onChange(function(value) {
    //                     scene.styles.envmap.material.emission.texture = value;
    //                     scene.requestRedraw();
    //                 }.bind(this));
    //             }
    //         }
    //     },
    //     scaleColor: function (c, factor) { // convenience for converting between uniforms (0-1) and DAT colors (0-255)
    //         if ((typeof c == 'string' || c instanceof String) && c[0].charAt(0) == "#") {
    //             // convert from hex to rgb
    //             var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c);
    //             c = result ? [
    //                 parseInt(result[1], 16),
    //                 parseInt(result[2], 16),
    //                 parseInt(result[3], 16)
    //             ] : null;
    //         }
    //         return [c[0] * factor, c[1] * factor, c[2] * factor];
    //     }
    // };

    // Create dat GUI
    var gui = new dat.GUI({ autoPlace: true });
    function addGUI () {
        gui.domElement.parentNode.style.zIndex = 10000;
        window.gui = gui;

        // Add ability to remove a whole folder from DAT.gui
        gui.removeFolder = function(name) {
            var folder = this.__folders[name];
            if (folder == null) {
                return;
            }

            folder.close();
            folder.__ul.parentNode.removeChild(folder.__ul);
            this.__folders[name] = undefined;
            this.onResize();
        };

        // Camera
        // var camera_types = {
        //     'Flat': 'flat',
        //     'Perspective': 'perspective',
        //     'Isometric': 'isometric'
        // };
        // gui.camera = scene.getActiveCamera();
        // gui.add(gui, 'camera', camera_types).onChange(function(value) {
        //     scene.setActiveCamera(value);
        //     scene.updateConfig();
        // });

        // Feature selection on hover
        // gui['feature info'] = true;
        // gui.add(gui, 'feature info');

        // Screenshot
        // gui.screenshot = function () {
        //     gui.queue_screenshot = true;
        //     scene.requestRedraw();
        // };
        // gui.add(gui, 'screenshot');

        // Layers
        var layer_gui = gui.addFolder('Layers');
        var layer_controls = {};
        Object.keys(layer.scene.config.layers).forEach(function(l) {
            if (!layer.scene.config.layers[l]) {
                return;
            }

            layer_controls[l] = !(layer.scene.config.layers[l].visible == false);
            layer_gui.
                add(layer_controls, l).
                onChange(function(value) {
                    layer.scene.config.layers[l].visible = value;
                    layer.scene.rebuildGeometry();
                });
        });

        // Styles
        gui.add(style_options, 'effect', style_options.options).
            onChange(style_options.setup.bind(style_options));

        // Link to edit in OSM - hold 'e' and click
        window.addEventListener('click', function () {
            // if (key.isPressed('e')) {
            if (key.shift) {
                var url = 'https://www.openstreetmap.org/edit?';

                if (scene.selection.feature && scene.selection.feature.id) {
                    url += 'way=' + scene.selection.feature.id;
                }

                if (scene.center) {
                    url += '#map=' + scene.baseZoom(scene.zoom) + '/' + scene.center.lat + '/' + scene.center.lng;
                }

                window.open(url, '_blank');
            }
        });
    }

/***** Render loop *****/
window.addEventListener('load', function () {
    // Scene initialized
    layer.on('init', function() {
        addGUI();

        style_options.saveInitial();
        if (url_style) {
            style_options.setup(url_style);
        }
        updateURL();

        initFeatureSelection();
    });
    layer.addTo(map);

    if (osm_debug == true) {
        window.osm_layer =
            L.tileLayer(
                'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                // 'https://stamen-tiles.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}.jpg',
                {
                    maxZoom: 19//,
                    // opacity: 0.5
                })
            .addTo(map);
            // .bringToFront();
    }

    layer.bringToFront();
});


