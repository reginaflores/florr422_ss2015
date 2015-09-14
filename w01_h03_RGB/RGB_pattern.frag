#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;

void main() {
    
	// gl_FragColor = vec4(abs(sin(u_time*0.1)),0.0,0.0,1.0);

    vec2 pos = gl_FragCoord.xy/vec2(500., 500.); 
	gl_FragColor = vec4(abs(sin(u_time*0.3)),0.0,pos.y,1.0);
    
}