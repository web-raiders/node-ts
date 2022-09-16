import { Model, UUIDV4 } from 'sequelize';

interface UserAttributes {
  id: string;
  fullName: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

module.exports = (sequelize: any, DataTypes: any): any => {
  class User extends Model<UserAttributes> implements UserAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: string;
    fullName!: string;
    email!: string;
    // static associate(models: any): any {}
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
