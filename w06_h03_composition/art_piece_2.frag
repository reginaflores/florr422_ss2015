#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

mat3 scaleMatrix(vec2 f) {
    return mat3(vec3(f.x,0.0,0.0),
                vec3(0.0,f.y,0.0),
                vec3(0.0,0.0,1.0));
}

void scale(in vec2 f, inout vec3 pos) {
    pos = scaleMatrix(f) * pos;
}

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

void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st.x *= u_resolution.x/u_resolution.y;
  vec3 color = vec3(0.0);
  float d = 0.0;
  
  vec3 pos = vec3(st,1.);
    
  translate(vec2(-.5),pos);
  // scale(vec2(sin(u_time)),pos);
  rotate(u_time,pos);
  // Remap the space to -1. to 1.
  st = st *2.-1.;

  // Make the distance field
  d = length( abs(pos.xy)-.0 )*cos(u_time);

  color = vec3(fract(d*10.0));
  color += vec3(0.32, .1, .892);
  // Visualize the distance field
  gl_FragColor = vec4(color,1.);

  
}