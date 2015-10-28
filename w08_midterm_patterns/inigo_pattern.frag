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

//Function taken from Inigo Quilezles
// http://www.iquilezles.org/www/articles/functions/functions.htm
float impulse( float k, float x )
{
    float h = k*x;
    return h*exp(1.0-h);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    st *=5.;
    vec2 st_f = fract(st);
    // float y = smoothstep(0.1,0.9,st.x);
    float a = 0.5+sin(u_mouse.x*0.01)*0.5;
	float y = impulse(a*100.0 ,st_f.x);
    vec3 color = vec3(y);
    
    float pct = plot(st_f,y);
    color = (1.0-pct)*color+pct*vec3(1.0,1.0,1.0);

    gl_FragColor = vec4(color,1.0);
}