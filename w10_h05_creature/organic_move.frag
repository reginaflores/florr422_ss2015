// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

const float PI = 3.14159265;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}
float random (vec2 st) { 
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*43758.5453123);
}
float random(float x){
    return fract(sin(x)*43758.5453);
}

float noise (vec2 st) {
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

   float A = random(i_st);
   float B = random(i_st+vec2(1., 0.));
   float C = random(i_st+vec2(0., 1.));
   float D = random(i_st+vec2(1., 1.));

   f_st = smoothstep(vec2(0.), vec2(1.), f_st);

   return  mix(A, B, f_st.x)+
              (C-A)*f_st.y*(1.-f_st.x)+
              (D-B)*f_st.x*f_st.y;

}

float circle(in vec2 _st, in float _radius){
    vec2 l = _st-vec2(0.5);
  return 1.-smoothstep(_radius-(_radius*0.1),
                         _radius+(_radius*0.1),
                         dot(l,l)*4.0);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.0);
    vec2 pos = vec2(st*3.);

    float DF = 0.0;

    // Add a random position
    float a = 0.0;
    vec2 vel = vec2(u_time/u_mouse);
    DF += snoise(pos+vel)*.25+.25;
    
    vec2 f_st = fract(st);
    f_st = rotate2d(sin(u_time/2.))*f_st;


    // st*=100.;
    // vec2 i_st = floor(st);
    // i_st += vec2(.0,floor(u_time*15.*random(i_st.x)));

    color = vec3(1.-circle(f_st,0.5));
    // color += vec3(u_mouse, 1.);
    // Add a random position
    a = snoise(pos*vec2(cos(u_time*0.15),sin(u_time*0.1))*0.1)*PI;
    vel = vec2(cos(a),sin(a));
    DF += snoise(pos+vel)*.25+.25;

    color += vec3( smoothstep(.7,.75,fract(DF)) );

    gl_FragColor = vec4(1.0-color,1.0);
}