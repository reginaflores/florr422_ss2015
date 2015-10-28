#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


float triangle(vec2 st){
  float d = 0.0;

  // Number of sides of your shape
  int N = 3;

  // Angle and radius from the current pixel
  float a = atan(st.x,st.y)+PI;
  float r = TWO_PI/float(N);
  
  // Shaping function that modulate the distance
  d = cos(floor(.5+a/r)*r-a)*length(st);

  return d;
}

float circleFun(vec2 st){
    float pct = 0.0;
    // a. The DISTANCE from the pixel to the center
    pct = 2.*distance(st,vec2(0.5));
    pct = 2.0*pct;
    pct = smoothstep(0.9, 1.0, pct);

    return pct;
}

void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  vec3 color = vec3(0.0);

  st.x *= u_resolution.x/u_resolution.y;
  // Remap the space to -1. to 1.
  // st = st *2.-1.;
  st *= 20.;

  vec2 st_f = fract(st);
  float a = 0.5+sin(u_mouse.x*0.01)*0.5;
  
  float pct = triangle(st_f);
  float cir = circleFun(st_f);
  pct *= cir*a; 

  color = 1. - vec3(smoothstep(.4,.41,pct));
  gl_FragColor = vec4(color,1.0);
}