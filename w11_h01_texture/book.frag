

// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform sampler2D u_tex0;
uniform vec2 u_tex0Resolution;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main () {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

//////////////////////////////////
//book questions:

//1: Scaling the previus texture by half.

    //float scale = 0.5;
    //st*=scale;
	//vec4 color = vec4(st.x,st.y,0.0,1.0);
    //color = texture2D(u_tex0,st);

//2: Rotating the previus texture 90 degrees.
	// st = rotate2d( 90. ) * st;	
	
	vec2 cord = vec2(st.x, -st.y);
 	vec4 color = vec4(st.x,st.y,0.0,1.0);
	color = texture2D(u_tex0,cord);

//3: Hooking the mouse position to the coordenates to move it.
	//vec2 cord = vec2(st.x*u_mouse.x, st.y);
 	//vec4 color = vec4(st.x,st.y,0.0,1.0);
	//color = texture2D(u_tex0,cord);


//////////////////////////////////
    gl_FragColor = color;
}