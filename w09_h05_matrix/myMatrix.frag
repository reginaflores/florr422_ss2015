
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random(float x){
    return fract(sin(x)*43758.5453);
}

float random(vec2 st){
    return fract(sin(dot(st.xy ,vec2(12.9898,78.233))) * 43758.5453);
}


void main(){
	vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.);

    //scale up the canvas
    st *= 30.;

    vec2 i_st = floor(st);
    vec2 i_ft = fract(st);

    // //gives the moving down movement
    i_st += vec2(.0,floor(u_time*15.*random(i_st.x)));

    //gives the check/noise effect
    float pct = random(i_st);
    color = vec3(pct);

    //gives the green and black look like the Matrix Movie
    color += vec3(0., 1., 0.)-1.;

	gl_FragColor = vec4(color,1.0);
}





