#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Reference to
// http://thndl.com/square-shaped-shaders.html

float rect(float pct){

  float final = step(0.9, pct) - step(.92, pct);
    float shadow = smoothstep(0.9, 0.4,pct) + step(.92, pct);
    final += (1.0-shadow)*0.4;

    return final;
}

void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  
  float pct = 0.0;
  
  st = st * 2. - 1.;
 
  //size of rect?
  pct = 1. - length(abs(st)-.3);
  pct = 1. - length(max(abs(st)-.3,0.));

  float fun = rect(pct);


  gl_FragColor = vec4(vec3(1.0 - fun),1.);


}