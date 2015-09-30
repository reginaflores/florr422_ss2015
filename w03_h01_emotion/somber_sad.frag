#ifdef GL_ES
precision mediump float;
#endif

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
float impulse( float k, float x ){
    float h = k*x;
    return h*exp(1.0-h);
}
void main(){
    vec2 st = gl_FragCoord.xy/u_resolution;

    vec2 toCenter = (u_mouse/u_resolution)-st;
    float angle = atan(toCenter.y,toCenter.x);
    float radius = length(toCenter)*2.0;
    float y = impulse(st.x,8.*abs(sin(u_time/2.)));

    vec3 color = hsb2rgb(vec3(((angle)/TWO_PI)+0.5,radius,1.0));

    /*
    Try commenting out/in the 2 gl_FragColor to see a different emotion.
    */

    //somber
    //gl_FragColor = vec4(vec3(toCenter.x,toCenter.y,0.5),1.0);

    //sad
    gl_FragColor = vec4(vec3(toCenter.x,toCenter.y,0.5)*y,1.0);
}


