#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float circlePower(vec2 st, float x, float p, float w){
    float pct = 0.0;
    // a. The DISTANCE from the pixel to the center
    pct = distance(st,vec2(0.5));
    pct = 2.0*pct;
    pct = smoothstep(0.9, 1.0, pct);

    float shape = (smoothstep(p-w*.5,p,x) + smoothstep(p+w*.5,p,x))-1.0;
    pct *= shape;

    return pct;
}

float Curve (float constant, float x, float power){

    return constant - pow(max(0.0, abs(x)* 2.0 - 1.0),power);
}

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution;
    st *= 5.0; 
    vec2 p = vec2(cos(u_time*0.5),0.)*.5+.5;   
    float x = p.x;
    vec2 st_f = fract(st);

    //Here we define the inputs into Curve Function:
    // p.y = Curve(1.0, -1.0+2.0*x, 0.5);
    float myFun = circlePower(st_f,st_f.x,p.x,.1 );
    vec3 color = vec3(myFun*2.);

	gl_FragColor = vec4(color, 1.0 );
}