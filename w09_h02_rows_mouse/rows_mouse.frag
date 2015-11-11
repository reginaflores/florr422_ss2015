#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float system_time = u_time + 0.0;

float random (in float x) {
    return fract(sin(x)*1e4);
}

float random (in vec2 st) { 
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}


void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
	vec3 color = vec3(0.);

    st *= vec2(50.,10.); //50 cols and 10 rows
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);
    float time = floor(u_time);
    float pct = random(time);

   	color = vec3(step(pct,f_st.y)-step(.1,f_st.x));
    color += vec3(u_mouse.x/u_resolution.x);
    gl_FragColor = vec4(color,1.0);
}



