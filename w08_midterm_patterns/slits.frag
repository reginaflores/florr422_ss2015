#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

float F(float x, float p, float w){
    return (smoothstep(p-w*.5,p,x) + smoothstep(p+w*.5,p,x))-1.0;
}

// Made a function to model the mathematical functions outlined
//in Kynd's flikr page here:
//https://www.flickr.com/photos/kynd/9546075099/
float Curve (float constant, float x, float power){
    
    return constant - pow(abs(sin(PI * x / 2.0)),power);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.);

    st *= 20.0;      // Scale up the space by 10
    vec2 st_f = fract(st);
    
///////////////
    //FUNCTION
    vec2 p = vec2(cos(u_time*0.5),0.)*.5+.5;
    float x = p.x;
    //Here we define the inputs into Curve Function:
    p.y = Curve(1.0, -1.0+2.0*x, 1.0);
    
    float pct = F(st_f.x,p.x,.5);
    pct *= F(st_f.y,p.y,.1);
///////////////

    color = vec3(pct);
	gl_FragColor = vec4(color,1.0);
}


