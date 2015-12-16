#define PI 3.141592653589793

varying vec3 vColor;
varying float bokehPower;

uniform float alpha;
uniform float elapsedTime;
uniform sampler2D texture;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
	gl_FragColor = texture2D( texture, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) );
	gl_FragColor.rgb *= 1.0 - pow(bokehPower, 0.02);
	// gl_FragColor = vec4(bokehPower, 1.0-bokehPower, 1.0-bokehPower, 1.0);
}