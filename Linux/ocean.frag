#version 330

// File: ocean.frag
// Author: Margaret Dorsey
//
// the fragment shader for our FFT ocean
//

//all the stuff we got from the vertex shader for lighting
in vec3 normal_vector;
in vec3 light_vector;
in vec3 halfway_vector;
in vec2 tex_coord;
in float fog_factor;

//texture
uniform sampler2D water;

//final color of our fragment
out vec4 fragColor;

void main (void) {
	vec3 normal1         = normalize(normal_vector);
	vec3 light_vector1   = normalize(light_vector);
	vec3 halfway_vector1 = normalize(halfway_vector);

	//texture color
	vec4 c = texture(water, tex_coord);
	
	//hard coded light color values
	vec4 emissive_color = vec4(1.0, 1.0, 1.0,  1.0);
	vec4 ambient_color  = vec4(0.0, 0.65, 0.75, 1.0);
	vec4 diffuse_color  = vec4(0.1, 0.45, 0.65, 1.0);
	vec4 specular_color = vec4(1.0, 0.15, 0.1,  1.0);

	float emissive_contribution = 0.00;
	float ambient_contribution  = 0.50;
	float diffuse_contribution  = 0.70;
	float specular_contribution = 1.80;

	//get the angle between the light rays and the normal of our face
	float d = dot(normal1, light_vector1);
	bool facing = d > 0.0;

	//diffuse depends on light angle, specular depends on reflection angle
	fragColor = emissive_color * emissive_contribution +
		    ambient_color  * ambient_contribution  * c +
		    diffuse_color  * diffuse_contribution  * c * max(d, 0) +
                    (facing ?
			specular_color * specular_contribution * c * max(pow(dot(normal1, halfway_vector1), 120.0), 0.0) :
			vec4(0.0, 0.0, 0.0, 0.0));

	//apply some really boring linear fog so that we can't see the end of the water
	//in the distance
	fragColor = fragColor *(1.0-fog_factor) + vec4(.05,.05,.05,1.0)*fog_factor;

	fragColor.a = 1.0;
	
} 