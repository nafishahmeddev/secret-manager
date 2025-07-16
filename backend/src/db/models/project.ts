import { Model, Optional } from 'sequelize';
import sequelize from '../sequelize';
type ProjectAttributes = {
  id: string; // UUIDs are typically represented as strings
  key: string; // Assuming 'key' is a unique identifier for the project
  name: string;
  description?: string;
  secrets?: Record<string, string>;
}
type ProjectCreationAttributes = Optional<ProjectAttributes, 'id' | 'description' | 'secrets' | 'key'>;

class Project extends Model<ProjectAttributes, ProjectCreationAttributes> {
  declare id: string;
  declare key: string; // Assuming 'key' is a unique identifier for the project
  declare name: string;
  declare description?: string;
  declare secrets?: Record<string, string>; // Assuming secrets is a JSON object
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
    defaultValue: () => generateRandomKey(), // Generate random key if not provided
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
  }
}, {
  sequelize,
  modelName: 'Project',
});



export default Project;