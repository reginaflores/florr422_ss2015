
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float noiseRadius;

#define PI 3.14159265359

float circleFun(vec2 st, float radius, float raddyrad) {
    st -= .5;
//    return 1.0-step(radius*raddyrad,dot(st,st)*2.);
    return 1.0-smoothstep(raddyrad,radius*raddyrad,dot(st,st)*2.);
}


mat2 rotationMatrix(float a) {
    return mat2(vec3(cos(a),-sin(a),0.0),
                vec3(sin(a),cos(a),0.0));
//                vec3(0.0,0.0,1.0));
}


void main() {
    vec2 st = gl_TexCoord[0].st/u_resolution;
    vec3 color = gl_Color.rgb;

    float rad = noiseRadius/250.*2.;
    
    st *= 60.0*1./rad;      // Scale up the space by 10

    float d = distance(st, vec2(0.5));
    d = smoothstep(0.,1.,sin(d*3.14159*5.-u_time*5.));

    vec2 st_f = fract(st);
    vec2 st_f2 = fract(st)*rotationMatrix(0.5*PI*u_time*rad);

    
    float pct = circleFun(st_f, d*1.,rad);
    float pct2 = circleFun(st_f2, d, rad);
    
    color += pct;
    color *= pct2;
    color.r *= u_mouse.x/u_resolution.x;
    
//    color.r += pct*1.5;
//color.g += 0.5-pct;
   color.b += pct*rad;
    

  gl_FragColor = vec4(color,1.0);
}


