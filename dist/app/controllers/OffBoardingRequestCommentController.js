"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractController_1 = __importDefault(require("@/app/declares/AbstractController"));
const OffBoardingRequestComment_1 = __importDefault(require("../models/OffBoardingRequestComment"));
class OffBoardingRequestCommentController extends AbstractController_1.default {
    constructor(model) {
        super(model);
    }
    generateMethods() {
        return [
            {
                name: 'get-by-id',
                type: 'POST',
                _ref: this.getByID.bind(this),
            },
            // {
            //   name: 'get-by-employee',
            //   type: 'POST',
            //   _ref: this.getByEmployee.bind(this), // update profile
            // },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update.bind(this),
            },
            {
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
            },
            {
                name: 'add',
                type: 'POST',
                _ref: this.add.bind(this),
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.remove.bind(this),
            },
        ];
    }
}
exports.default = new OffBoardingRequestCommentController(OffBoardingRequestComment_1.default);
//# sourceMappingURL=OffBoardingRequestCommentController.js.map