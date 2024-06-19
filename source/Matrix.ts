import { Tuple2, Tuple3, Tuple4, Vector, Vector2, Vector3, Vector4 } from "./Vector";

export type Tuple2x2 = [...Tuple2, ...Tuple2];
export type Tuple3x3 = [...Tuple3, ...Tuple3, ...Tuple3];
export type Tuple4x4 = [...Tuple4, ...Tuple4, ...Tuple4, ...Tuple4];
export type TupleNxN = Tuple2x2 | Tuple3x3 | Tuple4x4 | number[];
export type MatrixSource<Tuple extends TupleNxN> = number | Tuple | Matrix<Tuple>;

export class Matrix<Tuple extends TupleNxN> {

    private _data: Tuple;
    public readonly size: number;
    public readonly length: Tuple["length"];

    public constructor(...data: Tuple) {
        this._data = data;
        this.size = Math.sqrt(data.length);
        this.length = data.length;
    }

    public get(row: number, column: number) {
        return this._data[row * this.size + column];
    }

    public add(scalar: number): this;
    public add(matrix: Matrix<Tuple>): this;
    public add(tuple: Tuple): this;
    public add(value: MatrixSource<Tuple>) {
        const data = this._tuple(value);
        this._data.map((_, index) => this._data[index] += data[index]);
        return this;
    }

    public subtract(scalar: number): this;
    public subtract(matrix: Matrix<Tuple>): this;
    public subtract(tuple: Tuple): this;
    public subtract(value: MatrixSource<Tuple>) {
        const data = this._tuple(value);
        this._data.forEach((_, index) => this._data[index] -= data[index]);
        return this;
    }

    public multiply(scalar: number): this;
    public multiply(matrix: Matrix<Tuple>): this;
    public multiply(tuple: Tuple): this;
    public multiply(value: MatrixSource<Tuple>) {
        const data = this._tuple(value);
        const result = new Array(data.length).fill(0) as Tuple;
        for (let resultRow = 0; resultRow < this.size; resultRow++) {
            for (let resultColumn = 0; resultColumn < this.size; resultColumn++) {
                let sum = 0;
                for (let i = 0; i < this.size; i++) {
                    sum += this._data[resultRow * this.size + i] * data[i * this.size + resultColumn];
                }
                result[resultRow * this.size + resultColumn] = sum;
            }
        }
        this._data = result;
        return this;
    }

    public multiplyVector(vector: Vector<number[]>) {
        if (vector.size !== this.size) {
            throw new Error(`Cannot multiply ${vector.size} component vector by ${this.size}x${this.size} matrix.`);
        }
        const result = vector.clone().set(0);
        for (let row = 0; row < this.size; row++) {
            for (let column = 0; column < this.size; column++) {
                result.components[row] += this.get(row, column) * vector.components[column];
            }
        }
        return result;
    }

    public divide(scalar: number): this;
    public divide(matrix: Matrix<Tuple>): this;
    public divide(tuple: Tuple): this;
    public divide(value: MatrixSource<Tuple>) {
        const data = this._tuple(value);
        this._data.forEach((_, index) => this._data[index] /= data[index]);
        return this;
    }

    public inverse() {
        this._data.forEach((value, index) => this._data[index] = 1 / value);
        return this;
    }

    public transpose() {
        const matrix = this.clone();
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                matrix._data[i * this.size + j] = this._data[j * this.size + i];
            }
        }
        this._data = matrix._data;
        return this;
    }

    public clone(): Matrix<Tuple> {
        return new Matrix(...this._data);
    }

    private _tuple(value: MatrixSource<Tuple>): Tuple {
        if (typeof value === "number") {
            return new Array(this.length).fill(value) as Tuple;
        } else if (value instanceof Matrix) {
            return value._data;
        } else {
            return value;
        }
    }

    public get data() {
        return this._data;
    }

    public toString(fractionDigits: number = 2) {
        const maximumLength = this._data.reduce((length, value) => {
            const newLength = value.toFixed(fractionDigits).length;
            return newLength > length ? newLength : length;
        }, 0);
        const lines = [];
        let line;
        for (let i = 0; i < this.size; i++) {
            line = [];
            for (let j = 0; j < this.size; j++) {
                line.push(this._data[i * this.size + j].toFixed(fractionDigits).padStart(maximumLength, " "));
            }
            lines.push(`[ ${line.join(", ")} ]`);
        }
        return lines.join("\n");
    }

    public static tuple<Tuple extends TupleNxN>(length: Tuple["length"], source: MatrixSource<Tuple>): Tuple {
        if (typeof source === "number") {
            return new Array(length).fill(source) as Tuple;
        } else if (source instanceof Matrix) {
            return source.data;
        } else {
            return source;
        }
    }

    public static fromSource<Tuple extends Tuple2x2>(size: 4, source: MatrixSource<Tuple>): Matrix2;
    public static fromSource<Tuple extends Tuple3x3>(size: 9, source: MatrixSource<Tuple>): Matrix3;
    public static fromSource<Tuple extends Tuple4x4>(size: 16, source: MatrixSource<Tuple>): Matrix4;
    public static fromSource<Tuple extends TupleNxN>(size: Tuple["length"], source: MatrixSource<Tuple>) {
        const tuple = Matrix.tuple(size, source);
        switch (size) {
            case 2: return new Matrix2(...tuple as Tuple2x2);
            case 3: return new Matrix3(...tuple as Tuple3x3);
            case 4: return new Matrix4(...tuple as Tuple4x4);
            default: return new Matrix(...tuple);
        }
    }

}

export class Matrix2 extends Matrix<Tuple2x2> {

    public static identity() {
        return new Matrix2(
            1, 0,
            0, 1
        );
    }

    public multiplyVector(vector: Vector2): Vector2;
    public multiplyVector(vector: Vector<number[]>): Vector<number[]> {
        return super.multiplyVector(vector);
    }

}

export class Matrix3 extends Matrix<Tuple3x3> {

    public static identity() {
        return new Matrix3(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        );
    }

    public multiplyVector(vector: Vector3): Vector3;
    public multiplyVector(vector: Vector<number[]>): Vector<number[]> {
        return super.multiplyVector(vector);
    }

}

export class Matrix4 extends Matrix<Tuple4x4> {

    public static identity() {
        return new Matrix4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
    }

    public multiplyVector(vector: Vector4): Vector4;
    public multiplyVector(vector: Vector<number[]>): Vector<number[]> {
        return super.multiplyVector(vector);
    }

    public static orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4 {
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

    public static translate(translationX: number, translationY: number, translationZ: number): Matrix4 {
        return new Matrix4(
            1, 0, 0, translationX,
            0, 1, 0, translationY,
            0, 0, 1, translationZ,
            0, 0, 0, 1
        );
    }

    public static rotate(angleInDegrees: number, axisX: number, axisY: number, axisZ: number): Matrix4 {
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

    public static scale(scaleX: number, scaleY: number, scaleZ: number): Matrix4 {
        return new Matrix4(
            scaleX, 0, 0, 0,
            0, scaleY, 0, 0,
            0, 0, scaleZ, 0,
            0, 0, 0, 1
        );
    }

}