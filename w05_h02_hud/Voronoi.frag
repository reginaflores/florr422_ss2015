/*
Note using 2 different shader code from 2 sources:
(1)
// Quasi Infinite Zoom Voronoi
// by Shane
// Adapted from https://www.shadertoy.com/view/XlBXWw by J.
// http://glslsandbox.com/e#28191.1

(2)
//Sci-fi radar based on the work of gmunk for Oblivion
//http://work.gmunk.com/OBLIVION-GFX
//https://www.shadertoy.com/view/4s2SRt

My own code is:



*/

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


#define SMOOTH(r,R) (1.0-smoothstep(R-1.0,R+1.0, r))
#define RANGE(a,b,x) ( step(a,x)*(1.0-step(b,x)) )
#define RS(a,b,x) ( smoothstep(a-1.0,a+1.0,x)*(1.0-smoothstep(b-1.0,b+1.0,x)) )
#define M_PI 3.1415926535897932384626433832795

#define blue1 vec3(0.74,0.95,1.00)
#define blue2 vec3(0.87,0.98,1.00)
#define blue3 vec3(0.35,0.76,0.83)
#define blue4 vec3(0.953,0.969,0.89)
#define red   vec3(1.00,0.38,0.227)

#define MOV(a,b,c,d,t) (vec2(a*cos(t)+b*cos(0.1*(t)), c*sin(t)+d*cos(0.1*(t))))

float movingLine(vec2 uv, vec2 center, float radius)
{
    //angle of the line
    float theta0 = 90.0 * u_time;
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

float circle(vec2 uv, vec2 center, float radius, float width)
{
    float r = length(uv - center);
    return SMOOTH(r-width/2.0,radius)-SMOOTH(r+width/2.0,radius);
}

float circle2(vec2 uv, vec2 center, float radius, float width, float opening)
{
    vec2 d = uv - center;
    float r = sqrt( dot( d, d ) );
    d = normalize(d);
    if( abs(d.y) > opening )
        return SMOOTH(r-width/2.0,radius)-SMOOTH(r+width/2.0,radius);
    else
        return 0.0;
}
float circle3(vec2 uv, vec2 center, float radius, float width)
{
    vec2 d = uv - center;
    float r = sqrt( dot( d, d ) );
    d = normalize(d);
    float theta = 180.0*(atan(d.y,d.x)/M_PI);
    return smoothstep(2.0, 2.1, abs(mod(theta+2.0,45.0)-2.0)) *
        mix( 0.5, 1.0, step(45.0, abs(mod(theta, 180.0)-90.0)) ) *
        (SMOOTH(r-width/2.0,radius)-SMOOTH(r+width/2.0,radius));
}

float triangles(vec2 uv, vec2 center, float radius)
{
    vec2 d = uv - center;
    return RS(-8.0, 0.0, d.x-radius) * (1.0-smoothstep( 7.0+d.x-radius,9.0+d.x-radius, abs(d.y)))
         + RS( 0.0, 8.0, d.x+radius) * (1.0-smoothstep( 7.0-d.x-radius,9.0-d.x-radius, abs(d.y)))
         + RS(-8.0, 0.0, d.y-radius) * (1.0-smoothstep( 7.0+d.y-radius,9.0+d.y-radius, abs(d.x)))
         + RS( 0.0, 8.0, d.y+radius) * (1.0-smoothstep( 7.0-d.y-radius,9.0-d.y-radius, abs(d.x)));
}

float cross(vec2 uv, vec2 center, float radius)
{
    vec2 d = uv - center;
    int x = int(d.x);
    int y = int(d.y);
    float r = sqrt( dot( d, d ) );
    if( (r<radius) && ( (x==y) || (x==-y) ) )
        return 1.0;
    else return 0.0;
}
float dots(vec2 uv, vec2 center, float radius)
{
    vec2 d = uv - center;
    float r = sqrt( dot( d, d ) );
    if( r <= 2.5 )
        return 1.0;
    if( ( r<= radius) && ( (abs(d.y+0.5)<=1.0) && ( mod(d.x+1.0, 50.0) < 2.0 ) ) )
        return 1.0;
    else if ( (abs(d.y+0.5)<=1.0) && ( r >= 50.0 ) && ( r < 115.0 ) )
        return 0.5;
    else
        return 0.0;
}
float bip1(vec2 uv, vec2 center)
{
    return SMOOTH(length(uv - center),3.0);
}
float bip2(vec2 uv, vec2 center)
{
    float r = length(uv - center);
    float R = 8.0+mod(87.0*u_time, 80.0);
    return (0.5-0.5*cos(30.0*u_time)) * SMOOTH(r,5.0)
        + SMOOTH(6.0,r)-SMOOTH(8.0,r)
        + smoothstep(max(8.0,R-20.0),R,r)-SMOOTH(R,r);
}


vec2 hash22(vec2 p) { 
    float n = sin(dot(p, vec2(41, 289)));
    return fract(vec2(262244, 12768)*n); 
}

float Voronoi(vec2 p)
{	
    vec2 ip = floor(p);
    p = fract(p);

    float d = 1.;
    
    for (float i = -1.; i < 1.1; i++){
	    for (float j = -1.; j < 1.12; j++){
     	    vec2 cellRef = vec2(i, j);
            vec2 offset = hash22(ip + cellRef);
            vec2 r = cellRef + offset - p; 
            float d2 = dot(r, r);
            d = min(d, d2);
        }
    }
    
    return sqrt(d); 
}

void main(void){
    vec2 uv = (gl_FragCoord.xy - u_resolution.xy*.15)/u_resolution.y;
    float t = u_time, s, a, b, e;
    float th = sin(u_time*0.15)*sin(u_time*0.15)*4.;
    float cs = cos(th), si = sin(th);
    uv *= mat2(cs, -si, si, cs);
    vec3 sp = vec3(uv, 0);
    vec3 ro = vec3(1,2, -1);
    vec3 rd = normalize(ro-sp);
    vec3 lp = vec3(cos(u_time)*0.375, sin(u_time)*0.1, -1.);
    const float L = 8.;
    const float gFreq = .035;
    float sum = 0.;
    th = 13.14159265*0.7071/L;
    cs = cos(th), si = sin(th);
    mat2 M = mat2(cs, -si, si, cs);
    vec3 col = vec3(0);
    float f=0., fx=0., fy=0.;
    vec2 eps = vec2(4./u_resolution.y, 0.);
    vec2 offs = vec2(0.1);
    
    for (float i = 0.; i<L; i++){
        s = fract((i - t*2.)/L);
        e = exp2(s*L)*gFreq;
        a = (1.-cos(s* 4.2))/e;
        f += Voronoi(M*sp.xy*e + offs) * a;
        fx += Voronoi(M*(sp.xy+eps.xy)*e + offs) * a;
        fy += Voronoi(M*(sp.xy+eps.yx)*e + offs) * a;
        sum += a;
        M *= M;
    }

    sum = max(sum, 0.001);
    f /= sum;
    fx /= sum;
    fy /= sum;
    float bumpFactor = 0.2;
    fx = (fx-f)/eps.x;
    fy = (fy-f)/eps.x;
    vec3 n = normalize( vec3(0, 0, -1) - vec3(fx, fy, 0)*bumpFactor );           
    vec3 ld = lp - sp;
    float lDist = max(length(ld), 0.001);
    ld /= lDist;
    float atten = min(1./(lDist*0.45 + lDist*lDist*0.15), 1.);
    float diff = max(dot(n, ld), 0.);  
    diff = pow(diff, 2.)*0.66 + pow(diff, 4.)*0.34; 
    float spec = pow(max(dot( reflect(-ld, n), rd), 0.), 18.); 
    vec3 objCol = vec3(f, f*f*sqrt(f)*0.4, f*0.6);
    col = (objCol * (diff + 0.5) + vec3(0.5, 0.2, 1.)*spec) * atten;


//////////////////////////////////////////////////////
//Sci-fi radar based on the work of gmunk for Oblivion
//http://work.gmunk.com/OBLIVION-GFX
    vec3 finalColor;
    vec2 uv2 = gl_FragCoord.xy;
    //center of the image
    vec2 c = u_resolution.xy/2.0;
    finalColor = vec3( 0.3*cross(uv2, c, 240.0) );
    finalColor += ( circle(uv2, c, 100.0, 1.0)
                  + circle(uv2, c, 165.0, 1.0) ) * blue1;
    finalColor += (circle(uv2, c, 240.0, 2.0) );//+ dots(uv,c,240.0)) * blue4;
    finalColor += circle3(uv2, c, 313.0, 4.0) * blue1;
    // finalColor += triangles(uv2, c, 315.0 + 30.0*sin(u_time)) * blue2;
    finalColor += movingLine(uv2, c, 240.0) * blue3;
    finalColor += circle(uv2, c, 10.0, 1.0) * blue3;
    finalColor += 0.7 * circle2(uv2, c, 262.0, 1.0, 0.5+0.2*cos(u_time)) * blue3;
//////////////////////////////////////////////////////
    
    col += finalColor;

    gl_FragColor = vec4(min(col, 1.), 1.);
}