#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

// Value Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/lsf3WH
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

float triangle(vec2 st){
  float d = 0.0;

  // Number of sides of your shape
  int N = 3;
  float n_st = noise(st);
  // Angle and radius from the current pixel
  float a = n_st*atan(st.x,st.y)+PI;
  float r = TWO_PI/float(N);
  float m = abs(mod(a+u_time*2.,PI*2.)-PI)/2.;
  m += noise(st*u_mouse+u_time*0.1)*2.;

  // Shaping function that modulate the distance
  d = cos(floor(.5+a/(m*r))*(m*r)-a)*length(st);

  return d;
}


void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st.x *= u_resolution.x/u_resolution.y;
  // Remap the space to -1. to 1.
  st = st *2.-1.;
  
  vec3 color = vec3(0.0);
  
  float tri = triangle(st);

  color = 1. - vec3(1.0-smoothstep(.4,.41,tri));
  color += vec3(.33,.23,.85);
  gl_FragColor = vec4(1.-color,1.0);
}