#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float plot(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y) - 
          smoothstep( pct, pct+0.02, st.y);
}

//Function taken from Golan Levin Flong
//http://www.flong.com/texts/code/shapers_circ/

float doubleCircleSeat (float x, float a){
  float min_param_a = 0.0;
  float max_param_a = 1.0;
  a = max(min_param_a, min(max_param_a, a)); 

  float y = 0.0;
  if (x<=a){
    y = sqrt(pow(a, 2.0) - pow(x-a, 2.0));
  } else {
    y = 1.0 - sqrt(pow(1.0 - a, 2.0) - pow(x - a, 2.0));
  }
  return y;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;

    // float y = smoothstep(0.1,0.9,st.x);
    float a = 0.5+sin(u_mouse.x*0.01)*0.5;
	float y = doubleCircleSeat(st.x,a);
    vec3 color = vec3(y);
    
    float pct = plot(st,y);
    color = (1.0-pct)*color+pct*vec3(1.0,0.0,0.0);

    gl_FragColor = vec4(color,1.0);
}