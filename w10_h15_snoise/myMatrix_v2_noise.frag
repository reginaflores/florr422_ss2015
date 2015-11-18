

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random(float x){
    return fract(sin(x)*43758.5453);
}

float random(vec2 st){
    return fract(sin(dot(st.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float noise (vec2 st) {
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

   float A = random(i_st);
   float B = random(i_st+vec2(1., 0.));
   float C = random(i_st+vec2(0., 1.));
   float D = random(i_st+vec2(1., 1.));

   f_st = smoothstep(vec2(0.), vec2(1.), f_st);

   return  mix(A, B, f_st.x)+
              (C-A)*f_st.y*(1.-f_st.x)+
              (D-B)*f_st.x*f_st.y;

}



void main(){
	vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.);

    //scale up the canvas
    st *= 50.;

    vec2 i_st = floor(st);
    vec2 i_ft = fract(st);

    // //gives the moving down movement
    i_st += vec2(.0,floor(u_time*30.*random(i_st.x)));

    //gives the check/noise effect
    float pct = noise(i_st);
    float pct2 = noise(i_st);
    color = vec3(pct*pct2);

    //gives the glow look
    float cir = dot(0.8-noise(i_ft)*i_ft,i_ft*noise(i_ft))*10.;
    color *= cir;

    //gives the green and black look like the Matrix Movie
    color += vec3(0., 0., 1.)-1.;

	gl_FragColor = vec4(color,1.0);
}





