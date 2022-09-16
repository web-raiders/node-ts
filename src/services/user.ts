import { ApiError } from '../utils/tools';
import models from '../models';

const { User } = models;

interface UserInterface {
  id: string;
  fullName: string;
  email?: string;
}

/**
 * User Table servives
 */
const UserServices = {
  /**
   * add entity to database
   * @async
   * @param {object} payload - model data
   * @returns {Promis-Object} A promise object with entity details
   * @memberof UserServices
   */
  async addUser(payload: object): Promise<UserInterface> {
    try {

    } catch (error) {
      throw new ApiError(500, 'Something went wrong while adding resource', error);
    }
  },
};

export default UserServices;
