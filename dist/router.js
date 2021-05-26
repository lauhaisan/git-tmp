"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_promise_router_1 = __importDefault(require("express-promise-router"));
const express_validator_1 = require("express-validator");
const fs_1 = __importDefault(require("fs"));
const passport_1 = __importDefault(require("passport"));
const path_1 = __importDefault(require("path"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const SaveToFileService_1 = __importDefault(require("@/app/services/SaveToFileService"));
const logger_1 = __importDefault(require("@/app/utils/logger"));
class Routes {
    constructor() {
        this.routes = [];
        this.routeList = [];
        this.router = express_promise_router_1.default();
        this.importControllers = this.importControllers.bind(this);
        this.importControllers().registerRouter();
    }
    importControllers() {
        const { routes } = this;
        const controllerDirectory = path_1.default.resolve(__dirname, 'app/controllers');
        const controllerFiles = fs_1.default.readdirSync(controllerDirectory) || [];
        controllerFiles.forEach(fileName => {
            if (/\.js$/.test(fileName)) {
                try {
                    const { default: controller, } = require(path_1.default.join(controllerDirectory, fileName));
                    const className = String(controller.constructor.name);
                    if (!controller) {
                        throw new Error(`${fileName} isn't had controller`);
                    }
                    const matchTag = className.match(/^(\w+)Controller$/);
                    if (!matchTag || matchTag.length === 0) {
                        throw new Error(`Can't detect controller name`);
                    }
                    let [, name] = matchTag;
                    if (controller.name) {
                        name = controller.name;
                    }
                    if (name.length === 0) {
                        throw new Error(`Controller name is invalid. (${fileName})`);
                    }
                    controller.setName(name.toLowerCase());
                    routes.push({ name: controller.name, controller });
                }
                catch (error) {
                    logger_1.default.error(error.message);
                }
            }
        });
        return this;
    }
    /**
     * registerRouter
     */
    registerRouter() {
        const { routes, router, handleInvalidToken } = this;
        router.get('/api/route-list', this.getRouteList.bind(this));
        routes.forEach(({ name: routeName, controller: { methods = [], checkValidArguments, getValidMethod, setControllerName, }, }) => {
            // Handle public method.
            methods.forEach(method => {
                const { authorized = true, ignoreExpiration, validationSchema, isRoot, type, _ref, name: methodName, middleware, } = method;
                if (type === undefined || !_ref) {
                    return;
                }
                let registerRoute = (pathParams, ...handlers) => router.post(pathParams, ...handlers);
                if (type === 'GET') {
                    registerRoute = (pathParams, ...handlers) => router.get(pathParams, ...handlers);
                }
                const args = [setControllerName];
                if (authorized) {
                    args.push(handleInvalidToken.bind(this, ignoreExpiration));
                }
                if (validationSchema) {
                    args.push(...express_validator_1.checkSchema(validationSchema), checkValidArguments);
                }
                if (Array.isArray(middleware))
                    args.push(...middleware);
                args.push(_ref);
                const paths = {
                    isRoot: `/api/${methodName}`,
                    default: `/api/${routeName}/${methodName}`,
                };
                const pRoute = isRoot ? paths.isRoot : paths.default;
                this.routeList.push({
                    path: pRoute,
                    method: type,
                    ignoreExpiration,
                    authorized,
                    isRoot,
                    validationSchema,
                });
                if (authorized) {
                    router.post(pRoute, handleInvalidToken.bind(this, false), setControllerName, getValidMethod);
                }
                // register route
                registerRoute(pRoute, ...args);
            });
            const pathRoute = `/api/${routeName}`;
            this.routeList.push({ path: pathRoute, method: 'POST', methods });
            router.post(pathRoute, handleInvalidToken.bind(this, false), setControllerName, getValidMethod);
        });
        return this;
    }
    getRouteList({ query: { route } }, res) {
        let { routeList: list } = this;
        if (route) {
            list = list.filter(r => r.path === `/${route}`);
        }
        SaveToFileService_1.default.routesToFile(list);
        res.send(new ResponseResult_1.default({
            message: 'Get route list',
            data: {
                routes: list,
                path: '/route-list',
                query: [{ name: 'route', type: 'string' }],
            },
        }));
    }
    handleInvalidToken(ignoreExpiration, req, res, next) {
        const authenType = ignoreExpiration ? 'jwt-ignoreExpiration' : 'jwt';
        return passport_1.default.authenticate(authenType, {
            session: false,
        }, (error, user, info) => {
            if ((info && error) || !user) {
                let message = 'User not found.';
                if (error && error.message) {
                    message = error.message;
                }
                if (info && info.message) {
                    message = info.message;
                }
                res.statusCode = 401;
                return res.send({ status: 401, message });
            }
            req.user = user;
            return next();
        })(req, res);
    }
}
const routesInstance = new Routes();
exports.default = routesInstance.router;
//# sourceMappingURL=router.js.map