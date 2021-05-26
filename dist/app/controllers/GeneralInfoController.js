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
const AbstractController_1 = __importDefault(require("@/app/declares/AbstractController"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const AdvancedError_1 = __importDefault(require("@/app/declares/AdvancedError"));
const mongoose_1 = require("mongoose");
const Certification_1 = __importDefault(require("@/app/models/Certification"));
const Employee_1 = __importDefault(require("@/app/models/Employee"));
// import Document from '@/app/models/Document'
const GeneralInfo_1 = __importDefault(require("@/app/models/GeneralInfo"));
const constant_1 = require("../utils/constant");
class GeneralInfoController extends AbstractController_1.default {
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
            {
                name: 'get-by-employee',
                type: 'POST',
                _ref: this.getByEmployee.bind(this),
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update,
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
                name: 'add-lack',
                type: 'POST',
                _ref: this.addLack.bind(this),
            },
            {
                name: 'delete',
                type: 'POST',
                _ref: this.delete.bind(this),
            },
            {
                name: 'list-relation',
                type: 'POST',
                _ref: this.listRelationship.bind(this),
            },
        ];
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, employeeId } = req.body;
            const generalInfo = yield GeneralInfo_1.default.findById(id);
            generalInfo.set(this.filterParams(req.body, ['employee', 'company']));
            if (employeeId) {
                const employee = yield Employee_1.default.findOne({
                    _id: generalInfo.employee,
                });
                // const findEmployeeId = await Employee.findOne({ employeeId, company: employee.company })
                const findEmployeeId = yield Employee_1.default.findOne({
                    employeeId,
                    company: employee.company,
                });
                if (findEmployeeId && findEmployeeId.id !== employee.id) {
                    throw new AdvancedError_1.default({
                        employeeId: {
                            kind: 'not.unique',
                            message: 'employeeId must be unique',
                        },
                    });
                }
                employee.set({ employeeId });
                yield employee.save();
            }
            yield generalInfo.save();
            res.send(new ResponseResult_1.default({
                message: 'Successfully updated information',
                data: generalInfo,
            }));
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            const generalInfo = yield GeneralInfo_1.default.deleteMany({
                _id: mongoose_1.Types.ObjectId(id),
            });
            res.send(new ResponseResult_1.default({
                message: 'Successfully updated information',
                data: generalInfo,
            }));
        });
    }
    getByEmployee({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employee } = body;
            const generalInfo = yield GeneralInfo_1.default.findOne({ employee });
            // console.log('employee', employee)
            // console.log('generalInfo', generalInfo.id)
            const certification = yield Certification_1.default.find({ employee });
            generalInfo.certification = certification;
            // const documents = await Document.find({ employee })
            // generalInfo.documents = documents
            res.send(new ResponseResult_1.default({
                data: generalInfo,
                message: 'get generalInfo successfully',
            }));
        });
    }
    addLack(res) {
        return __awaiter(this, void 0, void 0, function* () {
            // const employees = await Employee.find({ generalInfo: { $exists: false } })
            // forEach(employees, async (employee: any = {}) => {
            //   const generalInfo = await GeneralInfo.create({
            //     employee,
            //     firstName: 'Tien ',
            //     lastName: 'Nguyen',
            //     DOB: '1994-04-22',
            //     legalGender: 'male',
            //     linkedIn: 'tien@linkedin.com',
            //     personalNumber: '0782990000',
            //     personalEmail: '',
            //   })
            //   const department = await Department.find({})
            //   employee.generalInfo = generalInfo
            //   employee.department = department[0]
            //   employee.save()
            // })
            // res.send(
            //   new ResponseResult({
            //     message: 'Successfully updated information',
            //     data: { employees },
            //   }),
            // )
            // const generalInfo = await GeneralInfo.updateMany({ firstName: { $exists: false } }, { $set: { firstName: 'Nguyen Van A', lastName: '' } })
            // res.send(
            //   new ResponseResult({
            //     message: 'Successfully updated information',
            //     data: { generalInfo },
            //   }),
            // const employees = await Employee.find({ compensation: { $exists: false } })
            // const employeeTypes = await EmployeeType.find({})
            // const tittles = await Tittle.find({})
            // forEach(employees, async (employee: any = {}) => {
            //   const compensation = await Compensation.create({
            //     employee,
            //     company: employee.company,
            //     tittle: tittles[0],
            //     employeeType: employeeTypes[0],
            //   })
            //   employee.compensation = compensation
            //   employee.save()
            // })
            // const employeeTypes = await EmployeeType.find({})
            // const compensation = await Compensation.updateMany(
            //   { employeeType: { $exists: false } },
            //   { $set: { employeeType: employeeTypes[0] } },
            // )
            // const {
            //   body: { location, company, department },
            // } = req
            // let { body } = req
            // const currentUser = req.user as IUser
            // const employeeCurrent = currentUser.employee as IEmployee
            // Default fields:
            // body.roles = ['EMPLOYEE']
            /* Validate roles:
              - normal permissions
              - currentUser (ADMIN-CLA) not have the location management permission
            */
            // Validate location of company:
            // forEach(users, async (user: any = {}) => {
            // })
            const gen = yield GeneralInfo_1.default.updateMany({ avatar: { $exists: false } }, {
                $set: {
                    avatar: 'https://thumbs.dreamstime.com/b/happy-smiling-geek-hipster-beard-man-cool-avatar-geek-man-avatar-104871313.jpg',
                    employeeId: '1',
                },
            });
            res.send(new ResponseResult_1.default({
                message: 'Successfully updated information',
                data: { gen },
            }));
        });
    }
    listRelationship(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.send(new ResponseResult_1.default({
                data: [...constant_1.EMPLOYEE.relationshipEnum],
                message: 'List items successfully',
            }));
        });
    }
}
exports.default = new GeneralInfoController(GeneralInfo_1.default);
//# sourceMappingURL=GeneralInfoController.js.map