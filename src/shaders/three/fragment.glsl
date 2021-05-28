uniform vec3 uColor;

void main() {
  vec2 vUv = gl_PointCoord;

  float opacity = distance(vUv, vec2(0.5));
  opacity = step(0.5, opacity);
  opacity = 1.0 - opacity;

  vec3 cColor = vec3(uColor);
  cColor.r += vUv.x * 0.1;

  gl_FragColor = vec4(cColor, opacity);
}
