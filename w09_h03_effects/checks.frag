
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// float plot(vec2 _st, float _pct){
//   return  smoothstep( _pct-0.01, _pct, _st.y) - 
//           smoothstep( _pct, _pct+0.01, _st.y);
// }

float random (in float _x) {
    return fract(sin(_x)*1.);
}

float random(vec2 xy){
	return random(dot(xy, vec2(12.34,56.78)));
    
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
//     st.x *= u_resolution.x/u_resolution.y;
    st *= vec2(10.); //50 cols and 2 rows
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);
    
    float time = floor(u_time*8.);
	float pct = random(i_st+vec2(0.,time)); //make a percentage
    
    vec3 color = vec3(pct);
	



    gl_FragColor = vec4(color,1.0);
}