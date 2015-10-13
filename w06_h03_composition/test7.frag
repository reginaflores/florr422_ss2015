//Source:
//http://glslsandbox.com/e#27973.1


#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

void main() {

	vec2 position = gl_FragCoord.xy / u_resolution.xy ;

	float color = 0.0;
	color += sin( position.x * cos( u_time / 15.0 ) * 80.0 ) + cos( position.y * cos( u_time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( u_time / 10.0 ) * 40.0 ) + cos( position.x * sin( u_time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( u_time / 5.0 ) * 10.0 ) + sin( position.y * sin( u_time / 35.0 ) * 80.0 );


	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color / 3.0 ) * 0.75 ), 1.0 );

}