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
   
    
    //Iteration #1:
    // pct = distance(st,vec2(0.4)) + distance(st,vec2(0.6))*sin(u_time);

    //Iteration #2:
    // pct = min(distance(st,vec2(0.4)),distance(st,vec2(0.6)))*2.*cos(u_time*2.);

    //Iteration #3:
    pct = pow(sin(u_time)*distance(st,vec2(0.4)),distance(st,vec2(0.6)));
    
    pct = 2.0*pct;
    pct = smoothstep(0.9, 1.0, pct);

    return pct;
}


void main(){
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec2 st2 = gl_FragCoord.xy/u_resolution;
    
    float myFun = circleFun(st);
    float myFun2 = circleFun(st2*.8);

    vec3 color = vec3(0.8, myFun - myFun2, 0.8);

	gl_FragColor = vec4(color, 1.0 );
}


