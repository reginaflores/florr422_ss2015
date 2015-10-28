#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {

	vec2 st = gl_FragCoord.xy/u_resolution;

	float color = 0.0;
	color += sin(st.x*cos(u_time/320.0)*80.0)+cos(st.y * cos(u_time/15.0)*10.0);
	color += sin( st.y * sin( u_time / 10.0 ) * 40.0 ) + cos( st.x * sin( u_time / 25.0 ) * 40.0 );
	color += sin( st.x * sin( u_time / 5.0 ) * 10.0 ) + sin( st.y * sin( u_time / 35.0 ) * 80.0 );
	color *= sin( u_time / 1.0 ) * 0.5;

	vec3 final = vec3(color);
	gl_FragColor = vec4(final, 1.0 );
}