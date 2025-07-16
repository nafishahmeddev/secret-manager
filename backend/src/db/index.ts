export * from './models';
import sequelize from './sequelize';

export const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    await sequelize.sync({
      alter: true,
    }); // Sync all models
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}