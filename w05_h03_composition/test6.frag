//Source:
//http://glslsandbox.com/e#27668.3

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() 
{
	float m = floor((floor(u_mouse.y*256.)/256.)*u_resolution.y);
	float x = floor(gl_FragCoord.x);
	float y = floor(gl_FragCoord.y);	
	float f = mod(y-x, mod(y, m));
	float s = mod(y-x, mod(x, m));
	gl_FragColor += float(f*s);

}