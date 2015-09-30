#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI 6.28318530718
#define PI 3.14159265

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

//  Function from Iñigo Quiles 
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0, 
                     0.0, 
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution;

    // Use polar coordinates instead of cartesian
    //vec2 toCenter = vec2(0.0)-st;
    vec2 toCenter = (0.5)-st;
    float angle = atan(toCenter.y,toCenter.x);
    float radius = length(toCenter)*0.5;
  
    // Map the angle (-PI to PI) to the Hue (from 0 to 1)
    // and the Saturation to the radius
    // vec3 color = hsb2rgb(vec3(((angle + u_time)/TWO_PI)+0.5,radius,(sin(u_time)+1.0)*0.5));
    vec3 color = hsb2rgb(vec3(((angle+0.8)/(PI)),radius-0.1,1.0));



    gl_FragColor = vec4(color,0.8);
}

