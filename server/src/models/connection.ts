"use strict";
import { Sequelize } from "sequelize";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const env = process.env.NODE_ENV || "development";
const config = JSON.parse(readFileSync(join(__dirname, "..", "config", "config.json"), "utf-8"))[env];
const sequelizeConnection: Sequelize = new Sequelize(config.database, config.username, config.password, config);

export default sequelizeConnection;
