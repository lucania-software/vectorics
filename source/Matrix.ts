import { Tuple2, Tuple3, Tuple4 } from "./Vector";

export type Tuple2x2 = [...Tuple2, ...Tuple2];
export type Tuple3x3 = [...Tuple3, ...Tuple3, ...Tuple3];
export type Tuple4x4 = [...Tuple4, ...Tuple4, ...Tuple4, ...Tuple4];
export type TupleNxN = Tuple2x2 | Tuple3x3 | Tuple4x4 | number[];
export type MatrixSource<Tuple extends TupleNxN> = number | Tuple | Matrix<Tuple>;

export class Matrix<Tuple extends TupleNxN> {

    public data: Tuple;
    public readonly size: number;

    public constructor(...data: Tuple) {
        this.data = data;
        this.size = Math.sqrt(data.length);
    }

    public add(scalar: number): this;
    public add(matrix: Matrix<Tuple>): this;
    public add(tuple: Tuple): this;
    public add(value: MatrixSource<Tuple>) {
        const data = this._tuple(value);
        this.data.map((_, index) => this.data[index] += data[index]);
        return this;
    }

    public subtract(scalar: number): this;
    public subtract(matrix: Matrix<Tuple>): this;
    public subtract(tuple: Tuple): this;
    public subtract(value: MatrixSource<Tuple>) {
        const data = this._tuple(value);
        this.data.forEach((_, index) => this.data[index] -= data[index]);
        return this;
    }

    public multiply(scalar: number): this;
    public multiply(matrix: Matrix<Tuple>): this;
    public multiply(tuple: Tuple): this;
    public multiply(value: MatrixSource<Tuple>) {
        const data = this._tuple(value);
        this.data.forEach((_, index) => this.data[index] *= data[index]);
        return this;
    }

    public divide(scalar: number): this;
    public divide(matrix: Matrix<Tuple>): this;
    public divide(tuple: Tuple): this;
    public divide(value: MatrixSource<Tuple>) {
        const data = this._tuple(value);
        this.data.forEach((_, index) => this.data[index] /= data[index]);
        return this;
    }

    public transpose() {
        const matrix = this.clone();
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                matrix.data[i * this.size + j] = this.data[j];
            }
        }
        this.data = matrix.data;
    }

    public clone(): Matrix<Tuple> {
        return new Matrix(...this.data);
    }

    private _tuple(value: MatrixSource<Tuple>): Tuple {
        if (typeof value === "number") {
            return new Array(this.size).fill(value) as Tuple;
        } else if (value instanceof Matrix) {
            return value.data;
        } else {
            return value;
        }
    }

}

export class Matrix2 extends Matrix<Tuple2x2> { }

export class Matrix3 extends Matrix<Tuple3x3> { }

export class Matrix4 extends Matrix<Tuple4x4> { }

export namespace MatrixToolbox {

    export function tuple<Tuple extends TupleNxN>(size: Tuple["length"], source: MatrixSource<Tuple>): Tuple {
        if (typeof source === "number") {
            return new Array(size).fill(source) as Tuple;
        } else if (source instanceof Matrix) {
            return source.data;
        } else {
            return source;
        }
    }

    export function fromSource<Tuple extends Tuple2x2>(size: 4, source: MatrixSource<Tuple>): Matrix2;
    export function fromSource<Tuple extends Tuple3x3>(size: 9, source: MatrixSource<Tuple>): Matrix3;
    export function fromSource<Tuple extends Tuple4x4>(size: 16, source: MatrixSource<Tuple>): Matrix4;
    export function fromSource<Tuple extends TupleNxN>(size: Tuple["length"], source: MatrixSource<Tuple>) {
        const tuple = MatrixToolbox.tuple(size, source);
        switch (size) {
            case 2: return new Matrix2(...tuple as Tuple2x2);
            case 3: return new Matrix3(...tuple as Tuple3x3);
            case 4: return new Matrix4(...tuple as Tuple4x4);
            default: return new Matrix(...tuple);
        }
    }

    export namespace Projection {

        export function orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4 {
            const width = right - left;
            const height = top - bottom;
            const depth = far - near;
            const translationX = -(right + left) / width;
            const translationY = -(top + bottom) / height;
            const translationZ = -(far + near) / depth;
            return new Matrix4(
                2 / width, 0, 0, translationX,
                0, 2 / height, 0, translationY,
                0, 0, -2 / depth, translationZ,
                0, 0, 0, 1
            );
        }

    }


    export namespace Transformation {

        export function translate(translationX: number, translationY: number, translationZ: number): Matrix4 {
            return new Matrix4(
                1, 0, 0, translationX,
                0, 1, 0, translationY,
                0, 0, 1, translationZ,
                0, 0, 0, 1
            );
        }

        export function rotate(angleInDegrees: number, axisX: number, axisY: number, axisZ: number): Matrix4 {
            const angleInRadians = angleInDegrees * globalThis.Math.PI / 180;
            const cosAngle = globalThis.Math.cos(angleInRadians);
            const sinAngle = globalThis.Math.sin(angleInRadians);
            const oneMinusCos = 1 - cosAngle;

            const tx = oneMinusCos * axisX;
            const ty = oneMinusCos * axisY;
            const tz = oneMinusCos * axisZ;
            const txy = tx * axisY;
            const txz = tx * axisZ;
            const tyz = ty * axisZ;
            const sinX = sinAngle * axisX;
            const sinY = sinAngle * axisY;
            const sinZ = sinAngle * axisZ;

            return new Matrix4(
                tx * axisX + cosAngle, txy - sinZ, txz + sinY, 0,
                txy + sinZ, ty * axisY + cosAngle, tyz - sinX, 0,
                txz - sinY, tyz + sinX, tz * axisZ + cosAngle, 0,
                0, 0, 0, 1
            );
        }

        export function scale(scaleX: number, scaleY: number, scaleZ: number): Matrix4 {
            return new Matrix4(
                scaleX, 0, 0, 0,
                0, scaleY, 0, 0,
                0, 0, scaleZ, 0,
                0, 0, 0, 1
            );
        }

    }

}