uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorMultiplier;
uniform float uColorOffset;

uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

varying float vElevation;

void main() {
  float elevation = (vElevation + uColorOffset) * uColorMultiplier;
  vec3 color = mix(uDepthColor, uSurfaceColor, elevation);

  gl_FragColor = vec4(color, 1.0);

  #ifdef USE_FOG
    #ifdef USE_LOGDEPTHBUF_EXT
        float depth = gl_FragDepthEXT / gl_FragCoord.w;
    #else
        float depth = gl_FragCoord.z / gl_FragCoord.w;
    #endif
    float fogFactor = smoothstep( fogNear, fogFar, depth );
    gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
  #endif
}
