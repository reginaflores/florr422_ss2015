#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Plot a line on Y using a value between 0.0-1.0
float plot(vec2 st, float pct){
  return  smoothstep( pct-0.2, pct, st.x) - 
          smoothstep( pct, pct+0.2, st.x
            );
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.);

    float y = pow(st.x,2.); 

    vec3 A = vec3(0.765, 0.110, 0.231);
    vec3 B = vec3(0.078, 0.388, 0.467);

    //color = mix(A, B, mod(u_time, 1.));
    color = mix(A, B, y);

    color += plot(st,y);
    
	gl_FragColor = vec4(color,1.0);
}