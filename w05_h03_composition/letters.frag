// http://glslsandbox.com/e#28061.1

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

uniform sampler2D backbuffe;


//16 segment display... maybe a old school scroll text  ;-)
// todo : clear text and do greetings and  credits in a new text.... display more texts with a clear...  

	#define A dist = min(dist, ddigit(float(0x119F) , uv - offs));offs.x += ch_space.x;
	#define B dist = min(dist, ddigit(float(0x927E) , uv - offs));offs.x += ch_space.x;
	#define C dist = min(dist, ddigit(float(0x007E) , uv - offs));offs.x += ch_space.x;
	#define D dist = min(dist, ddigit(float(0x44E7) , uv - offs));offs.x += ch_space.x;
	#define E dist = min(dist, ddigit(float(0x107E) , uv - offs));offs.x += ch_space.x;
	#define F dist = min(dist, ddigit(float(0x101E) , uv - offs));offs.x += ch_space.x;
	#define G dist = min(dist, ddigit(float(0x807E) , uv - offs));offs.x += ch_space.x;
	#define H dist = min(dist, ddigit(float(0x1199) , uv - offs));offs.x += ch_space.x;
	#define I dist = min(dist, ddigit(float(0x4466) , uv - offs));offs.x += ch_space.x;
	#define J dist = min(dist, ddigit(float(0x4436) , uv - offs));offs.x += ch_space.x;
	#define K dist = min(dist, ddigit(float(0x9218) , uv - offs));offs.x += ch_space.x;
	#define L dist = min(dist, ddigit(float(0x0078) , uv - offs));offs.x += ch_space.x;
	#define M dist = min(dist, ddigit(float(0x0A99) , uv - offs));offs.x += ch_space.x;
	#define N dist = min(dist, ddigit(float(0x8899) , uv - offs));offs.x += ch_space.x;
	#define O dist = min(dist, ddigit(float(0x00FF) , uv - offs));offs.x += ch_space.x;
	#define P dist = min(dist, ddigit(float(0x111F) , uv - offs));offs.x += ch_space.x;
	#define Q dist = min(dist, ddigit(float(0x80FF) , uv - offs));offs.x += ch_space.x;
	#define R dist = min(dist, ddigit(float(0x911F) , uv - offs));offs.x += ch_space.x;
	#define S dist = min(dist, ddigit(float(0x8866) , uv - offs));offs.x += ch_space.x;
	#define T dist = min(dist, ddigit(float(0x4406) , uv - offs));offs.x += ch_space.x;
	#define U dist = min(dist, ddigit(float(0x00F9) , uv - offs));offs.x += ch_space.x;
	#define V dist = min(dist, ddigit(float(0x2218) , uv - offs));offs.x += ch_space.x;
	#define W dist = min(dist, ddigit(float(0xA099) , uv - offs));offs.x += ch_space.x;
	#define X dist = min(dist, ddigit(float(0xAA00) , uv - offs));offs.x += ch_space.x;
	#define Y dist = min(dist, ddigit(float(0x4A00) , uv - offs));offs.x += ch_space.x;
	#define Z dist = min(dist, ddigit(float(0x2266) , uv - offs));offs.x += ch_space.x;
	#define _ offs.x += ch_space.x;

float dseg(vec2 p0,vec2 p1,vec2 uv)
{
	vec2 dir = normalize(p1 - p0);
	uv = (uv - p0) * mat2(dir.x, dir.y,-dir.y, dir.x);
	return distance(uv, clamp(uv, vec2(0), vec2(distance(p0, p1), 0)));   
}

bool bit(float n, float b)
{
	return mod(floor(n / exp2(floor(b))), 2.0) != 0.0;
}

float ddigit(float bits, vec2 uv)
{
	float d = 1e6;	

	float n = floor(bits);
	
	if(bits != 0.0)
	{
		d = bit(n,  0.0) ? min(d, dseg(vec2( 0.500,  0.063), vec2( 0.500,  0.937), uv)) : d;
		d = bit(n,  1.0) ? min(d, dseg(vec2( 0.438,  1.000), vec2( 0.063,  1.000), uv)) : d;
		d = bit(n,  2.0) ? min(d, dseg(vec2(-0.063,  1.000), vec2(-0.438,  1.000), uv)) : d;
		d = bit(n,  3.0) ? min(d, dseg(vec2(-0.500,  0.937), vec2(-0.500,  0.062), uv)) : d;
		d = bit(n,  4.0) ? min(d, dseg(vec2(-0.500, -0.063), vec2(-0.500, -0.938), uv)) : d;
		d = bit(n,  5.0) ? min(d, dseg(vec2(-0.438, -1.000), vec2(-0.063, -1.000), uv)) : d;
		d = bit(n,  6.0) ? min(d, dseg(vec2( 0.063, -1.000), vec2( 0.438, -1.000), uv)) : d;
		d = bit(n,  7.0) ? min(d, dseg(vec2( 0.500, -0.938), vec2( 0.500, -0.063), uv)) : d;
		d = bit(n,  8.0) ? min(d, dseg(vec2( 0.063,  0.000), vec2( 0.438, -0.000), uv)) : d;
		d = bit(n,  9.0) ? min(d, dseg(vec2( 0.063,  0.063), vec2( 0.438,  0.938), uv)) : d;
		d = bit(n, 10.0) ? min(d, dseg(vec2( 0.000,  0.063), vec2( 0.000,  0.937), uv)) : d;
		d = bit(n, 11.0) ? min(d, dseg(vec2(-0.063,  0.063), vec2(-0.438,  0.938), uv)) : d;
		d = bit(n, 12.0) ? min(d, dseg(vec2(-0.438,  0.000), vec2(-0.063, -0.000), uv)) : d;
		d = bit(n, 13.0) ? min(d, dseg(vec2(-0.063, -0.063), vec2(-0.438, -0.938), uv)) : d;
		d = bit(n, 14.0) ? min(d, dseg(vec2( 0.000, -0.938), vec2( 0.000, -0.063), uv)) : d;
		d = bit(n, 15.0) ? min(d, dseg(vec2( 0.063, -0.063), vec2( 0.438, -0.938), uv)) : d;
	}
	
	return d;
}

const int NUM_CHARS = 72;




void main( void ) {
	vec2 pos = gl_FragCoord.xy / u_resolution;
	float amnt = 500.0;
	float nd = 0.0;
	vec4 cbuff = vec4(0.0);
	
	vec4 dbuff =  texture2D(backbuffe,1.0-pos)*0.1;
    gl_FragColor = cbuff + dbuff;
	
	
	vec2 aspect = u_resolution.xy / u_resolution.y;
	vec2 uv = ( gl_FragCoord.xy / u_resolution.y );
	uv -= aspect * 0.5;
	uv *= 20.0;  ///  DIST.  do GL_Translate for zoom  ;-)
	
	float dist = 1e6;
	
	//Printing and spacing
	vec2 ch_size = vec2(1.0, 1.0);
	vec2 ch_space = ch_size + vec2(0.29,0.26);
	///////POS / Move text//////
	float posx = 13.5+sin(uv.x)*sin(u_time)*.3; // Start place...  change for moving... Sceen: 16  <->  -16
	float posy = 0.7+sin(uv.x+uv.y)*sin(u_time*.5)*.36; // Start place...  change for moving (SIN make it jump!)... Sceen: 12  <->  -12
	///////////////////////
	vec2 offs = vec2(-ch_space.x * posx,posy);  

_ _ _ _ _ _ _ Q U E S T  _ _ L O V E _
		
	//Shading
	vec3 color = vec3(0.0);
	
	color = mix(vec3(sin(u_time)+.4,0.1,0.3), vec3(0.0,0.0,0.0), smoothstep(0.0, 0.0, dist) - (0.10 / dist));
	
	gl_FragColor = gl_FragColor +  vec4(color, 1.0);	
	
}

