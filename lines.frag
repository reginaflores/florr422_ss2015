#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


float random (in float _x) {
    return fract(sin(_x)*40000.50);
}


void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.);

    st *= 10.;

    vec2 i_st = floor(st);
    vec2 f_st = fract(st);
    vec2 ipos = floor(st)+vec2(1.,0.);
    i_st += vec2(.0,floor(u_time*20.*random(ipos.x)));

    float time = floor(u_time);
    color = vec3(0., random(5.*time*i_st.y),0.);
	color *= vec3(0., random(u_time*f_st.x), 0.);
//     color *= vec3
    // st.y += 0.5;
//     color *= vec3(random(time*f_st.y));


    gl_FragColor = vec4(color,1.0);
}