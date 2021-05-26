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
const AdvancedError_1 = __importDefault(require("@/app/declares/AdvancedError"));
// import AttachmentTenant from '@/app/models/AttachmentTenant'
// import LocationTenant from '@/app/models/LocationTenant'
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const bluebird_1 = __importDefault(require("bluebird"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Attachment_1 = __importDefault(require("../models/Attachment"));
const EmployeeTenant_1 = __importDefault(require("../models/EmployeeTenant"));
const LocationTenant_1 = __importDefault(require("../models/LocationTenant"));
const ManageBalanceTenant_1 = __importDefault(require("../models/ManageBalanceTenant"));
const ManageBalanceTenant_2 = __importDefault(require("../models/ManageBalanceTenant"));
class ManageBalancesTenantController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'upload-file',
                type: 'POST',
                _ref: this.uploadFile.bind(this),
            },
            {
                name: 'active',
                type: 'POST',
                _ref: this.active,
            },
            {
                name: 'inactive',
                type: 'POST',
                _ref: this.inactive,
            },
        ];
    }
    createDefault(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            const tenantId = req.header('tenantId');
            const currentUser = user;
            const employee = currentUser.employee;
            const existLocation = yield LocationTenant_1.default.getInstance(tenantId).findById(employee.location);
            if (!existLocation) {
                throw new AdvancedError_1.default({
                    location: {
                        kind: 'not.found',
                        message: 'Location not found',
                    },
                });
            }
            const data = {
                manageBalance: [],
                location: employee.location,
            };
            return data;
        });
    }
    initDefault(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const currentUser = req.user;
            const employee = currentUser.employee;
            const location = yield LocationTenant_1.default.getInstance(tenantId).findById(employee.location);
            if (!location) {
                throw new AdvancedError_1.default({
                    location: {
                        kind: 'not.found',
                        message: 'Location not found',
                    },
                });
            }
            const newData = new (ManageBalanceTenant_2.default.getInstance(tenantId))({
                manageBalance: [],
                location,
            });
            yield newData.save();
            res.send(new ResponseResult_1.default({
                data: newData,
                message: 'Init successfully',
            }));
        });
    }
    readFileCSV(
    // tenantId: string,
    pathFile) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const csvData = [];
                fs_1.default.createReadStream(pathFile)
                    .pipe(csv_parser_1.default())
                    .on('data', (data) => __awaiter(this, void 0, void 0, function* () {
                    csvData.push(data);
                }))
                    .on('end', () => {
                    console.log('CSV file successfully processed');
                    console.log(csvData);
                    resolve(csvData);
                })
                    .on('error', reject);
            });
        });
    }
    uploadFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, attachment, effectiveDate, type } = req.body;
            const existFile = yield Attachment_1.default.findById(attachment);
            if (!existFile) {
                throw new AdvancedError_1.default({
                    attachment: {
                        kind: 'not.found',
                        message: 'File not found',
                    },
                });
            }
            if (attachment) {
                const pathFile = path_1.default.join(__dirname + '/../' + `${existFile.path}`);
                const data = (yield this.readFileCSV(pathFile));
                // console.log(data)
                const manageBalanceList = yield bluebird_1.default.map(data, (person) => __awaiter(this, void 0, void 0, function* () {
                    const employee = yield EmployeeTenant_1.default.getInstance(tenantId).findOne({ employeeId: person.EmployeeId });
                    if (!employee) {
                        throw new AdvancedError_1.default({
                            attachment: {
                                kind: 'not.found',
                                message: 'Employee not found, please recheck your file',
                            },
                        });
                    }
                    return {
                        employeeId: employee._id,
                        type: type,
                        casualLeave: person.CasualLeave,
                        sickLeave: person.SickLeave,
                        effectiveDate: effectiveDate,
                        statusEffect: false,
                    };
                }));
                yield bluebird_1.default.map(manageBalanceList, (employeeBalance) => __awaiter(this, void 0, void 0, function* () {
                    // console.log(employeeBalance.employeeId)
                    const existEmployee = yield ManageBalanceTenant_1.default.getInstance(tenantId).findOne({ employeeId: employeeBalance.employeeId._id });
                    if (existEmployee) {
                        yield existEmployee.updateOne({
                            casualLeave: employeeBalance.casualLeave,
                            sickLeave: employeeBalance.sickLeave,
                            effectiveDate: effectiveDate,
                            statusEffect: false,
                        });
                    }
                    else {
                        yield ManageBalanceTenant_1.default.getInstance(tenantId).create(employeeBalance);
                    }
                }));
                res.send(new ResponseResult_1.default({
                    message: 'Upload successfully',
                }));
            }
            else {
                throw new AdvancedError_1.default({
                    attachment: {
                        kind: 'not.found',
                        message: 'Attachment not found',
                    },
                });
            }
        });
    }
}
exports.default = new ManageBalancesTenantController();
//# sourceMappingURL=ManageBalancesTenantController.js.map