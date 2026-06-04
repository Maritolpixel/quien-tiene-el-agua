import { ScatterplotLayer } from "@deck.gl/layers";

export class SquareScatterplotLayer extends ScatterplotLayer {
  getShaders() {
    const shaders = super.getShaders();

    shaders.fs = shaders.fs.replace(
      "length(unitPosition)",
      "max(abs(unitPosition.x), abs(unitPosition.y))"
    );
    return shaders;
  }
}
