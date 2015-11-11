
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


float random (in float _x) {
    return fract(sin(_x)*1.);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st *= 10. *u_mouse;
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);
    
    float time = floor(u_time);
	vec3 color = vec3(random(time*f_st.y),0. , 0.5);
    // st.y += 0.5;
    // color *= vec3(u_mouse.x/u_resolution.x);
    // color += vec3(0., u_mouse, 0.);

    gl_FragColor = vec4(color,1.0);
}