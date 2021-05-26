"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import config from '@/app/config/index';
const AbstractController_1 = __importDefault(require("@/app/declares/AbstractController"));
const AdvancedError_1 = __importDefault(require("@/app/declares/AdvancedError"));
const BankAccTenant_1 = __importDefault(require("@/app/models/BankAccTenant"));
// import EmployeeTenant from '@/app/models/EmployeeTenant'
// import Employee from '@/app/models/Employee';
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
class BankAccTenantController extends AbstractController_1.default {
    // EmployeeTenantModel: Model<IEmployee, {}>
    // private setInstanceModel(req: Request) {
    //   const header = req.header('tenantId')
    //   console.log('header', header)
    //   const tenantId = header ? header : ''
    //   this.tenantId = tenantId
    //   this.model = BankAccTenant.getInstance(tenantId)
    //   //  = BankAccTenant.getModel()
    //   //  console.log('tenant', BankAccTenant.getTenant())
    //   // this.EmployeeTenantModel = this.EmployeeTenantModel
    //   //   ? this.EmployeeTenantModel
    //   //   : EmployeeTenant(tenantId)
    // }
    generateMethods() {
        return [
            {
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
            },
            {
                name: 'get-by-employee',
                type: 'POST',
                _ref: this.getByEmployee.bind(this),
                validationSchema: {
                    employee: {
                        isString: {
                            errorMessage: ['isString', 'Employee is invalid'],
                        },
                        exists: {
                            errorMessage: ['Required', 'Employee must be provided'],
                        },
                    },
                },
            },
            {
                name: 'get-by-id',
                type: 'POST',
                _ref: this.getByID,
                validationSchema: {
                    id: {
                        in: ['body', 'params'],
                        isString: {
                            errorMessage: ['isString', 'Id is invalid'],
                        },
                    },
                },
            },
            {
                name: 'add',
                type: 'POST',
                _ref: this.add.bind(this),
                // middleware: [this.setInstanceModel.bind(this)],
                validationSchema: {
                    bankName: {
                        in: ['body'],
                        isString: {
                            errorMessage: ['isString', 'Bank name is invalid'],
                        },
                        exists: {
                            errorMessage: ['Required', 'Bank name must be provided'],
                        },
                    },
                },
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update.bind(this),
                // middleware: [this.setInstanceModel.bind(this)],
                validationSchema: {
                    id: {
                        in: ['body', 'params'],
                        isString: {
                            errorMessage: ['isString', 'Id is invalid'],
                        },
                        exists: {
                            errorMessage: ['Required', 'ID must be provided'],
                        },
                    },
                },
            },
        ];
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { limit = 0, page = 1, skip = 0 } = req.body;
            console.log('aaa');
            // this.setInstanceModel(req)
            const bankAccs = yield BankAccTenant_1.default.getInstance(tenantId)
                .find({})
                .skip((page - 1) * limit + skip)
                .sort({ createdAt: -1 })
                .limit(limit)
                .exec();
            // let aggregate: any = []
            // const matchOne: any = { $match: {} }
            // aggregate.push(matchOne)
            // const lookup: any = [
            //   {
            //     $lookup: {
            //       from: this.tenantId + '_ahaarcards',
            //       localField: 'ahaarCard',
            //       foreignField: '_id',
            //       as: 'ahaarCard',
            //     },
            //   },
            //   {
            //     $unwind: {
            //       path: '$ahaarCard',
            //       preserveNullAndEmptyArrays: true,
            //     },
            //   },
            // ]
            // aggregate = [...aggregate, ...lookup]
            // const project: any = {
            //   $project: {
            //     bankName: 1,
            //     accountNumber: 1,
            //     ahaarCard: {
            //       _id: 1,
            //       adhaarNumber: 1,
            //     },
            //   },
            // }
            // aggregate.push(project)
            // console.log('bb')
            // const bankAccs = await this.BankAccTenantModel.aggregate(aggregate)
            // console.log('cc')
            res.send(new ResponseResult_1.default({
                data: bankAccs,
                message: 'List items successfully',
            }));
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { tenantId } = body;
            // this.setInstanceModel(req)
            const bankAcc = yield BankAccTenant_1.default.getInstance(tenantId).create(body);
            res.send(new ResponseResult_1.default({
                data: bankAcc,
                message: 'Add item successfully',
            }));
        });
    }
    getByEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { employee, page = 1, limit = 0, skip = 0 } = req.body;
            // this.setInstanceModel(req)
            // const foundEmployee = await this.EmployeeTenantModel.findById(employee)
            // if (!foundEmployee) {
            //   throw new AdvancedError({
            //     employee: { kind: 'not.found', message: 'Employee not found' },
            //   })
            // }
            const bankAccs = yield BankAccTenant_1.default.getInstance(tenantId)
                .find({ employee })
                .skip((page - 1) * limit + skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();
            res.send(new ResponseResult_1.default({
                data: bankAccs,
                total: yield BankAccTenant_1.default.getInstance(tenantId).countDocuments({
                    employee,
                }),
                message: 'List items successfully',
            }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // const {tenantId} = req.body
            const { id, tenantId } = req.body;
            // this.setInstanceModel(req)
            const bankAcc = yield BankAccTenant_1.default.getInstance(tenantId)
                .findById(id)
                .exec();
            if (!bankAcc) {
                throw new AdvancedError_1.default({
                    bankAcc: { kind: 'not.found', message: 'Bank account not found' },
                });
            }
            bankAcc.set(this.filterParams(req.body, ['employee', 'company']));
            yield bankAcc.save();
            res.send(new ResponseResult_1.default({
                message: 'Update bank account successfully',
                data: bankAcc,
            }));
        });
    }
}
exports.default = new BankAccTenantController();
//# sourceMappingURL=BankAccTenantController.js.map