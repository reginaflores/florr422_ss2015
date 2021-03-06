#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution; // Canvas size (width,height)
uniform vec2 u_mouse;      // mouse position in screen pixels
uniform float u_time;     // Time in seconds since load 

void main() {
	vec2 mouse = gl_FragCoord.xy/u_mouse;
	mouse.x = 1.0-mouse.x; 
	mouse.y = 1.0-mouse.y; 
	vec2 st = gl_FragCoord.xy/u_resolution;

	gl_FragColor = vec4(mouse.x,mouse.y,cos(u_time*mouse.y),1.0);


	// vec2 st = gl_FragCoord.xy/u_resolution;
	// vec2 mouse = 1.0+u_mouse;
	// gl_FragColor = vec4(sin(u_time**0.0005*mouse.x),cos(u_time*0.005*mouse.y),st.x,1.0);
}

