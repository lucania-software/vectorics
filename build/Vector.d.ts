type ComponentWiseOperation = (operandA: number, operandB: number) => number;
export type Tuple2 = [number, number];
export type Tuple3 = [number, number, number];
export type Tuple4 = [number, number, number, number];
export type TupleN = Tuple2 | Tuple3 | Tuple4 | number[];
export type VectorSource<Tuple extends TupleN> = number | Tuple | Vector<Tuple>;
export declare class Vector<Tuple extends TupleN> {
    private _components;
    constructor(...components: Tuple);
    add(scalar: number): this;
    add(vector: Vector<Tuple>): this;
    add(array: Tuple): this;
    subtract(scalar: number): this;
    subtract(vector: Vector<Tuple>): this;
    subtract(array: Tuple): this;
    multiply(scalar: number): this;
    multiply(vector: Vector<Tuple>): this;
    multiply(array: Tuple): this;
    divide(scalar: number): this;
    divide(vector: Vector<Tuple>): this;
    divide(array: Tuple): this;
    set(scalar: number): this;
    set(vector: Vector<Tuple>): this;
    set(array: Tuple): this;
    normalize(): this;
    dot(value: Vector<Tuple>): number;
    distance(vector: Vector<Tuple>): number;
    clone(): Vector<[...Tuple]>;
    getSum(): number;
    getMagnitude(): number;
    operation(value: VectorSource<Tuple>, operation: ComponentWiseOperation): this;
    toString(): string;
    get size(): Tuple["length"];
    get components(): Tuple;
}
export declare class Vector2 extends Vector<Tuple2> {
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
    clone(): Vector2;
}
export declare class Vector3 extends Vector<Tuple3> {
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get z(): number;
    set z(value: number);
    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
    get depth(): number;
    set depth(value: number);
    cross(vector: Vector3): this;
    clone(): Vector3;
}
export declare class Vector4 extends Vector<Tuple4> {
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get z(): number;
    set z(value: number);
    get w(): number;
    set w(value: number);
    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
    clone(): Vector4;
}
export declare namespace VectorToolbox {
    function tuple<Tuple extends TupleN>(size: Tuple["length"], source: VectorSource<Tuple>): Tuple;
    function fromSource<Tuple extends Tuple2>(size: 2, source: VectorSource<Tuple>): Vector2;
    function fromSource<Tuple extends Tuple3>(size: 3, source: VectorSource<Tuple>): Vector3;
    function fromSource<Tuple extends Tuple4>(size: 4, source: VectorSource<Tuple>): Vector4;
}
export {};
