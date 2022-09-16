/* eslint-disable no-unused-vars */
import { Request, Response } from 'express';
import { ApiResponse, Tools, Mailer } from '../utils';
import models from '../models';
import { env } from '../config';

const { successResponse, errorResponse } = ApiResponse;

const {
  User,
} = models;

const TestController = {
  /**
   * test function
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof AuthController
   */
  async testFunction(req: Request, res: Response): Promise<void> {
    try {
      // logic goes here
    } catch (error) {
      errorResponse(res, {});
    }
  },
};

export default TestController;
