#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float circle(in vec2 st, in float radius){
     st -= 0.5;
    return 1.-step(radius*.5,dot(st,st)*2.0);
}

float stripes(vec2 st){
    return step(st.y, st.x);
}

vec2 brick(vec2 st){
    vec2 st_i = floor(st); 
    return st_i;   
}

vec2 truchet(vec2 st){
    vec2 st_i = floor(st);
    if(mod(st_i.y,2.) == 1.){

        st.x-= 1.-st.x*cos(u_time);
    }
    if(mod(st_i.x,2.) == 1.){

        st.y-= 1.-st.y*sin(u_time);
    }
    return st;

}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.);

    st *= 10.0;      // Scale up the space by 10

    st = truchet(st*50.);

    vec2 st_f = fract(st);
    float pct = stripes(st_f);
    color += pct;

	gl_FragColor = vec4(color,1.0);
}


