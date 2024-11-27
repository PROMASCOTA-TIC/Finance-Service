import 'dotenv/config';
import * as joi from 'joi';	

interface EnvVars{
    EXPENSES_PORT: number;
    DB_DIALECT: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
}

const envsSchema = joi.object({
    EXPENSES_PORT: joi.number().required(),
    DB_DIALECT: joi.string().required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required(),
})
.unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars = value;

export const envs = {
    expensesport: envVars.EXPENSES_PORT,
    dbDialect: envVars.DB_DIALECT,
    dbHost: envVars.DB_HOST,
    dbPort: envVars.DB_PORT,
    dbUsername: envVars.DB_USERNAME,
    dbPassword: envVars.DB_PASSWORD,
    dbName: envVars.DB_NAME,
}