"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractController_1 = __importDefault(require("@/app/declares/AbstractController"));
// import OffBoardingRequestCommentTenant from '../models/OffBoardingRequestCommentTenant'
class OffBoardingRequestCommentTenantController extends AbstractController_1.default {
    // OffBoardingRequestCommentTenantModel: Model<IOffBoardingRequestComment, {}>
    // private async setInstanceModel(req: Request) {
    //   const header = req.header('tenantId')
    //   const tenantId = header ? header : ''
    //   this.model = this.model ? this.model : OffBoardingRequestCommentTenant(tenantId)
    //   this.OffBoardingRequestCommentTenantModel = this.OffBoardingRequestCommentTenantModel
    //     ? this.OffBoardingRequestCommentTenantModel
    //     : this.model
    // }
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
exports.default = new OffBoardingRequestCommentTenantController();
//# sourceMappingURL=OffBoardingRequestCommentTenantController.js.map