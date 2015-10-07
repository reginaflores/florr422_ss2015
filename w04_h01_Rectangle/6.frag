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
  vec2 st2 = gl_FragCoord.xy/u_resolution.xy;
  vec2 st3 = gl_FragCoord.xy/u_resolution.xy;
  vec2 st4 = gl_FragCoord.xy/u_resolution.xy;
  vec2 st5 = gl_FragCoord.xy/u_resolution.xy;

  float pct = 0.0;
  float pct2 = 0.0;
  float pct3 = 0.0;
  float pct4 = 0.0;
  float pct5 = 0.0;

  st = st * 2. - 1.;
 
  //size of rect?
  pct = 1. - length(abs(st)-.3);
  pct = 1. - length(max(abs(st)-.3,0.));

  pct2 = 1. - length(abs(st2)-.3);
  pct2 = 1. - length(max(abs(st2)-.3,0.));

  pct3 = 1. - length(abs(st3)-.2);
  pct3 = 1. - length(max(abs(st3)-.2,0.));

  pct4 = 1. - length(abs(st4)-.5);
  pct4 = 1. - length(max(abs(st4)-.5,0.));

  pct5 = 1. - length(abs(st4)-.8);
  pct5 = 1. - length(max(abs(st4)-.8,0.));


  float fun = rect(pct);
  float fun2 = rect(pct2);
  float fun3 = rect(pct3);
  float fun4 = rect(pct4);
  float fun5 = rect(pct5);

  gl_FragColor = vec4(vec3(1.0 - fun - fun2 - fun3 - fun4 - fun5),1.);


}