#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

void main() {
	vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
	vec3 d_color = vec3(0.0, 0.33, 0.5);
	
	float f = 0.0;
	float d = 0.0675;
	
// Equation for a torrus:
// x	=	(c+a*cosv)cos(u)	
// y	=	(c+a*cosv)sin(u)	
// z	=	a*sinv
	
	// float i = 1.;
	for(float i = d*1.; i < 10.0; i+=d){
		float ph = i * 0.7;
		float s = sin(ph) * 0.5;
		float c = cos(u_time + ph) * 0.5;
	

		vec2 lp = 2.*p + 0.5*vec2(cos(0.1*u_time+ph), sin(0.1*u_time+ph));
		
		f += 0.00125 / abs(length(lp + vec2(c, s)) - 0.5);
	}

	gl_FragColor = vec4(vec3(1.- d_color * f), 1.0);
}