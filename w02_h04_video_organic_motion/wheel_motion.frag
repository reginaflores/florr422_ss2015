
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265

uniform float u_time;
uniform vec2 u_resolution;

float F(float x, float p, float w){
    return (smoothstep(p-w*.5,p,x) + smoothstep(p+w*.5,p,x))-1.0;
}


// Made a function to model the mathematical functions outlined
//in Kynd's flikr page here:
//https://www.flickr.com/photos/kynd/9546075099/
float Curve (float constant, float x, float power){

	return constant - pow(cos(PI * x / 2.0), power);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.);
 	
 	//p is the center of the white ball
 	vec2 p = vec2(cos(u_time*0.5),0.)*.5+.5;   
 	//Here we define the inputs into Curve Function:
 	p.y = Curve(1.0, -10.0+20.0*p.x, 1.0)*0.1+0.5;

    float pct = F(st.x,p.x,.1);
    pct *= F(st.y,p.y,.1);

    color = vec3(step(.5, pct), 1.0, 1.0);
    gl_FragColor = vec4(color,1.0);

}