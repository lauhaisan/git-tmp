"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
class ErrorHandler {
    internalServerError(error, req, res, _) {
        const { name: errorName } = error;
        let { controllerName } = req;
        const adapter = {
            ValidationError: (err) => {
                let { errors: data, message } = err;
                const { statusCode = 500 } = err;
                const listMessage = [];
                data = Object.keys(data).map(key => {
                    const errorField = data[key];
                    const { message: defaultMessage, properties: values } = errorField;
                    let { path = key, kind = 'invalid' } = errorField;
                    if (statusCode === 500) {
                        const castError = [
                            'Number',
                            'String',
                            'Boolean',
                            'ObjectID',
                            'Date',
                        ];
                        if (castError.includes(kind))
                            kind = `is${kind}`;
                    }
                    kind = kind.replace(/length$/i, '');
                    path = path.replace(/\.\d+$/, '');
                    let id = [kind, path];
                    if (controllerName) {
                        controllerName = controllerName
                            .split('-')
                            .map((word, i) => i === 0 ? word : word[0].toUpperCase() + word.slice(1))
                            .join('');
                        id = [controllerName, ...id];
                    }
                    listMessage.push(defaultMessage);
                    return { id: id.join('.'), defaultMessage, values };
                });
                if (!message)
                    message = listMessage.join('. ');
                return {
                    status: errorName,
                    statusCode: 400,
                    data,
                    message,
                };
            },
            default: err => {
                logger_1.default.error(err);
                return {
                    status: 'Unknow error',
                    statusCode: 500,
                    message: err.message || 'Please try later',
                };
            },
        };
        const factory = error && error.name && adapter[error.name]
            ? adapter[error.name]
            : adapter.default;
        res
            .status(200)
            .send(factory(error))
            .end();
    }
    PageNotFound(req, res, _err) {
        res
            .status(404)
            .send({ message: 'Route ' + req.url + ' Not found.' })
            .end();
    }
}
exports.default = new ErrorHandler();
//# sourceMappingURL=errorHandler.js.map