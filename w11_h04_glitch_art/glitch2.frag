#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_tex0;
uniform vec2 u_tex0Resolution;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// float eps = .007;
float eps = u_time*0.2;
#define PI 3.1415927

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}
//inspiried by: https://www.shadertoy.com/view/4s2GRR
vec3 effectRound(sampler2D u_tex0, vec2 st){

	float prop = u_resolution.x / u_resolution.y;//screen proroption
	vec2 center = vec2(0.5, 0.5 / prop);//center coords
	vec2 d = st - center;//vector from center to current fragment
	float r = sqrt(dot(d, d)); // distance of pixel from center

	float power = ( 2.0 * 3.141592 / (2.0 * sqrt(dot(center, center))) ) * (u_mouse.x / u_resolution.x - 0.5);//amount of effect

	vec2 uv;
	if (power > 0.0){//fisheye
		uv = center + normalize(d) * tan(r * power)  / tan( power);
	}
	else if (power < 0.0){//antifisheye
		uv = center + normalize(d) * atan(r * -power * 10.0)  / atan(-power * 10.0);
	}
	vec3 col = texture2D(u_tex0, vec2(uv.x, uv.y * prop)).xyz;
	return col;                                                  
}

//inspiried by: https://www.shadertoy.com/view/ldl3WM
vec3 postProcessing(sampler2D u_tex0 , vec2 st){
	
	vec3 t   = texture2D(u_tex0, st).rgb;
	vec3 t00 = texture2D(u_tex0, st+vec2(-eps,-eps)).rgb;
	vec3 t10 = texture2D(u_tex0, st+vec2( eps,-eps)).rgb;
	vec3 t01 = texture2D(u_tex0, st+vec2(-eps, eps)).rgb;
	vec3 t11 = texture2D(u_tex0, st+vec2( eps, eps)).rgb;
	vec3 tm = (t00+t01+t10+t11)/4.;
	vec3 v=t; 
	vec3 c;
	t = t-tm;
	t = t*t*t;
	v=t;
	v = 10.*t;

	float g = (tm.x-.3)*5.;
	vec3 col0 = vec3(0.,0.,0.);
	vec3 col1 = vec3(.2,.5,1.);
	vec3 col2 = vec3(1.,.8,.7);
	vec3 col3 = vec3(1.,1.,1.);
	if(g > 2.){ 
		c = mix(col2,col3,g-2.);
	}	
	else if(g > 1.){ 
		c = mix(col1,col2,g-1.);
	}	
	else{             
		c = mix(col0,col1,g);
	}

	c = clamp(c,0.,1.);
	v = clamp(v,0.,1.);
	v = c*(1.-v); 
	v = clamp(v,0.,1.);
	if(v==col0){ 
		v=col3*noise(st);
    }

    return v;

}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    vec3 color =  vec3(0.);
    color = effectRound(u_tex0, st);
    color+= postProcessing(u_tex0, st);

	gl_FragColor = vec4(color, 1.0);
}