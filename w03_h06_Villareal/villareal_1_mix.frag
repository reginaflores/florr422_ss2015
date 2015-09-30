#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265

uniform vec2 u_resolution;
uniform float u_time;

vec3 rgb2hsb( in vec3 c ){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), 
                 vec4(c.gb, K.xy), 
                 step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), 
                 vec4(c.r, p.yzx), 
                 step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), 
                d / (q.x + e), 
                q.x);
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

float plot(vec2 st, float pct){
  return  smoothstep( pct-0.2, pct, st.x) - 
          smoothstep( pct, pct+0.2, st.x
            );
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution;
    float y = pow(st.x,2.); 
    vec3 color = vec3(0.0);
    // We map x (0.0 - 1.0) to the hue (0.0 - 1.0)
    // And the y (0.0 - 1.0) to the brightness

    //Hue is the way we change color
    //Dividing Hue by 2 makes the color spectrum less by a half
    //then offsetting the hue will change the colors you see
    color = hsb2rgb(vec3(st.y/4.0-0.4, 0.8, 0.5+st.x));

    // color = mix(A, B, y);
    color += plot(st,y);

    gl_FragColor = vec4(color,1.0);
}

