#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.14159265359

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
	
	vec3 destColor = vec3(0.0, 0.5, 0.0);
	
	float f = 0.0;
	float n = 3.0;
	float a = 2.0 * PI / n;
	for(float i = 0.0; i < 60.0; i++) {
		float o = mod(1.0 * u_time + length(p)*a, 2.*PI);
		float s = sin(o + u_time) / 200.0;
		float c = cos(o) / 2.;
		f += 0.00025 / abs(length(p + vec2(c, s)) - 0.3);
	}
	
	gl_FragColor = vec4(vec3(destColor * f), 1.0);
}