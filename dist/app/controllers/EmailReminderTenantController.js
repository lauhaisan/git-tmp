"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { Request, Response } from 'express'
const AbstractController_1 = __importDefault(require("@/app/declares/AbstractController"));
// import EmailReminderTenant from '../models/EmailReminderTenant'
class EmailReminderTenantController extends AbstractController_1.default {
    // private async setInstanceModel(req: Request) {
    //   const header = req.header('tenantId')
    //   const tenantId = header ? header : ''
    //   this.model = this.model ? this.model : EmailReminderTenant(tenantId)
    //   this.EmailReminderTenantModel = this.EmailReminderTenantModel
    //     ? this.EmailReminderTenantModel
    //     : this.model
    // }
    generateMethods() {
        return [
            {
                name: 'get-by-id',
                type: 'POST',
                _ref: this.getByID.bind(this),
            },
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
exports.default = new EmailReminderTenantController();
//# sourceMappingURL=EmailReminderTenantController.js.map