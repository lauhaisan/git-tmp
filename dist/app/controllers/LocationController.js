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
const Location_1 = __importDefault(require("@/app/models/Location"));
const User_1 = __importDefault(require("@/app/models/User"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const lodash_1 = require("lodash");
const Company_1 = __importDefault(require("../models/Company"));
const Employee_1 = __importDefault(require("../models/Employee"));
class LocationController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
            },
            {
                name: 'list-all',
                type: 'POST',
                _ref: this.listAll.bind(this),
            },
            {
                name: 'get-by-id',
                type: 'POST',
                _ref: this.getByID,
                validationSchema: {
                    id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'ID must be provided'],
                        },
                    },
                },
            },
            {
                name: 'add',
                type: 'POST',
                _ref: this.add,
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update.bind(this),
                validationSchema: {
                    id: {
                        exists: {
                            errorMessage: ['required', 'ID must be provided'],
                        },
                    },
                },
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.remove,
                validationSchema: {
                    id: {
                        exists: {
                            errorMessage: ['required', 'ID must be provided'],
                        },
                    },
                },
            },
            {
                name: 'active',
                type: 'POST',
                _ref: this.active,
                possiblePers: ['admin-cga'],
                validationSchema: {
                    id: {
                        exists: {
                            errorMessage: ['required', 'ID must be provided'],
                        },
                    },
                },
            },
            {
                name: 'inactive',
                type: 'POST',
                _ref: this.inactive,
                possiblePers: ['admin-cga'],
                validationSchema: {
                    id: {
                        exists: {
                            errorMessage: ['required', 'ID must be provided'],
                        },
                    },
                },
            },
            {
                name: 'get-by-company',
                type: 'POST',
                _ref: this.getByCompany.bind(this),
                validationSchema: {
                    company: {
                        exists: {
                            errorMessage: ['required', 'Company must be provided'],
                        },
                    },
                },
            },
            // {
            //   name: 'fix',
            //   type: 'POST',
            //   _ref: this.fixAddress.bind(this)
            // }
            {
                name: 'upsert',
                type: 'POST',
                _ref: this.upsert.bind(this),
            },
        ];
    }
    /* Find location list of the currentUser company */
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            let employee = currentUser.employee;
            employee = yield Employee_1.default.findById(currentUser.employee);
            const company = yield Company_1.default.findById(employee.company).exec();
            // const searchQ = { $regex: q, $options: 'i' }
            // Init filter
            const filter = {
                company,
            };
            // const {
            //   body: { q, status = [] },
            // } = req
            // const currentUser = req.user as IUser
            // const { employee } = currentUser
            // const searchQ = { $regex: q, $options: 'i' }
            // // Init filter
            // const filter: any = {
            //   company: employee.company,
            // }
            // if (!isEmpty(status)) {
            //   filter.status = status
            // }
            // if (q) {
            //   filter.name = searchQ
            // }
            res.send(new ResponseResult_1.default({
                message: 'Get location list successfully',
                data: yield Location_1.default.find(filter)
                    .sort({ createdAt: -1 })
                    .exec(),
            }));
        });
    }
    getByCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // const currentUser = req.user as IUser
            // let employee: any = currentUser.employee as IEmployee
            // employee = await Employee.findById(currentUser.employee)
            const { company } = req.body;
            const filter = {
                company,
            };
            res.send(new ResponseResult_1.default({
                message: 'Get location list successfully',
                data: yield Location_1.default.find(filter)
                    .sort({ name: -1 })
                    .exec(),
            }));
        });
    }
    // List all location
    listAll(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const locations = yield Location_1.default.find();
            if (!locations) {
                throw new AdvancedError_1.default({
                    location: { kind: 'not.found', message: 'Locations not found' },
                });
            }
            res.send(new ResponseResult_1.default({
                data: locations,
                message: 'List items successfully',
            }));
        });
    }
    getByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const location = yield Location_1.default.findById(req.body.id).exec();
            if (!location) {
                throw new AdvancedError_1.default({
                    location: {
                        kind: 'not.found',
                        message: 'Location not found!',
                    },
                });
            }
            res.send(new ResponseResult_1.default({
                message: 'Get location successfully',
                data: location,
            }));
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const currentUser = req.user;
            let employee = currentUser.employee;
            // Validate Company (1)
            // Internal fields
            if (!body.company) {
                employee = yield Employee_1.default.findById(currentUser.employee);
                const companyData = yield Company_1.default.findById(employee.company).exec();
                if (!companyData) {
                    throw new AdvancedError_1.default({
                        company: {
                            kind: 'not.found',
                            message: 'User company not found.',
                        },
                    });
                }
                body.company = employee.company;
            }
            const findLocationName = yield Location_1.default.findOne({
                name: body.name,
                company: employee.company,
            });
            if (findLocationName) {
                throw new AdvancedError_1.default({
                    name: {
                        kind: 'not.unique',
                        message: 'Location name is existed!',
                    },
                });
            }
            body.code = `L${Math.random()
                .toString(32)
                .substring(2, 5)}`;
            // Validate the location limit:
            const location = yield Location_1.default.create(body);
            // if (location) {
            //   // Update Company
            //   await Company.updateOne(
            //     { _id: employee.company },
            //     { $inc: { locationCode: 1 } },
            //   )
            // }
            res.send(new ResponseResult_1.default({
                message: 'Add location successfully',
                data: location,
            }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { id } = body;
            const location = yield Location_1.default.findById(id).exec();
            if (!location) {
                throw new AdvancedError_1.default({
                    location: {
                        kind: 'not.found',
                        message: 'Location not found!',
                    },
                });
            }
            // validate company:
            // Not allow update: company, status
            location.set(this.filterParams(body, ['company', 'status']));
            yield location.save();
            res.send(new ResponseResult_1.default({
                message: 'Save location successfully',
                data: location,
            }));
        });
    }
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { id }, } = req;
            const location = yield Location_1.default.findOne({ _id: id }).exec();
            if (!location) {
                throw new AdvancedError_1.default({
                    location: {
                        kind: 'not.found',
                        message: 'Location not found!',
                    },
                });
            }
            const listEmployee = yield Employee_1.default.findOne({ location: id }).exec();
            if (listEmployee) {
                throw new AdvancedError_1.default({
                    method: {
                        path: 'method',
                        kind: 'employee.existed',
                        message: `Can't remove because employees existed in location!`,
                    },
                });
            }
            yield location.remove();
            res.send(new ResponseResult_1.default({ message: 'Remove location successfully' }));
        });
    }
    active(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { id }, } = req;
            const currentUser = req.user;
            const employee = currentUser.employee;
            const location = yield Location_1.default.findById(id).exec();
            if (!location) {
                throw new AdvancedError_1.default({
                    location: { kind: 'not.found', message: 'Location not found' },
                });
            }
            // validate company:
            if (employee.company &&
                employee.company._id.toString() !== location.company._id.toString()) {
                throw new AdvancedError_1.default({
                    method: {
                        path: 'method',
                        kind: 'not.permission',
                        message: `You don't have permission.`,
                    },
                });
            }
            // Validate dependencies:
            if (lodash_1.get(location, 'company.status') === 'INACTIVE') {
                throw new AdvancedError_1.default({
                    method: {
                        path: 'company',
                        kind: 'dependencies',
                        message: `Company is inactive.`,
                    },
                });
            }
            location.set({ status: 'ACTIVE' });
            yield location.save();
            res.send(new ResponseResult_1.default({
                message: 'Update Location successfully',
                data: location,
            }));
        });
    }
    inactive(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { id }, } = req;
            const currentUser = req.user;
            const employee = currentUser.employee;
            const location = yield Location_1.default.findById(id).exec();
            if (!location) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'Location not found' },
                });
            }
            // validate company:
            if (employee.company &&
                employee.company._id.toString() !== location.company._id.toString()) {
                throw new AdvancedError_1.default({
                    method: {
                        path: 'method',
                        kind: 'not.permission',
                        message: `You don't have permission.`,
                    },
                });
            }
            // Update dependencies:
            yield User_1.default.updateMany({ location: id }, { status: 'INACTIVE' });
            location.set({ status: 'INACTIVE' });
            yield location.save();
            res.send(new ResponseResult_1.default({
                message: 'Update location successfully',
                data: location,
            }));
        });
    }
    // protected async fixAddress(req:Request, res:Response) {
    //   const locations: any = await Location.find();
    //   if(!locations ) {
    //     throw new AdvancedError({
    //       location: {kind: 'not.found', message: 'Location not found'}
    //     })
    //   }
    //   const filteredLocation = filter(locations, (item:any)=>(typeof item.address !== 'object'))
    //   console.log(filteredLocation)
    // }
    upsert({ body, user }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = user;
            if (lodash_1.isArray(body)) {
                const updated = [];
                const inserted = [];
                lodash_1.map(body, per => {
                    const { _id } = per;
                    if (!_id) {
                        inserted.push(Object.assign(Object.assign({}, per), { company: currentUser.employee.company._id }));
                    }
                    else {
                        updated.push({
                            updateOne: {
                                filter: { _id },
                                update: { $set: this.filterParams(per, ['_id', 'company']) },
                                upsert: false,
                            },
                        });
                    }
                });
                if (updated.length)
                    yield Location_1.default.bulkWrite(updated);
                if (inserted.length)
                    yield Location_1.default.insertMany(inserted);
            }
            else {
                throw new AdvancedError_1.default({
                    location: { kind: 'invalid', message: 'Body should be array' },
                });
            }
            const result = new ResponseResult_1.default({
                data: {},
                message: 'Update item successfully',
            });
            res.send(result);
        });
    }
}
exports.default = new LocationController(Location_1.default);
//# sourceMappingURL=LocationController.js.map