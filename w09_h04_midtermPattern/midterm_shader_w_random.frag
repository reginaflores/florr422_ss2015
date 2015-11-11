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

float random (in float _x) {
    return fract(sin(_x)*1.);
}


void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  vec3 color = vec3(0.0);
  
  vec2 i_st = floor(st);
  vec2 f_st = fract(st);
    
  float time = floor(u_time*4.);
  float pct = random(time+i_st.x);
  // Remap the space to -1. to 1.
  st = st *2.-1.;
  st *= 10.;

  vec2 st_f = fract(st);
  float pct2 = triangle(st_f);
  pct *= pct2;

  color = vec3(smoothstep(1.,.1,pct));
  color += sin(st.x*cos(u_time/360.0))+cos(st.y * cos(u_time));
  color += sin(st.x * sin(u_time)) + sin( st.y * sin( u_time ));
  color += vec3(step(pct,f_st.y)-step(.9,f_st.x), .5, 0.3);
  
  gl_FragColor = vec4(color,1.);
}