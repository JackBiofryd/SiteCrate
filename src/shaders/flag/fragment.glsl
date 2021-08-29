uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
  vec4 color = texture2D(uTexture, vUv);
  vec4 darkeningVector = vec4(0.7);
  gl_FragColor = color * darkeningVector;
}