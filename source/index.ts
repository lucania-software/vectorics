import { MatrixToolbox } from "./Matrix";
import { VectorToolbox } from "./Vector";

export * from "./Matrix";
export * from "./Vector";

export namespace Toolbox {

    export const Vector = VectorToolbox;
    export const Matrix = MatrixToolbox;

}