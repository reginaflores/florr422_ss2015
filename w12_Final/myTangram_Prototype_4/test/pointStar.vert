#define PI 3.141592653589793

attribute vec3 color;

uniform float minSize;
uniform float maxBokehSize;
uniform float dofCurve;

uniform float pixelRatio;
uniform float aspectRatio;

uniform float elapsedTime;
uniform vec3 center;
uniform vec3 focalPoint;

varying vec3 vColor;
varying float bokehPower;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
	vColor = color;
	vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

	vec3 a = position + (center - focalPoint);
	vec3 b = cameraPosition + (center - focalPoint);
	float projDist = dot(a, b) / length(b);

	float wobble = sin(2.0*PI*(elapsedTime*(rand(position.xy)+0.05) + rand(position.xy)));
	// float wobble = 1.0;

	bokehPower = pow(smoothstep(0.0, 0.6, abs(projDist)), dofCurve);
	bokehPower += ((wobble - 1.0) * 0.3) * bokehPower;

	gl_PointSize = minSize + maxBokehSize * bokehPower;
	gl_PointSize = gl_PointSize / length(mvPosition.xyz) * aspectRatio;

	// gl_PointSize = 50.0 / length(mvPosition.xyz) * (5.0*rand(position.xz)+4.0) / ;
	
	gl_Position = projectionMatrix * mvPosition;
}