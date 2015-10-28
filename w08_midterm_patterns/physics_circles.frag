#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float circleFun(vec2 st, float radius) {
    st -= .5;
    return 1.0-step(radius*.5,dot(st,st)*2.);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.);

    st *= 30.0;      // Scale up the space by 10

    float d = distance(st, vec2(0.5));
    d = smoothstep(0.,1.,sin(d*3.14159*5.-u_time*5.));

    vec2 st_f = fract(st);


    float pct = circleFun(st_f, d*1.);
    color += pct;

	gl_FragColor = vec4(color,1.0);
}


