import { Tuple2, Tuple3, Tuple4 } from "./Vector";
export type Tuple2x2 = [...Tuple2, ...Tuple2];
export type Tuple3x3 = [...Tuple3, ...Tuple3, ...Tuple3];
export type Tuple4x4 = [...Tuple4, ...Tuple4, ...Tuple4, ...Tuple4];
export type TupleNxN = Tuple2x2 | Tuple3x3 | Tuple4x4 | number[];
export type MatrixSource<Tuple extends TupleNxN> = number | Tuple | Matrix<Tuple>;
export declare class Matrix<Tuple extends TupleNxN> {
    private _data;
    readonly size: number;
    readonly length: Tuple["length"];
    constructor(...data: Tuple);
    add(scalar: number): this;
    add(matrix: Matrix<Tuple>): this;
    add(tuple: Tuple): this;
    subtract(scalar: number): this;
    subtract(matrix: Matrix<Tuple>): this;
    subtract(tuple: Tuple): this;
    multiply(scalar: number): this;
    multiply(matrix: Matrix<Tuple>): this;
    multiply(tuple: Tuple): this;
    divide(scalar: number): this;
    divide(matrix: Matrix<Tuple>): this;
    divide(tuple: Tuple): this;
    transpose(): void;
    clone(): Matrix<Tuple>;
    private _tuple;
    get data(): Tuple;
}
export declare class Matrix2 extends Matrix<Tuple2x2> {
}
export declare class Matrix3 extends Matrix<Tuple3x3> {
}
export declare class Matrix4 extends Matrix<Tuple4x4> {
}
export declare namespace MatrixToolbox {
    function tuple<Tuple extends TupleNxN>(length: Tuple["length"], source: MatrixSource<Tuple>): Tuple;
    function fromSource<Tuple extends Tuple2x2>(size: 4, source: MatrixSource<Tuple>): Matrix2;
    function fromSource<Tuple extends Tuple3x3>(size: 9, source: MatrixSource<Tuple>): Matrix3;
    function fromSource<Tuple extends Tuple4x4>(size: 16, source: MatrixSource<Tuple>): Matrix4;
    namespace Projection {
        function orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;
    }
    namespace Transformation {
        function translate(translationX: number, translationY: number, translationZ: number): Matrix4;
        function rotate(angleInDegrees: number, axisX: number, axisY: number, axisZ: number): Matrix4;
        function scale(scaleX: number, scaleY: number, scaleZ: number): Matrix4;
    }
}
