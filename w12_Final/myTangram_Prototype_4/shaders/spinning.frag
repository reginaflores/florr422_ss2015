#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution.y;
	float intensity = 0.;
	for (float i = 0.; i < 50.; i++) {
		float angle = i/50. * 2. * 43.14159;
		vec2 xy = vec2(0.25 * cos(angle), 0.25 * sin(angle));
		xy += st-0.5;
		intensity += pow(100000., (.9 - length(xy) * 1.9) * (1. + 0.25 * fract(-i / 8. - (u_time*10.)))) / 100000.;
	}
	gl_FragColor = vec4(clamp(intensity * vec3(.1, .1, 0.2), vec3(0.), vec3(1.)), 1.);
}