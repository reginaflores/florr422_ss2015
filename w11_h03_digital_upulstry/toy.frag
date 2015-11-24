
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_tex0;
uniform vec2 u_tex0Resolution;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


float random (in float x) {
    return fract(sin(x)*1e4);
}
vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

//Use 03.jpg
void main () {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st = st + 0.5;
    vec4 color = vec4(st.x,st.y,0.0,1.0);

    vec2 offset = vec2(0.);
    
    vec2 st_f = fract(st);
    vec2 st_i = floor(st*10.);
    
    offset.x = u_time*random(st_i.y);
    color.r = texture2D(u_tex0,st+offset).r;
    offset.x = u_time*0.8*random(st_i.y);
    color.g = texture2D(u_tex0,noise(st*u_mouse)+offset).g;
    offset.x = u_time*0.5*random(st_i.y);
    color.b = texture2D(u_tex0,st*u_mouse+offset).b;

    gl_FragColor = color;
}