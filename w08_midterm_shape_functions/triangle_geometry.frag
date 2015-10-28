#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


float shape(vec2 st, int N){
  float d = 0.0;

  // Number of sides of your shape
  // int N = 3;

  // Angle and radius from the current pixel
  float a = atan(st.x,st.y)+PI;
  float r = TWO_PI/float(N);
  
  // Shaping function that modulate the distance
  d = cos(floor(.5+a/r)*r-a)*length(st);

  return d;
}


void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st.x *= u_resolution.x/u_resolution.y;
  // Remap the space to -1. to 1.
  st = st *2.-1.;

  vec3 color = vec3(0.0);
  
  	float y = shape(st, 3);
	float y1 = shape(st, 4);
    float y2 = shape(st, 5);

 	color = 1.-vec3(1.0-smoothstep(.4,.41,y));
 	color *= 1.-vec3(1.0-smoothstep(.4,.41,y1));
 	color *= 1.-vec3(1.0-smoothstep(.4,.41,y2));


    // color = vec3(y*abs(sin(u_time)), y1-abs(sin(u_time*2.)), y2*abs(sin(u_time*3.)));

  gl_FragColor = vec4(color,1.0);
}