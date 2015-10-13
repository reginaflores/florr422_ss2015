/*
//Made this using my old circle function plus using these as inspiration.
//Inspiration taken from:
//(1) Source: http://glslsandbox.com/e#28120.0
//(2) Source: https://www.shadertoy.com/view/4s2SRt
*/

#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

#define SMOOTH(r,R) (1.0-smoothstep(R-1.0,R+1.0, r))
#define blue1 vec3(0.74,0.95,1.00)
#define blue3 vec3(0.35,0.76,0.83)
#define M_PI 3.1415926535897932384626433832795


float circleFade(vec2 st2){
    float pct = 0.0;
    pct = distance(st2,vec2(0.5));

    pct = 2.0*pct;
    pct = smoothstep(0.7, 0., pct);
    return pct;
}

float circle2(vec2 uv, vec2 center, float radius, float width, float opening){
    vec2 d = uv - center;
    float r = sqrt( dot( d, d ) );
    d = normalize(d);
    if( abs(d.y) > opening )
        return SMOOTH(r-width/2.0,radius)-SMOOTH(r+width/2.0,radius);
    else
        return 0.0;
}

float circle3(vec2 uv, vec2 center, float radius, float width){
    vec2 d = uv - center;
    float r = sqrt( dot( d, d ) );
    d = normalize(d);
    float theta = 90.0*(atan(d.y,d.x)/M_PI);
    return smoothstep(2.0, 2.1, abs(mod(theta+2.0,45.0)-2.0)) *
        mix( 0.5, 1.0, step(45.0, abs(mod(theta, 180.0)-90.0)) ) *
        (SMOOTH(r-width/2.0,radius)-SMOOTH(r+width/2.0,radius));
}

float movingLine(vec2 uv, vec2 center, float radius)
{
    //angle of the line
    float theta0 = 30.0 * u_time;
    vec2 d = uv - center;
    float r = sqrt( dot( d, d ) );
    if(r<radius)
    {
        //compute the distance to the line theta=theta0
        vec2 p = radius*vec2(cos(theta0*M_PI/180.0),
                            -sin(theta0*M_PI/180.0));
        float l = length( d - p*clamp( dot(d,p)/dot(p,p), 0.0, 1.0) );
    	d = normalize(d);
        //compute gradient based on angle difference to theta0
   	 	float theta = mod(180.0*atan(d.y,d.x)/M_PI+theta0,360.0);
        float gradient = clamp(1.0-theta/90.0,0.0,1.0);
        return SMOOTH(l,1.0)+0.5*gradient;
    }
    else return 0.0;
}

void main( void ) {
	vec2 st = gl_FragCoord.xy;
	vec2 st2 = gl_FragCoord.xy/u_resolution;

	vec2 center = u_resolution.xy / 2.0;
	vec3 color = vec3(0.0);
	vec3 pos = vec3(st,1.0);

	float t = 1.5/length(st.x-(center.x+100.0*sin( st.y * 0.02 )*0.3*(sin(u_time))));
	
    vec3 color2 = vec3(circleFade(st2))*2.*sin(u_time);;

	color = vec3(t-(sin(u_time)*0.1),t-(cos(u_time)*0.1),t*0.8);
	color+=color2;

	color += circle3(st, center, 313.0, 4.0) * blue1;
	color += 0.7 * circle2(st, center, 262.0, 1.0, 0.5+0.2*cos(u_time)) * blue3;
	color += circle3(st, center, 413.0, 4.0) * blue1*sin(u_time);
	color += movingLine(st, center, 410.0) * blue3;


	gl_FragColor = vec4(color,1.0);
	
	
}