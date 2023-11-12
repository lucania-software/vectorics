(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
})((function () { 'use strict';

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Toolbox = void 0;
    const tslib_1 = require("tslib");
    const Matrix_1 = require("./Matrix");
    const Vector_1 = require("./Vector");
    tslib_1.__exportStar(require("./Matrix"), exports);
    tslib_1.__exportStar(require("./Vector"), exports);
    var Toolbox;
    (function (Toolbox) {
        Toolbox.Vector = Vector_1.VectorToolbox;
        Toolbox.Matrix = Matrix_1.MatrixToolbox;
    })(Toolbox || (exports.Toolbox = Toolbox = {}));

}));
