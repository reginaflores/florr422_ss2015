
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform float u_time;
uniform vec2 u_resolution;

float F(float x, float p, float w){
    return (smoothstep(p-w*.5,p,x) + smoothstep(p+w*.5,p,x))-1.0;
}


// Made a function to model the mathematical functions outlined
//in Kynd's flikr page here:
//https://www.flickr.com/photos/kynd/9546075099/
float Curve (float constant, float x, float power){
    
    return pow(min(cos(PI * x / 2.0),constant - abs(x)), power);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.);
    
    vec2 p = vec2(cos(u_time*0.5),0.)*.5+.5;
    
    float x = p.x;
    
    //Here we define the inputs into Curve Function:
    p.y = Curve(1.0, -1.0+2.0*x, 2.0);
    
    float pct = F(st.x,p.x,.1);
    pct *= F(st.y,p.y,.1);
    
    color = vec3(step(.5, pct), 0.0, 0.0);
    gl_FragColor = vec4(color,1.0);
}