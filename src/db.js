import { Sequelize } from "sequelize";

const { PG_DB, PG_USER, PG_PASSWORD, PG_HOST, PG_PORT } = process.env;

console.log("PG_DB:", PG_DB);
console.log("PG_USER:", PG_USER);
console.log("PG_PASSWORD:", PG_PASSWORD);
console.log("PG_HOST:", PG_HOST);
console.log("PG_PORT:", PG_PORT);

const sequelize = new Sequelize(PG_DB, PG_USER, PG_PASSWORD, {
  host: PG_HOST,
  port: PG_PORT,
  dialect: "postgres",
});

export const pgConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Successfully connected to Postgres!`);
    await sequelize.sync();
    console.log(`All models synchronized!`);
  } catch (error) {
    console.log(error);
    process.exit(1); // KILLS NODE JS PROJECT
  }
};

export default sequelize;
