#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st.x *= u_resolution.x/u_resolution.y;
  vec3 color = vec3(0.0);
  float d = 0.0;

  // Remap the space to -1. to 1.
  st = st *2.-1.;

  // Make the distance field
  d = length( abs(st)-.0 )*cos(u_time)/2.;

  color = vec3(fract(d*10.0));
  color += vec3(0.32, .1, .892);
  // Visualize the distance field
  gl_FragColor = vec4(color,1.);

  
}