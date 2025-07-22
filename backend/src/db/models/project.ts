import { Model, Optional } from 'sequelize';
import sequelize from '../sequelize';
import EncryptionUtils from '@app/utils/encryption';
const API_ENCRYPTION_KEY = String(process.env.API_ENCRYPTION_KEY);
type ProjectAttributes = {
  id: string;
  key: string;
  name: string;
  apiSecret: string;
  description?: string;
  secrets?: Record<string, string>;
  allowedIps?: string[];

  generateApiSecret?: () => Promise<void>;
  verifyApiSecret?: (apiSecret: string) => Promise<boolean>;
}
type ProjectCreationAttributes = Optional<ProjectAttributes, 'id' | 'description' | 'secrets' | 'key' | 'apiSecret' | 'generateApiSecret' | 'verifyApiSecret' | 'allowedIps'>;

class Project extends Model<ProjectAttributes, ProjectCreationAttributes> {
  declare id: string;
  declare key: string;
  declare apiSecret: string
  declare name: string;
  declare description?: string;
  declare secrets?: Record<string, string>;
  declare allowedIps?: string[];


  async generateApiSecret(): Promise<void> {
    this.apiSecret = await EncryptionUtils.encrypt(JSON.stringify({
      key: this.key,
      timestamp: Date.now(),
    }), API_ENCRYPTION_KEY);
  }

  async verifyApiSecret(apiSecret: string): Promise<{ key: string; } | false> {
    try {
      const decrypted = await EncryptionUtils.decrypt(apiSecret, API_ENCRYPTION_KEY);
      const data = JSON.parse(decrypted);
      if (data.key !== this.key) {
        throw new Error("Invalid Api Secret");
      }
      return data as { key: string; };
    } catch (error) {
      throw new Error("Invalid Api Secret");
    }
  }



}

function generateRandomKey(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

Project.init({
  id: {
    type: sequelize.Sequelize.UUID,
    defaultValue: sequelize.Sequelize.UUIDV4,
    primaryKey: true,
  },
  key: {
    type: sequelize.Sequelize.STRING,
    allowNull: false,
    unique: true, // Assuming 'key' should be unique across projects
    defaultValue: () => generateRandomKey(32), // Generate random key if not provided
  },
  apiSecret: {
    type: sequelize.Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: sequelize.Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: sequelize.Sequelize.STRING,
    allowNull: true,
  },

  secrets: {
    type: sequelize.Sequelize.JSONB,
    allowNull: true,
  },
  allowedIps: {
    type: sequelize.Sequelize.JSON,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Project',
  hooks: {
    beforeValidate: async function (project) {
      if (project.isNewRecord) {
        await project.generateApiSecret();
      }
    }
  }
});



export default Project;