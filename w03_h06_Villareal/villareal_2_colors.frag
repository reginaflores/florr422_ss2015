#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Plot a line on Y using a value between 0.0-1.0
float plot(vec2 st, float pct){
  return  smoothstep( pct-0.2, pct, st.y) - 
          smoothstep( pct, pct+0.2, st.y
            );
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.);

    float y = pow(st.y, 3.0); 

    vec3 A = vec3(0.2, 0.1, 0.6)*sin(PI*u_time/2.0);
    vec3 B = vec3(0.5, 0.3, 0.4);

    //color = mix(A, B, mod(u_time, 1.));
    color = mix(A, B, y);

    color += plot(st,y);
    
	gl_FragColor = vec4(color,1.0);
}