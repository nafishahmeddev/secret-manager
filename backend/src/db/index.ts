export * from './models';
import { User } from './models';
import sequelize from './sequelize';

export const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    await sequelize.sync({
      alter: true,
    }); // Sync all models

    let superadmin = await User.findOne({
      where: { email: 'admin@secret.com' }
    });
    if (!superadmin) {
      superadmin = await User.create({
        name: 'Super Admin',
        email: 'admin@secret.com',
        password: '12345678',
      });
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}