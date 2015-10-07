// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float circleFun(vec2 st){
    float pct = 0.0;
    // a. The DISTANCE from the pixel to the center
    pct = 2.*distance(st,vec2(0.5));
    pct = 2.0*pct;
    pct = smoothstep(0.9, 1.0, pct);

    return pct;
}


void main(){
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec2 st2 = gl_FragCoord.xy/u_resolution;
    
    float myFun = circleFun(st);
    float myFun2 = circleFun(st2*.8);

    vec3 color = vec3(.0, myFun - myFun2, 0.5);

	gl_FragColor = vec4(color, 1.0 );
}