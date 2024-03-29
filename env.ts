/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
  APP_NAME: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  PORT: Env.schema.number(),
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  APP_KEY: Env.schema.string(),
  CACHE_VIEWS: Env.schema.boolean(),
  UI_URL: Env.schema.string(), // Used in mail
  AUTO_VERIFY_EMAIL: Env.schema.boolean(),

  DB_CONNECTION: Env.schema.enum(['mysql'] as const),
  DB_DEBUG: Env.schema.boolean.optional(),
  MYSQL_HOST: Env.schema.string({ format: 'host' }),
  MYSQL_PORT: Env.schema.number(),
  MYSQL_USER: Env.schema.string(),
  MYSQL_PASSWORD: Env.schema.string.optional(),
  MYSQL_DB_NAME: Env.schema.string(),

  PROJECT_PATH: Env.schema.string(),

  MAIL_FROM_ADDRESS: Env.schema.string({ format: 'email' }),
  SMTP_HOST: Env.schema.string(),
  SMTP_PORT: Env.schema.number(),
  SMTP_USERNAME: Env.schema.string(),
  SMTP_PASSWORD: Env.schema.string(),

  REDIS_CONNECTION: Env.schema.enum(['local'] as const),
  REDIS_HOST: Env.schema.string({ format: 'host' }),
  REDIS_PORT: Env.schema.number(),
  REDIS_PASSWORD: Env.schema.string.optional(),

  ENABLE_HOSTING: Env.schema.boolean.optional(),
  HOSTING_UI_DOMAIN: Env.schema.string.optional({ format: 'host' }),
  HOSTING_API_DOMAIN: Env.schema.string.optional({ format: 'host' }),
  ROOT_MYSQL_HOST: Env.schema.string.optional(),
  ROOT_MYSQL_PORT: Env.schema.number.optional(),
  ROOT_MYSQL_PASSWORD: Env.schema.string.optional(),

  GIT_REPO_API_ADONIS: Env.schema.string(),
  GIT_REPO_WEB_ADONIS: Env.schema.string(),
  GIT_REPO_SPA_VUE_BUEFY: Env.schema.string(),
})
