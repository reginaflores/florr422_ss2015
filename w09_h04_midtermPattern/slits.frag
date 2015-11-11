#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float random (in float x) {
    return fract(sin(x)*1e4);
}

float random (in vec2 st) { 
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

float F(float x, float p, float w){
    return random((smoothstep(p-w*.5,p,x) + smoothstep(p+w*.5,p,x))-1.0);
}

float Curve (float constant, float x, float power){
    
    return constant - pow(max(0.0, abs(x)* 2.0 - 1.0),power);
}


void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.);

    st *= 20.0;      // Scale up the space by 20
    
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);
    
/////////////
    // FUNCTION
    vec2 p = vec2(cos(u_time*0.5),0.)*.5+.5;
    float x = p.x;
    //Here we define the inputs into Curve Function:
    p.y = Curve(random(i_st), -1.0+2.0*x, 0.5);
    
    float pct = F(f_st.x,p.x,.5);
    pct *= F(random(f_st.y),p.y,.1);
///////////////

    color = vec3(pct);
    

	gl_FragColor = vec4(color,1.0);
}


