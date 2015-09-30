#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Plot a line on Y using a value between 0.0-1.0
float plot(vec2 st, float pct){
  return  smoothstep( pct-0.2, pct+0.5, st.y) - 
          smoothstep( pct, pct+0.2, st.y
            );
}
//  Function from Iñigo Quiles 
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0, 
                     0.0, 
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.);

    float y = pow(st.y, 3.0); 

    vec3 color_init =  hsb2rgb(vec3(st.y/3.0-0.5, 0.8, 0.5+st.y));

    vec3 A = vec3(0.2, 0.4, 0.6)*sin(PI*u_time/2.0);
    vec3 B = vec3(0.5, 0.3, 0.4);

    //color = mix(A, B, mod(u_time, 1.));
    color = mix(A, color_init, y);

    color += plot(st,y);
    
    gl_FragColor = vec4(color,1.0);
}