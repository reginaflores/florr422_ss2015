
// Keep track of the mouse
var mouse = {x: 0, y: 0};
document.addEventListener('mousemove', function(e){ 
    mouse.x = e.clientX || e.pageX; 
    mouse.y = e.clientY || e.pageY 
}, false);

/**
 * Provides requestAnimationFrame in a cross browser way.
 */
window.requestAnimFrame = (function() {
	return	window.requestAnimationFrame ||
	    	window.webkitRequestAnimationFrame ||
	    	window.mozRequestAnimationFrame ||
	    	window.oRequestAnimationFrame ||
	    	window.msRequestAnimationFrame ||
	    	function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
	        	return window.setTimeout(callback, 1000/60);
	     };
})();

var billboards = []; 
function load_all_GlslCanvas() {
	var list = document.getElementsByTagName("canvas");

	// Load shaders on canvas
	for(var i = 0; i < list.length; i++){
		var sandbox = new GlslCanvas(list[i]);
		if (sandbox.isValid) {
			billboards.push(sandbox);
		}
	}
}

function render_all_GlslCanvas(){
	for(var i = 0; i < billboards.length; i++){
		billboards[i].setMouse(mouse);
		billboards[i].render();
	}
	window.requestAnimFrame(render_all_GlslCanvas);
}

window.onload = function () { 
	load_all_GlslCanvas();
	render_all_GlslCanvas(); 
};