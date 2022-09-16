import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../config/env';

const { TOKEN_SECRET, PORT } = env;

export const ApiResponse = {
  /**
   * Generates a JSON response for failure scenarios.
   * @param {Response} res - Response object.
   * @param {object} options - The payload.
   * @param {number} options.code -  HTTP Status code, default is 500.
   * @param {string} options.message -  Error message.
   * @param {object|array  } options.errors -  A collection of  error message.
   * @memberof ApiResponse
   * @returns {JSON} - A JSON failure response.
   */
  errorResponse(
    res: Response,
    code = 500,
    message = 'Some error occurred while processing your Request',
    errors?: object | string[]
  ): object {
    return res.status(code).json({
      status: false,
      message,
      errors,
    });
  },

  /**
   * Generates a JSON response for success scenarios.
   * @param {Response} res - Response object.
   * @param {object} data - The payload.
   * @param {string} message - success message
   * @param {number} code -  HTTP Status code.
   * @memberof ApiResponse
   * @returns {JSON} - A JSON success response.
   */
  successResponse(res: Response, code = 200, data: object | undefined, message: string): object {
    return res.status(code).json({
      status: true,
      message,
      data,
    });
  },
};

/**
 * Api Error class
 * @extends Error
 */
export class ApiError extends Error {
  /**
   * Create an ApiError instance
   *
   * @param {number} status - status code of error
   * @param {string} message - error message
   */
  status?: number;
  error?: object | string;
  constructor(status: number, message: string, error?: object | string) {
    super();
    this.status = status;
    this.message = message;
    this.error = error;
  }
}

export const Tools = {
  /**
   * Generates a unique ~64 bit id
   * @memberof Tools
   * @returns {string} - an integer id
   */
  uniqueId(): string {
    return `${new Date().valueOf()}${Math.round(Math.random() * 10000)}`;
  },

  /**
   * Generates a signed token given a payload and returns a sring
   * @param {string | number | Buffer | object} payload Payload to sign.
   * @param {string | number} expiresIn Expressed in seconds or a string describing a time frame
   * @memberof Tools
   * @returns {string} web token.
   */
  createToken(payload: object, expiresIn = '60m'): string {
    return jwt.sign(payload, TOKEN_SECRET as jwt.Secret, { expiresIn });
  },

  /**
   * Verify generated token given a token string with secret
   * @param {string} token - token string
   * @memberof Tools
   * @retjurns {string | number | Buffer | object } - Decoded payload if
   * token is valid or an error message if otherwise.
   */
  verifyToken(res: Response, token: string): string | { id?: number } | object {
    try {
      // const secret: jwt.Secret =  as jwt.Secret;
      return jwt.verify(token, TOKEN_SECRET as jwt.Secret);
    } catch (error) {
      return ApiResponse.errorResponse(res, 401, 'access denied, token invalid');
    }
  },

  /**
   * fetch input token form request header / cookies
   * @param {object} req - request body
   * @memberof Tools,
   * @returns {string} token - token string
   */
  fetchToken(req: { headers?: any; cookies?: any; body?: any }): string {
    const {
      headers: { authorization },
      cookies: { token: cookieToken },
    } = req;
    let bearerToken = null;
    if (authorization) {
      bearerToken = authorization.split(' ')[1] ? authorization.split(' ')[1] : authorization;
    }
    return (
      cookieToken ||
      bearerToken ||
      req.headers['x-access-token'] ||
      req.headers.token ||
      req.body.token
    );
  },

  /**
   * Generate hashed string given an input string
   * @param {string} value - string to encrypt.
   * @memberof Tools
   * @returns {string} - encrypted string
   */
  hashString(value: string): string {
    return bcrypt.hashSync(value, bcrypt.genSaltSync(10));
  },

  /**
   * Compare given value with hash string
   * @param {string} value - plain string
   * @param {string} hash - encrypted string
   * @memberof Tools
   * @returns {boolean} - true if plain and hashed string match. false if not.
   */
  compareHash(value: string, hash: string): boolean {
    return bcrypt.compareSync(value, hash);
  },

  /**
   * Generates email verification link
   * @param { Request } req - Request object
   * @param { string } id - User's unique ID.
   * @param { string } email - User's email.
   * @returns {URL} - Verification link.
   * @memberof Toolbox
   */
  createVerificationLink(
    req: Request,
    payload: { id: number; email: string; firstName: string; type: string }
  ): string {
    const token = Tools.createToken(payload, '5m');
    const host = req.hostname === 'localhost' ? `${req.hostname}:${PORT}` : req.hostname;
    return `${req.protocol}://${host}/v1.0/api/auth/verify/${token}`;
  },

  /**
   * Generates email password reset link
   * @function
   * @param {*} req
   * @param {*} id
   * @param {*} email
   * @returns {URL} - password reset link
   * @memberof Toolbox
   */
  createPasswordResetLink(
    req: Request,
    payload: { id: number; email: string; firstName: string; type: string }
  ): string {
    const token = Tools.createToken(payload, '5m');
    return `${req.protocol}://${req.get('host')}/v1.0/api/auth/reset-password/${token}`;
  },

};
