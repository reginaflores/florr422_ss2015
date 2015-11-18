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
    vec3 color = vec3(0.);
    // Scale the coordinate system to see
    // some noise in action

 ////////////////////////////////////////////////////////////
 ////////////////////////////////////////////////////////////   
////////////////////////////////////////////////////////////

//answering book questions:


    //hook up the noise level to the mouse coordinates:
    // vec2 pos = vec2(st*u_mouse);

    //vertical lines
    //note that when y-coord is 0 you get vertical lines
    // vec2 pos = vec2(st*vec2(30., 0.));

    //horitontal lines
    //note that when x-coord is 0 you get horizontal lines
//Version 1:
    // vec2 pos1 = vec2(st*vec2(0., 3.));
    // vec2 pos2 = vec2(st*vec2(0., 1.));
    // vec2 pos3 = vec2(st*vec2(0., 0.));

//Version2:
    vec2 pos1 = vec2(st*vec2(2., 0.));
    vec2 pos2 = vec2(st*vec2(3., 0.));
    vec2 pos3 = vec2(st*vec2(1., 0.));

 ////////////////////////////////////////////////////////////
 ////////////////////////////////////////////////////////////   
////////////////////////////////////////////////////////////
    // Use the noise function
    float n1 = noise(pos1);
    float n2 = noise(pos2);
    float n3 = noise(pos3);

    // color = vec3(n1, 0.1, 0.4);
    color = vec3(n1, n2, n3);

    gl_FragColor = vec4(color, 1.);
}