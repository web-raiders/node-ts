import { NextFunction, Request, Response } from 'express';
import { ApiResponse, Tools } from '../utils';

const { successResponse, errorResponse } = ApiResponse;
const { fetchToken, verifyToken } = Tools;


/**
 * Authentication Middlewares
 */
const AuthMiddleware = {

  /**
   * user authentication
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - returns error or response object
   * @memberof AuthMiddleware
   */
  refreshCheck(req: Request, res: Response, next: NextFunction): NextFunction | void | object {
    try {
      const token = fetchToken(req);
      if (!token) return errorResponse(res, 401, 'Access denied, Token required');
      res.locals.tokenData = verifyToken(res, token);
      if (res.locals.tokenData.type === 'access')
        return errorResponse(res, 403, 'Access denied, bad Token');
      return next();
    } catch (error) {
      return errorResponse(res, 400, error);
    }
  },

  /**
   * access authentication
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - returns error or response object
   * @memberof AuthMiddleware
   */
  accessCheck(req: Request, res: Response, next: NextFunction): NextFunction | void | object {
    try {
      const token = fetchToken(req);
      if (!token) return errorResponse(res, 401, 'access denied, token required');
      res.locals.tokenData = verifyToken(res, token);
      if (res.locals.tokenData.type === 'refresh')
        return errorResponse(res, 403, 'access denied, bad Token');
      return next();
    } catch (error) {
      return errorResponse(res, 400, error);
    }
  },
};

export default AuthMiddleware;
