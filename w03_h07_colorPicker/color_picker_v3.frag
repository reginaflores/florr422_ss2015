#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265
#define TWO_PI 6.28318530718

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

float Curve (float constant, float x, float power){
    
    return pow(min(cos(PI * x / 2.0),constant - abs(x)), power);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution;

    // Use polar coordinates instead of cartesian
    // vec2 toCenter = vec2(0.5)-st;
    vec2 toCenter = (u_mouse/u_resolution)-st;
    float angle = atan(toCenter.y,toCenter.x);
    float radius = length(toCenter)*2.0;

    vec2 p = vec2(cos(u_time*0.5),0.)*.5+.5;
    
    float x = p.x;
    
    //Here we define the inputs into Curve Function:
    p.y = Curve(1.0, -1.0+2.0*x, 1.0);
    // Map the angle (-PI to PI) to the Hue (from 0 to 1)
    // and the Saturation to the radius
    vec3 color = hsb2rgb(vec3(((angle + u_time)/TWO_PI)+0.5,radius,1.0));

    gl_FragColor = vec4(color,1.0);
}