#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float random (in float x) {
    return fract(sin(x)*1e4);
}

float random (in vec2 st) { 
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

float pattern(vec2 st, vec2 v, float t) {
    vec2 p = floor(st+v);
    return step(t, random(100.+p*.000001)+random(p.x)*0.5 );
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.);

    st *= 20.0;      // Scale up the space by 20
    
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);
    
    
    vec2 vel = vec2(u_time*2.*st); // time
    vel *= vec2(-1.,0.0) * random(1.0+i_st.y); // direction

    // Assign a random value base on the integer coord
    vec2 offset = vec2(0.1,0.);

    color.r = pattern(st+offset,vel,0.5+u_mouse.x/u_resolution.x);
    color.g = pattern(st,vel,0.5+u_mouse.x/u_resolution.x);
    color.b = pattern(st-offset,vel,0.5+u_mouse.x/u_resolution.x);


	gl_FragColor = vec4(1. - color,1.0);
}


