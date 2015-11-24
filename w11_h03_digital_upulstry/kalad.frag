#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform sampler2D u_tex0;
uniform vec2 u_tex0Resolution;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

//With help from Patricio book examples:
// Based on Asalga shader
// https://www.shadertoy.com/view/4ss3WX


//USE WITH 02.JPG
void main () {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    float time = u_time*0.2;

    // move to the center
    st = st - 0.5;

    // cartesian to polar coordinates
    float r = length(st);
    float a = atan(st.y, st.x);

    // Repeat side acoriding to angle
    float ma = abs(mod(a, TWO_PI/100.) - PI/100.);

    // polar to cartesian coordinates
    st = r * vec2(cos(ma), sin(ma));
    st = fract(st+time);

    vec4 color = vec4(st.x,st.y,0.0,1.0);
    color = texture2D(u_tex0,st);

    gl_FragColor = color;
}