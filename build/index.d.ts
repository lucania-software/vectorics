import { MatrixToolbox } from "./Matrix";
import { VectorToolbox } from "./Vector";
export * from "./Matrix";
export * from "./Vector";
export declare namespace Toolbox {
    const Vector: typeof VectorToolbox;
    const Matrix: typeof MatrixToolbox;
}
