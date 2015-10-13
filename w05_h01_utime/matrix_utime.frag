// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define SMOOTH(r,R) (1.0-smoothstep(R-1.0,R+1.0, r))
#define blue3 vec3(0.35,0.76,0.83)


float box(vec2 st, vec2 size){
    st += .5;
    size = vec2(0.5) - size*0.5;
    vec2 uv = smoothstep(size,
                        size+vec2(0.001),
                        st);
    uv *= smoothstep(size,
                    size+vec2(0.001),
                    vec2(1.0)-st);
    return uv.x*uv.y;
}

float cross(vec2 st, float size){
    return  box(st, vec2(size,size/4.)) + 
            box(st, vec2(size/4.,size));
}

mat3 scaleMatrix(vec2 f) {
    return mat3(vec3(f.x,0.0,0.0),
                vec3(0.0,f.y,0.0),
                vec3(0.0,0.0,1.0));
}

void scale(in vec2 f, inout vec3 pos) {
    pos = scaleMatrix(f) * pos;
}

mat3 translationMatrix(vec2 f) {
    return mat3(vec3(1.0,0.0,0.0),
                vec3(0.0,1.0,0.0),
                vec3(f.x,f.y,1.0));
}

void translate(vec2 f, inout vec3 pos) {
    pos = translationMatrix(f) * pos;
}

mat3 rotationMatrix(float a) {
    return mat3(vec3(cos(a),-sin(a),0.0),
                vec3(sin(a),cos(a),0.0),
                vec3(0.0,0.0,1.0));
}

void rotate(float a, inout vec3 pos) {
    pos = rotationMatrix(a) * pos;
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

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 uv2 = gl_FragCoord.xy;
    vec2 c = u_resolution.xy/2.0;
    
    vec3 color = vec3(0.0);
    vec3 temp = 0.7 * circle2(uv2, c, 262.0, 1.0, 0.5+0.2*cos(u_time)) * blue3;

    vec3 pos = vec3(st,1.);
        
    translate(vec2(-.5),pos);
    scale(vec2(cos(u_time)),pos);
    rotate(u_time,pos);
    
    //MOVEMENT 1
    //mat3 universe = rotationMatrix(u_time) * 
    //                scaleMatrix(vec2(sin(u_time))) *
    //                translationMatrix(vec2(-.5));

    //MOVEMENT 2
    //mat3 universe = rotationMatrix(u_time);
    
    //MOVEMENT 3
    mat3 universe = translationMatrix(vec2(-.2));

    pos = universe * pos;
    
    color += cross(pos.xy,0.4);
    vec3 color2 = vec3(0.25,0.2,0.8);
    color += color2;
    
    gl_FragColor = vec4( color , 1.0);
}