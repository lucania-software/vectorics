type ComponentWiseOperation = (operandA: number, operandB: number) => number;

export type Tuple2 = [number, number];
export type Tuple3 = [number, number, number];
export type Tuple4 = [number, number, number, number];
export type TupleN = Tuple2 | Tuple3 | Tuple4 | number[];
export type VectorSource<Tuple extends TupleN> = number | Tuple | Vector<Tuple>;

export class Vector<Tuple extends TupleN> {

    private _components: Tuple;

    public constructor(...components: Tuple) {
        this._components = components;
    }

    public add(scalar: number): this;
    public add(vector: Vector<Tuple>): this;
    public add(array: Tuple): this;
    public add(value: VectorSource<Tuple>) { return this.operation(value, (a, b) => a + b); }

    public subtract(scalar: number): this;
    public subtract(vector: Vector<Tuple>): this;
    public subtract(array: Tuple): this;
    public subtract(value: VectorSource<Tuple>) { return this.operation(value, (a, b) => a - b); }

    public multiply(scalar: number): this;
    public multiply(vector: Vector<Tuple>): this;
    public multiply(array: Tuple): this;
    public multiply(value: VectorSource<Tuple>) { return this.operation(value, (a, b) => a * b); }

    public divide(scalar: number): this;
    public divide(vector: Vector<Tuple>): this;
    public divide(array: Tuple): this;
    public divide(value: VectorSource<Tuple>) { return this.operation(value, (a, b) => a / b); }

    public set(scalar: number): this;
    public set(vector: Vector<Tuple>): this;
    public set(array: Tuple): this;
    public set(value: VectorSource<Tuple>) { return this.operation(value, (_, b) => b); }

    public normalize() { return this.operation(this.getMagnitude(), (a, b) => a / b); }

    public dot(value: Vector<Tuple>) { return this.clone().multiply(value).getSum(); }

    public distance(vector: Vector<Tuple>) {
        const difference = this.clone().subtract(vector);
        return Math.sqrt(difference.multiply(difference).getSum());
    }

    public clone(): Vector<Tuple> {
        return new Vector(...this._components as Tuple);
    }

    public getSum() {
        return this._components.reduce((sum, value) => sum + value);
    }

    public getMagnitude() {
        return this.distance(this.clone().set(0));
    }

    public operation(value: VectorSource<Tuple>, operation: ComponentWiseOperation) {
        if (typeof value === "number") {
            for (let i = 0; i < this._components.length; i++) {
                this._components[i] = operation(this._components[i], value);
            }
        } else if (value instanceof Vector) {
            for (let i = 0; i < this._components.length; i++) {
                this._components[i] = operation(this._components[i], value._components[i]);
            }
        } else {
            for (let i = 0; i < this._components.length; i++) {
                this._components[i] = operation(this._components[i], value[i as never]);
            }
        }
        return this;
    }

    public toString() {
        return `[ ${this._components.join(", ")} ]`;
    }

    public get size(): Tuple {
        return this._components.length as unknown as Tuple;
    }

    public get components() {
        return this._components;
    }

}

export class Vector2 extends Vector<Tuple2> {

    public get x() { return this.components[0]; }
    public set x(value: number) { this.components[0] = value; }
    public get y() { return this.components[1]; }
    public set y(value: number) { this.components[1] = value; }

    public get width() { return this.x; }
    public set width(value: number) { this.x = value; }
    public get height() { return this.y; }
    public set height(value: number) { this.y = value; }

}

export class Vector3 extends Vector<Tuple3> {

    public get x() { return this.components[0]; }
    public set x(value: number) { this.components[0] = value; }
    public get y() { return this.components[1]; }
    public set y(value: number) { this.components[1] = value; }
    public get z() { return this.components[2]; }
    public set z(value: number) { this.components[2] = value; }

    public get width() { return this.x; }
    public set width(value: number) { this.x = value; }
    public get height() { return this.y; }
    public set height(value: number) { this.y = value; }
    public get depth() { return this.z; }
    public set depth(value: number) { this.z = value; }

    public cross(vector: Vector3) {
        return this.set([
            this.y * vector.z - this.z * vector.y,
            this.z * vector.x - this.x * vector.z,
            this.x * vector.y - this.y * vector.x
        ]);
    }

}

export class Vector4 extends Vector<Tuple4> {

    public get x() { return this.components[0]; }
    public set x(value: number) { this.components[0] = value; }
    public get y() { return this.components[1]; }
    public set y(value: number) { this.components[1] = value; }
    public get z() { return this.components[2]; }
    public set z(value: number) { this.components[2] = value; }
    public get w() { return this.components[3]; }
    public set w(value: number) { this.components[3] = value; }

    public get width() { return this.z; }
    public set width(value: number) { this.z = value; }
    public get height() { return this.w; }
    public set height(value: number) { this.w = value; }

}

export namespace VectorToolbox {

    export function tuple<Tuple extends TupleN>(size: Tuple["length"], source: VectorSource<Tuple>): Tuple {
        if (typeof source === "number") {
            return new Array(size).fill(source) as Tuple;
        } else if (source instanceof Vector) {
            return source.components;
        } else {
            return source;
        }
    }

    export function fromSource<Tuple extends Tuple2>(size: 2, source: VectorSource<Tuple>): Vector2;
    export function fromSource<Tuple extends Tuple3>(size: 3, source: VectorSource<Tuple>): Vector3;
    export function fromSource<Tuple extends Tuple4>(size: 4, source: VectorSource<Tuple>): Vector4;
    export function fromSource<Tuple extends TupleN>(size: Tuple["length"], source: VectorSource<Tuple>) {
        const tuple = VectorToolbox.tuple(size, source);
        switch (size) {
            case 2: return new Vector2(...tuple as Tuple2);
            case 3: return new Vector3(...tuple as Tuple3);
            case 4: return new Vector4(...tuple as Tuple4);
            default: return new Vector(...tuple);
        }
    }

}