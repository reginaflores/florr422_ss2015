
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float system_time = u_time + 0.0;

float random (in float _x) {
    return fract(sin(_x)*1.);
}


void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    // vec3 color = vec3(0.);
//     st.x *= u_resolution.x/u_resolution.y;
    st *= vec2(50.,2.); //50 cols and 2 rows
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);
    
    float time = floor(u_time*4.);
    float pct = random(time+i_st.x); //move left

    // if(system_time <= 40.){
    //     time*= 2.;
    // }
    // if(system_time <= 45.){
    //     time*= 8.;
    // }


    if(i_st.y == 1.){
          pct = random(time-i_st.x); //move right
    }
    
    vec3 color = vec3(st,step(pct,f_st.y)-step(.9,f_st.x));
         // color += vec3(st,step(pct2,f_st.y)-step(.7,f_st.x));


    gl_FragColor = vec4(color,1.0);
}