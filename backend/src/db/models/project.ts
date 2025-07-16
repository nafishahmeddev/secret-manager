import { Model, Optional } from 'sequelize';
import sequelize from '../sequelize';
type ProjectAttributes = {
  id: string; // UUIDs are typically represented as strings
  name: string;
  description?: string;
  secrets?: Record<string, string>;
}
type ProjectCreationAttributes = Optional<ProjectAttributes, 'id' | 'description' | 'secrets'>;

class Project extends Model<ProjectAttributes, ProjectCreationAttributes> {
  declare id: string;
  declare name: string;
  declare description?: string;
  declare secrets?: Record<string, string>; // Assuming secrets is a JSON object
}

Project.init({
  id: {
    type: sequelize.Sequelize.UUID,
    defaultValue: sequelize.Sequelize.UUIDV4,
    primaryKey: true,
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