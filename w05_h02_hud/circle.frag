
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float circle(vec2 st){
    float pct = 0.0;
    pct = distance(st,vec2(0.5));

    pct = 2.0*pct;
    pct = smoothstep(0.7, 0., pct);
    return pct;
}

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution;
    
    vec3 color = vec3(circle(st))*2.*sin(u_time);

	gl_FragColor = vec4(color, 0.3 );
}