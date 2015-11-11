#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float circleFun(vec2 st, float radius) {
    st -= .5;
    return 1.0-step(radius*.5,dot(st,st)*2.);
}

float random(float x){
    return fract(sin(x)*43758.5453);
}

float random(vec2 st){
    return fract(sin(dot(st.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.);

    st *= 30.0;      // Scale up the space by 10

    float d = distance(st, vec2(0.5));
    d = smoothstep(0.,1.,sin(d*3.14159*5.-u_time*5.));
    
    vec2 i_st = floor(st);
    vec2 st_f = fract(st);
   
    i_st += u_time*random(i_st.y);

    float pct = circleFun(st_f, d*1.);
    pct*= random(i_st);
    color += pct;
    color += vec3(0.8, 0.0, .53);

	gl_FragColor = vec4(color,1.0);
}


