#ifdef GL_ES
precision mediump float;
#endif

const float PI = 3.14159265;


uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (vec2 st) { 
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*43758.5453123);
}

float noise (vec2 st) {
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

   float A = random(i_st);
   float B = random(i_st+vec2(1., 0.));
   float C = random(i_st+vec2(0., 1.));
   float D = random(i_st+vec2(1., 1.));

   f_st = smoothstep(vec2(0.), vec2(1.), f_st);

   return  mix(A, B, f_st.x)+
              (C-A)*f_st.y*(1.-f_st.x)+
              (D-B)*f_st.x*f_st.y;

}

float circle(in vec2 _st, in float _radius){
    vec2 l = _st-vec2(0.5);
  return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(l,l)*4.0);
}

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  
  vec3 color = vec3(circle(st,0.9));
  
  // color *= pow(noise(st),3.);
  color *= pow(noise(u_time*st),3.);

  gl_FragColor = vec4(1. - color, 1.0 );

}