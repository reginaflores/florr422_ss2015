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

float pattern(vec2 st, vec2 v, float t) {
    vec2 p = floor(st+v);
    return step(t, random(100.+p*.01)+random(p.x));
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
	vec3 color = vec3(0.);

    st *= vec2(50.,5.); //50 cols and 10 rows
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);
    float time = floor(u_time);
    float pct = random(time);

    color = vec3(st*0.9, step(pct,f_st.y)-step(.9,f_st.x));

    //borrow this from GLSL Shader Book
    vec2 vel = vec2(u_time*max(50.,5.)); // time
    vel *= vec2(1.,0.0) * random(0.5+i_st.y); // direction
	color.g = pattern(st,vel,0.5+u_mouse.x/u_resolution.x);
    //

    gl_FragColor = vec4(color,1.0);
}



