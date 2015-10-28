#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float circleFun(vec2 st){
    float pct = 0.0;
    // a. The DISTANCE from the pixel to the center
    pct = 2.*distance(st,vec2(0.5));
    pct = 2.0*pct;
    pct = smoothstep(0.9, 1.0, pct);

    return pct;
}

vec2 tile (vec2 _st, float _zoom) {
    _st *= _zoom;
    return fract(_st);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.);

    st = tile(st,80.0);

    float pct = circleFun(st);
    color += 1.-pct;

	gl_FragColor = vec4(color,1.0);
}


