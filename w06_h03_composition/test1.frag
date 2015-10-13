#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718
#define RS(a,b,x) ( smoothstep(a-1.0,a+1.0,x)*(1.0-smoothstep(b-1.0,b+1.0,x)) )
#define blue3 vec3(0.35,0.76,0.83)

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Reference to
// http://thndl.com/square-shaped-shaders.html

mat3 translationMatrix(vec2 f) {
    return mat3(vec3(1.0,0.0,0.0),
                vec3(0.0,1.0,0.0),
                vec3(f.x,f.y,1.0));
}


void translate(vec2 f, inout vec3 pos) {
    pos = translationMatrix(f) * pos;
}

mat3 rotationMatrix(float a) {
    return mat3(vec3(cos(a),-sin(a),0.0),
                vec3(sin(a),cos(a),0.0),
                vec3(0.0,0.0,1.0));
}

void rotate(float a, inout vec3 pos) {
    pos = rotationMatrix(a) * pos;
}

mat3 scaleMatrix(vec2 f) {
    return mat3(vec3(f.x,0.0,0.0),
                vec3(0.0,f.y,0.0),
                vec3(0.0,0.0,1.0));
}

void scale(in vec2 f, inout vec3 pos) {
    pos = scaleMatrix(f) * pos;
}

float triangles(vec2 st, vec2 center, float radius)
{
    vec2 d = st - center;
    return RS(-8.0, 0.0, d.x-radius) * (1.0-smoothstep( 7.0+d.x-radius,9.0+d.x-radius, abs(d.y)))
         + RS( 0.0, 8.0, d.x+radius) * (1.0-smoothstep( 7.0-d.x-radius,9.0-d.x-radius, abs(d.y)))
         + RS(-8.0, 0.0, d.y-radius) * (1.0-smoothstep( 7.0+d.y-radius,9.0+d.y-radius, abs(d.x)))
         + RS( 0.0, 8.0, d.y+radius) * (1.0-smoothstep( 7.0-d.y-radius,9.0-d.y-radius, abs(d.x)));
}

void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  vec3 pos = vec3(st,1.0);
  vec2 center = u_resolution.xy/2.0;

  // translate(vec2(-.5),pos);
  //   scale(vec2(sin(u_time)),pos);
  // rotate(u_time,pos);

  vec3 color = vec3(0.0);

  float d = 0.0;
  float d2 = 0.0;

  // Remap the space to -1. to 1.
  st = (st * 1.) - 0.5;

  // Number of sides of your shape
  int N = 3;

  // Angle and radius from the current pixel
  float a = atan(st.x,st.y)+PI;
  float a2 = atan(st.x,st.y)+PI;

  float r = TWO_PI/float(N);


  // Shaping function that modulate the distance
  d = cos(floor(.5+a/r)*r-a)*length(st);
  d2 = cos(floor(.5+a/r)*r-a2)*length(st);

  color += vec3(pos.xy,0.5);
  color = vec3(1.0-smoothstep(.2,.21,d))*vec3(1.,0.,0.);
  color += vec3(1.0-smoothstep(.2,.1,d/2.))*vec3(1., 0.,0.);
  color += triangles(st, center, 315.0 + 30.0*sin(u_time));


  gl_FragColor = vec4(color,1.0);
}