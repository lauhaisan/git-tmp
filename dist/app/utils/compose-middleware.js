"use strict";
// import { NextFunction, Request, Response } from 'express'
// // import isPromise from 'is-promise'
// import { Many } from 'lodash'
// import flatten from 'lodash/flatten'
// import logger from './logger'
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errors = exports.compose = void 0;
const flatten_1 = __importDefault(require("lodash/flatten"));
const logger_1 = __importDefault(require("./logger"));
/**
 * Compose an array of middleware handlers into a single handler.
 */
function compose(...handlers) {
    const middleware = generate(handlers);
    return (req, res, done) => middleware(null, req, res, done);
}
exports.compose = compose;
/**
 * Wrap middleware handlers.
 */
function errors(...handlers) {
    return generate(handlers);
}
exports.errors = errors;
/**
 * Generate a composed middleware function.
 */
function generate(handlers) {
    const stack = flatten_1.default(handlers);
    for (const handler of stack) {
        if (typeof handler !== 'function') {
            throw new TypeError('Handlers must be a function');
        }
    }
    return function middleware(errMain, _req, _res, done) {
        let index = -1;
        function dispatch(pos, err) {
            const handler = stack[pos];
            index = pos;
            if (index === stack.length)
                return done(err);
            function next(ne) {
                if (pos < index) {
                    throw new TypeError('`next()` called multiple times');
                }
                return dispatch(pos + 1, ne);
            }
            try {
                if (handler.length === 4) {
                    if (err) {
                        return next();
                    }
                }
                else {
                    if (!err) {
                        // const ret = (handler as RequestHandler)(req, res, next)
                        // if (isPromise(ret)) {
                        //   ret.catch(e => next(e))
                        // }
                        return next();
                    }
                }
            }
            catch (e) {
                // Avoid future errors that could diverge stack execution.
                if (index > pos)
                    throw e;
                logger_1.default.debug('try..catch', e);
                return next(e);
            }
            return next(err);
        }
        return dispatch(0, errMain);
    };
}
//# sourceMappingURL=compose-middleware.js.map