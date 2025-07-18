import { Model, Optional } from 'sequelize';
import sequelize from '../sequelize';
import EncryptionUtils from '@app/utils/encryption';

const PASSWORD_ENCRYPTION_KEY = String(process.env.PASSWORD_ENCRYPTION_KEY);

type UserAttributes = {
  id: string;
  name: string;
  email: string;
  password: string;

  verifyPassword?: (password: string) => Promise<boolean>;
  setPassword?: (password: string) => Promise<void>;
};

type UserCreationAttributes = Optional<UserAttributes, 'id'>;

class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: string;
  declare name: string;
  declare email: string;
  declare password: string;

  async verifyPassword(password: string): Promise<boolean> {
    try {
      const decrypted = await EncryptionUtils.decrypt(this.password, PASSWORD_ENCRYPTION_KEY);
      return decrypted === password;
    } catch (error) {
      return false;
    }
  }

  async setPassword(password: string): Promise<void> {
    this.password = await EncryptionUtils.encrypt(password, PASSWORD_ENCRYPTION_KEY);
  }
}

User.init({
  id: {
    type: sequelize.Sequelize.UUID,
    defaultValue: sequelize.Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: sequelize.Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: sequelize.Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: sequelize.Sequelize.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'User',
  hooks: {
    beforeCreate: async function (user) {
      user.password = await EncryptionUtils.encrypt(user.password, PASSWORD_ENCRYPTION_KEY);
    },
  },
});

export default User;