// Reference to
// http://thndl.com/square-shaped-shaders.html


#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;



void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  // st.x *= u_resolution.x/u_resolution.y;
  vec3 color = vec3(0.0);

  float d = 0.0;
  float d2 = 0.0;

  // Remap the space to -1. to 1.
  st = st * 2.-1.;

  // Number of sides of your shape
  int N = 3;

  // Angle and radius from the current pixel
  float a = atan(st.x,st.y)+PI;
  float r = TWO_PI/float(N);
  
  float f = cos(a*30.);

    // f = smoothstep(-.5,1., abs(cos(a*200.))+abs(sin(a*200.)))*.01/pow(r,2.);


  // Shaping function that modulate the distance
  d = cos(floor(.5+a/r)*r-a)*length(st);
  d2 = cos(floor(0.+a/r)*r-a)*length(st);

  color = vec3(1.0-smoothstep(.2,.21,d/2.))*vec3(0.,.0,.452)*sin(u_time);
  color += vec3(1.0-smoothstep(.2,.11,d/2.))*vec3(1., 0.3,0.4)*cos(u_time);
  color += vec3(1.0-smoothstep(0.,.11,d/2.))*vec3(1., 0.3,0.4)*sin(u_time);

  color += vec3(1.0-smoothstep(0.,.11,d2/2.))*vec3(1., 0.3,0.4)*sin(u_time);

  gl_FragColor = vec4(color,1.0);
}