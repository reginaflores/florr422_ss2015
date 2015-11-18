#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// 2D Random
float random (in vec2 st) { 
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners porcentages
    return mix(a, b, u.x) + 
            (c - a)* u.y * (1.0 - u.x) + 
            (d - b) * u.x * u.y;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    // Scale the coordinate system to see
    // some noise in action

 ////////////////////////////////////////////////////////////
 ////////////////////////////////////////////////////////////   
////////////////////////////////////////////////////////////

//answering book questions:

    //change the multipier and animate the noise:
    // vec2 pos = vec2(st*12.0*cos(u_time/2.));

    //at what level does the noise start to look random again?
    //somewhere between 40 and 50:
    // vec2 pos = vec2(st*50.0);

    //At what zoom level is the noise is imperceptible?
    //at 100 there is still that haze present
    //around 150 the noise starts to become impercebtable
    // vec2 pos = vec2(st*150.0);

    //hook up the noise level to the mouse coordinates:
    vec2 pos = vec2(st*u_mouse);

 ////////////////////////////////////////////////////////////
 ////////////////////////////////////////////////////////////   
////////////////////////////////////////////////////////////
    // Use the noise function
    float n = noise(pos);

    gl_FragColor = vec4(vec3(n), 1.0);
}