// http://glslsandbox.com/e#28998.1

#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

//varying vec2 surfacePosition;

#define PI 3.1415926535898 // That was from memory, so if things start flying off the screen...

float eps = 1.0/u_resolution.y; 

const int maxIterations = 128;
const float stepScale = 0.5;
float stopThreshold = 2.0/u_resolution.y;

float sphere(in vec3 p, in vec3 centerPos, float radius) {

	return length(p-centerPos) - radius;
}

float sinusoidBumps(in vec3 p){

    return mix((0.75*(cos(p.x*17.+u_time*0.97)*cos(p.y*29.+u_time*1.27))*sin(p.z*23.-u_time*1.31)), (0.5*(sin(p.x*13.+u_time*0.71)*cos(p.y*37.-u_time*1.03)*cos(p.z*11.-u_time*1.13))),clamp(sin(0.75+u_time*0.25),0.1,0.9));
}

    
float scene(in vec3 p) {

	return sphere(p, vec3(0., 0. , 2.), 1.5) + 0.125*sinusoidBumps(p);
}

vec3 getNormal(in vec3 p) {
	
	return normalize(vec3(
		scene(vec3(p.x+eps,p.y,p.z))-scene(vec3(p.x-eps,p.y,p.z)),
		scene(vec3(p.x,p.y+eps,p.z))-scene(vec3(p.x,p.y-eps,p.z)),
		scene(vec3(p.x,p.y,p.z+eps))-scene(vec3(p.x,p.y,p.z-eps))
	));

}

float rayMarching( vec3 origin, vec3 dir, float start, float end ) {
	
	float rayDepth = start;
	for ( int i = 0; i < maxIterations; i++ ) {
		float sceneDist = scene( origin + dir * rayDepth ); // Distance from the point along the ray to the nearest surface point in the scene.
        
		if (( sceneDist < stopThreshold ) || (rayDepth >= end)) {
		
			return rayDepth + sceneDist; 
		}

		rayDepth += sceneDist * stepScale;

	}
	
	return end;
}


void main() {


    // Setting up our screen coordinates: gl_FragCoord.xy represents our screen pixels (or screen coordinates, if you prefer), which range 
    // from [0 to resolution.x] along the x-axis, and [0 to resolution.y] along the y-axis.
    //
    // However, to make calculations easier later on, we'd like have screen coordinates that center on (0.0, 0.0) and also fall within a range 
    // of about [-1.0 to 1.0] along each of the axes. In order for the image to not appear distorted (squashed), we also factor in the screen's 
    // aspect ratio ( screen_width/screen_height ), which in this case is (resolution.x/resolution.y).
    //
    // By the way, you don't actually have to do this. However, having the center of the screen at (0.0, 0.0) just makes life easier... 
    // Besides, I'm a follower, and that what all the cool kids are doing these days.
    
    vec2 aspect = vec2(u_resolution.x/u_resolution.y, 1.0); //
	vec2 screenCoords = (2.0*gl_FragCoord.xy/u_resolution.xy - 1.0)*aspect;

	
	// The camPos vector is the location of our vantage point, eye point, camera position, or whatever else people wish to call it. The lookAt vector 
	// effectively represents the center of the screen we're projecting the rays from the scene onto. In essence, camPos, is the vector position we're
	// looking from, and lookAt is the position of the screen we're looking at, or through, if you prefer.
	
	vec3 lookAt = vec3(0.25,-0.67,2.5);  // This is the point you look towards, or at, if you prefer.
	vec3 camPos = vec3(-0.5, 2.0, -1.5); // This is the point you look from, or camera you look at the scene through. Whichever way you wish to look at it.
	
	// The following uses the above and some pretty standard vector math to set up the screen that we're going to project onto. Use the lookAt and camPos
	// vectors to contruct a forward vector. Use that vector to construct a vector perpendicular to it, namely the "right" vector, then cross product
	// the forward vector with the "right" vector to produce the "up" vector. All three of these are used to construct the unit direction ray, namely, 
	// "rd" that will be cast off into the scene from our vantage point (aka, eye, camera position, etc) , which we've called camPos.
    
    // Camera setup.
    vec3 forward = normalize(lookAt-camPos); // Forward vector.
    vec3 right = normalize(vec3(forward.z, 0., -forward.x )); // Right vector... or is it left? Either way, so long as the correct-facing up-vector is produced.
    vec3 up = normalize(cross(forward,right)); // Cross product the two vectors above to get the up vector.
     
    // FOV - Field of view. Make it bigger, and the screen covers a larger area, which means more of the scene can be seen. This, in turn, means that our 
    // objects will appear smaller.
    float FOV = 0.67;
    
    // ro - Ray origin. Every ray starts from this point, then is cast in the rd direction.
    vec3 ro = camPos; 
    // rd - Ray direction. This is our one-unit-long direction ray. 
    vec3 rd = normalize(forward + FOV*screenCoords.x*right + FOV*screenCoords.y*up);
    
    

	// The screen's background color.
    vec3 bgcolor = vec3(1.,0.97,0.92)*0.5;
    // Oh great, another obfuscated mess to decipher. I could have left the background alone, but I wanted to give it a bit of a fake backlight. 
    // Then, I wanted to shape it a bit, etc. It's not essential, but it looks a little nicer.
    float bgshade = (1.0-length(vec2(screenCoords.x/aspect.x, screenCoords.y+1.5) )*0.8);
	bgcolor *= bgshade; //Shade the background a little.

	
	// Ray marching.
	// Set the near and far clipping planes, then supply them - along with the ray origin and ray direction vectors - to the rayMarching routine.
	// If a surface point in the scene is hit, a distance value (dist) less than the maximum value (clipFar) will be returned.
	const float clipNear = 0.0;
	const float clipFar = 4.0;
	float dist = rayMarching(ro, rd, clipNear, clipFar );
	if ( dist >= clipFar ) {
	    gl_FragColor = vec4(bgcolor, 1.0);
	    return;
	}
	
	vec3 sp = ro + rd*dist;
	
	// We can use the surface position to calculate the surface normal using a bit of vector math. I remember having to give long, drawn-out, 
	// sleep-inducing talks at uni on implicit surface geometry (or something like that) that involved normals on 3D surfaces and such. 
	// I barely remember the content, but I definitely remember there was always this hot chick in the room with a gigantic set of silicons who
	// looked entirely out of place amongst all the nerds... and this was back in the days when those things weren't as common... Um, I forgot 
	// where I was going with this.
	//
	// Anyway, check out the function itself. It's a standard, but pretty clever way to get a surface normal on difficult-to-differentiate surfaces.
	vec3 surfNormal = getNormal(sp);
	
	// Lighting. Just the one light. It needs to have a position, a direction and a color. Obviously, it should be positioned away from the 
	// object's surface. The direction vector is the normalized vector running from the light position to the object's surface point that we're
	// going to illuminate. You can choose any light color you want, but it's probably best to choose a color that works best with the colors
	// in the scene. I've gone for a warmish white.
	
	// lp - Light position. I've arrange for it to move in a bit of a circle about the xy-plane a couple of units away from the spherical object.
	vec3 lp = vec3(cos(2.5*sin(u_time*0.125)), 1.75-0.5*cos(u_time*0.125), 0.0);
	// ld - Light direction. The point light direction goes from the light's position to the surface point we've hit on the sphere. I haven't
	// normalized it yet, because I'd like to take the length first, but it will be.
	vec3 ld = lp-sp;
	// lcolor - Light color. I have it in my head that light globes give off this color, but I swear I must have pulled that information right 
	// out of my a... Choose any color you want.
	vec3 lcolor = vec3(0.925,0.97,0.92);
	
	
	// Light falloff (attenuation), which depends on how far the surface point is from the light. Most of the time, I guess the falloff rate should be 
	// mixtures of inverse distance powers, but in real life, it's far more complicated than that. Either way, most of the time you should simply 
	// choose whatever makes the lighting look a little prettier. For instance, if things look too dark, I might decide to make the falloff drop off
	// linearly, without any other terms. In this case, the light is falling off with the square of the distance, and no other terms.

	float len = length( ld ); // Distance from the light to the surface point.
	ld /= len; // Normalizing the light-to-surface, aka light-direction, vector.
	float lightAtten = min( 1.0 / ( 0.25*len*len ), 1.0 ); // Keeps things between 0 and 1.
	
	// The unit-length, reflected vector. Angle of incidence equals angle of reflection, if you remember rudimentary highschool physics, or math.
	// Anyway, the incident (incoming... for want of a better description) vector is the vector representing our line of sight from the light position 
	// to the point on the suface of the object we've just hit. We get the reflected vector on the surface of the object by doing a quick calculation 
	// between the incident vector and the surface normal. The reflect function is ( ref=incidentNorm-2.0*dot(incidentNorm, surfNormal)*surfNormal ), 
	// or something to that effect. Either way, there's a function for it, which is used below.
	//
	// The reflected vector is useful, because we can use it to calculate the specular reflection component. For all intents and purposes, specular light 
	// is the light gathered in the mirror direction. I like it, because it looks pretty, and I like pretty things. One of the most common mistakes made
	// with regard to specular light calculations is getting the vector directions wrong, and I've made the mistake more than a few times. So, if you
	// notice I've got the signs wrong, or anything, feel free to let me know.
	vec3 ref = reflect(-ld, surfNormal); 
	

    // Start with black. If we had global ambient lighting, then I guess we could add it here, or later. It's a preference thing.
	vec3 sceneColor = vec3(0.0);
	
	// The spherical object's color. My favorite color is black, but I don't think that will work, so I've gone with something greenish.
	vec3 objColor = vec3(0.7, 1.0, 0.3);
	// Just some really lame, fake shading/coloring for the object. You can comment the two lines out with no consequence.
	float bumps =  sinusoidBumps(sp);
    	objColor = clamp(objColor*0.8-vec3(0.4, 0.2, 0.1)*bumps, 0.0, 1.0);

	
	float ambient = .1; //The object's ambient property. You can also have a global and light ambient property, but we'll try to keep things simple.
	float specularPower = 8.0; // The power of the specularity. Higher numbers can give the object a harder, shinier look.
	float diffuse = max( 0.0, dot(surfNormal, ld) ); //The object's diffuse value, which depends on the angle that the light hits the object.
	//The object's specular value, which depends on the angle that the reflected light hits the object, and the viewing angle... kind of.
	float specular = max( 0.0, dot( ref, normalize(camPos-sp)) ); 
	specular = pow(specular, specularPower); // Ramping up the specular value to the specular power for a bit of shininess.
		
	// Bringing all the lighting components togethr to color the screen pixel.
	sceneColor += lcolor*lightAtten*objColor*(diffuse*0.8+specular*0.5+ambient);

    // Clamping the lit pixel between black and while, then putting it on the screen.
	gl_FragColor = vec4(clamp(sceneColor, 0.0, 1.0), 1.0);
	
}