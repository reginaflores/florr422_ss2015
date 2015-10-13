//http://glslsandbox.com/e#28060.0

#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

#define SMOOTH(r,R) (1.0-smoothstep(R-1.0,R+1.0, r))
#define blue1 vec3(0.74,0.95,1.00)

#define OCTAVES 12


float vn(vec2 pos, float persistence, float scale){
	float v = 0.0;
	float p = 1.0;
	for (int i=OCTAVES-1; i>=0; --i)
	{
		v += (sin(pos.x)+cos(pos.y))*p;
		pos += sin(pos.yx+vec2(u_time+cos(u_time), 0.12345*u_time));
		p *= persistence;
		pos /= scale;
	}
	return v;
}
float circle(vec2 st, vec2 center, float radius, float width){
    float r = length(st - center);
    return SMOOTH(r-width/2.0,radius)-SMOOTH(r+width/2.0,radius);
}

void main( void ){

	vec2 st = ( gl_FragCoord.xy / u_resolution.xy );
	vec3 color = vec3(0.,0.,0.);
    vec2 center = u_resolution.xy/2.0;

	float c = vn(st*10.0, 0.5, 0.5);

	color = vec3( cos(c*1.0)*0.5+0.5 );
	color += circle(st, center, 240.0, 2.0)* blue1;//+ dots(uv,c,240.0)) * blue4;


	gl_FragColor = vec4(color , 1.0 );

}