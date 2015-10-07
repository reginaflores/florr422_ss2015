// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution;
    float pct = 0.0;

    // a. The DISTANCE from the pixel to the center
    pct = distance(st,vec2(0.5));

    //invert the colors
    //pct = step(pct,0.5);

    pct = step(0.5, pct);
    pct = 1. - pct;
    vec3 color = vec3(pct);

	gl_FragColor = vec4( color, 1.0 );
}