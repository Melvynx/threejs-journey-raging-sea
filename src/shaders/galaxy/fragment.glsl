void main() {
  vec2 vUv = gl_PointCoord;

  float opacity = distance(vUv, vec2(0.5));
  opacity = step(0.5, opacity);
  opacity = 1.0 - opacity;


  gl_FragColor = vec4(vUv.x, vUv.y, 1.0, opacity);
}
