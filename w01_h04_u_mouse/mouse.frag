#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;

void main() {
	vec2 mouse = gl_FragCoord.xy/u_mouse;
	mouse.x = 1.0-mouse.x; 
	mouse.y = 1.0-mouse.y; 
	gl_FragColor = vec4(mouse.x,mouse.y,1.0,1.0);
}