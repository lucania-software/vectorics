(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Vectorics = {}));
})(this, (function (exports) { 'use strict';

    class Matrix {
        _data;
        size;
        length;
        constructor(...data) {
            this._data = data;
            this.size = Math.sqrt(data.length);
            this.length = data.length;
        }
        add(value) {
            const data = this._tuple(value);
            this._data.map((_, index) => this._data[index] += data[index]);
            return this;
        }
        subtract(value) {
            const data = this._tuple(value);
            this._data.forEach((_, index) => this._data[index] -= data[index]);
            return this;
        }
        multiply(value) {
            const data = this._tuple(value);
            this._data.forEach((_, index) => this._data[index] *= data[index]);
            return this;
        }
        divide(value) {
            const data = this._tuple(value);
            this._data.forEach((_, index) => this._data[index] /= data[index]);
            return this;
        }
        transpose() {
            const matrix = this.clone();
            for (let i = 0; i < this.size; i++) {
                for (let j = 0; j < this.size; j++) {
                    matrix._data[i * this.size + j] = this._data[j];
                }
            }
            this._data = matrix._data;
        }
        clone() {
            return new Matrix(...this._data);
        }
        _tuple(value) {
            if (typeof value === "number") {
                return new Array(this.length).fill(value);
            }
            else if (value instanceof Matrix) {
                return value._data;
            }
            else {
                return value;
            }
        }
        get data() {
            return this._data;
        }
    }
    class Matrix2 extends Matrix {
    }
    class Matrix3 extends Matrix {
    }
    class Matrix4 extends Matrix {
    }
    exports.MatrixToolbox = void 0;
    (function (MatrixToolbox) {
        function tuple(length, source) {
            if (typeof source === "number") {
                return new Array(length).fill(source);
            }
            else if (source instanceof Matrix) {
                return source.data;
            }
            else {
                return source;
            }
        }
        MatrixToolbox.tuple = tuple;
        function fromSource(size, source) {
            const tuple = MatrixToolbox.tuple(size, source);
            switch (size) {
                case 2: return new Matrix2(...tuple);
                case 3: return new Matrix3(...tuple);
                case 4: return new Matrix4(...tuple);
                default: return new Matrix(...tuple);
            }
        }
        MatrixToolbox.fromSource = fromSource;
        (function (Projection) {
            function orthographic(left, right, bottom, top, near, far) {
                const width = right - left;
                const height = top - bottom;
                const depth = far - near;
                const translationX = -(right + left) / width;
                const translationY = -(top + bottom) / height;
                const translationZ = -(far + near) / depth;
                return new Matrix4(2 / width, 0, 0, translationX, 0, 2 / height, 0, translationY, 0, 0, -2 / depth, translationZ, 0, 0, 0, 1);
            }
            Projection.orthographic = orthographic;
        })(MatrixToolbox.Projection || (MatrixToolbox.Projection = {}));
        (function (Transformation) {
            function translate(translationX, translationY, translationZ) {
                return new Matrix4(1, 0, 0, translationX, 0, 1, 0, translationY, 0, 0, 1, translationZ, 0, 0, 0, 1);
            }
            Transformation.translate = translate;
            function rotate(angleInDegrees, axisX, axisY, axisZ) {
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
                return new Matrix4(tx * axisX + cosAngle, txy - sinZ, txz + sinY, 0, txy + sinZ, ty * axisY + cosAngle, tyz - sinX, 0, txz - sinY, tyz + sinX, tz * axisZ + cosAngle, 0, 0, 0, 0, 1);
            }
            Transformation.rotate = rotate;
            function scale(scaleX, scaleY, scaleZ) {
                return new Matrix4(scaleX, 0, 0, 0, 0, scaleY, 0, 0, 0, 0, scaleZ, 0, 0, 0, 0, 1);
            }
            Transformation.scale = scale;
        })(MatrixToolbox.Transformation || (MatrixToolbox.Transformation = {}));
    })(exports.MatrixToolbox || (exports.MatrixToolbox = {}));

    class Vector {
        _components;
        constructor(...components) {
            this._components = components;
        }
        add(value) { return this.operation(value, (a, b) => a + b); }
        subtract(value) { return this.operation(value, (a, b) => a - b); }
        multiply(value) { return this.operation(value, (a, b) => a * b); }
        divide(value) { return this.operation(value, (a, b) => a / b); }
        set(value) { return this.operation(value, (_, b) => b); }
        normalize() { return this.operation(this.getMagnitude(), (a, b) => a / b); }
        dot(value) { return this.clone().multiply(value).getSum(); }
        distance(vector) {
            const difference = this.clone().subtract(vector);
            return Math.sqrt(difference.multiply(difference).getSum());
        }
        clone() {
            return new Vector(...this._components);
        }
        getSum() {
            return this._components.reduce((sum, value) => sum + value);
        }
        getMagnitude() {
            return this.distance(this.clone().set(0));
        }
        operation(value, operation) {
            if (typeof value === "number") {
                for (let i = 0; i < this._components.length; i++) {
                    this._components[i] = operation(this._components[i], value);
                }
            }
            else if (value instanceof Vector) {
                for (let i = 0; i < this._components.length; i++) {
                    this._components[i] = operation(this._components[i], value._components[i]);
                }
            }
            else {
                for (let i = 0; i < this._components.length; i++) {
                    this._components[i] = operation(this._components[i], value[i]);
                }
            }
            return this;
        }
        toString() {
            return `[ ${this._components.join(", ")} ]`;
        }
        get size() {
            return this._components.length;
        }
        get components() {
            return this._components;
        }
    }
    class Vector2 extends Vector {
        get x() { return this.components[0]; }
        set x(value) { this.components[0] = value; }
        get y() { return this.components[1]; }
        set y(value) { this.components[1] = value; }
        get width() { return this.x; }
        set width(value) { this.x = value; }
        get height() { return this.y; }
        set height(value) { this.y = value; }
    }
    class Vector3 extends Vector {
        get x() { return this.components[0]; }
        set x(value) { this.components[0] = value; }
        get y() { return this.components[1]; }
        set y(value) { this.components[1] = value; }
        get z() { return this.components[2]; }
        set z(value) { this.components[2] = value; }
        get width() { return this.x; }
        set width(value) { this.x = value; }
        get height() { return this.y; }
        set height(value) { this.y = value; }
        get depth() { return this.z; }
        set depth(value) { this.z = value; }
        cross(vector) {
            return this.set([
                this.y * vector.z - this.z * vector.y,
                this.z * vector.x - this.x * vector.z,
                this.x * vector.y - this.y * vector.x
            ]);
        }
    }
    class Vector4 extends Vector {
        get x() { return this.components[0]; }
        set x(value) { this.components[0] = value; }
        get y() { return this.components[1]; }
        set y(value) { this.components[1] = value; }
        get z() { return this.components[2]; }
        set z(value) { this.components[2] = value; }
        get w() { return this.components[3]; }
        set w(value) { this.components[3] = value; }
        get width() { return this.z; }
        set width(value) { this.z = value; }
        get height() { return this.w; }
        set height(value) { this.w = value; }
    }
    exports.VectorToolbox = void 0;
    (function (VectorToolbox) {
        function tuple(size, source) {
            if (typeof source === "number") {
                return new Array(size).fill(source);
            }
            else if (source instanceof Vector) {
                return source.components;
            }
            else {
                return source;
            }
        }
        VectorToolbox.tuple = tuple;
        function fromSource(size, source) {
            const tuple = VectorToolbox.tuple(size, source);
            switch (size) {
                case 2: return new Vector2(...tuple);
                case 3: return new Vector3(...tuple);
                case 4: return new Vector4(...tuple);
                default: return new Vector(...tuple);
            }
        }
        VectorToolbox.fromSource = fromSource;
    })(exports.VectorToolbox || (exports.VectorToolbox = {}));

    exports.Toolbox = void 0;
    (function (Toolbox) {
        Toolbox.Vector = exports.VectorToolbox;
        Toolbox.Matrix = exports.MatrixToolbox;
    })(exports.Toolbox || (exports.Toolbox = {}));

    exports.Matrix = Matrix;
    exports.Matrix2 = Matrix2;
    exports.Matrix3 = Matrix3;
    exports.Matrix4 = Matrix4;
    exports.Vector = Vector;
    exports.Vector2 = Vector2;
    exports.Vector3 = Vector3;
    exports.Vector4 = Vector4;

}));
