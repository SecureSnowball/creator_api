import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  Backend,
  Database,
  Frontend,
  Mailer,
  ProjectType,
  RequestMethod,
  Storage,
} from 'App/Interfaces/Enums'

export default class CreateProjectValidator {
  constructor(protected ctx: HttpContextContract) {}

  protected relationSchema = schema.object().members({
    type: schema.string({ trim: true }),
    withModel: schema.string({ trim: true }),
    name: schema.string.optional({ trim: true }),
    required: schema.boolean(),
  })

  protected columnSchema = schema.object().members({
    name: schema.string({ trim: true }),
    type: schema.string({ trim: true }),
    meta: schema.object().members({
      displayName: schema.string.optional({ trim: true }),
      required: schema.boolean.optional(),
      minLength: schema.number.optional(),
      maxLength: schema.number.optional(),
      maxSize: schema.string.optional({ trim: true }),
      extensions: schema.array.optional().members(schema.string({ trim: true })),
      dbLength: schema.number.optional(),
      email: schema.boolean.optional(),
      expose: schema.boolean.optional(),
      unique: schema.boolean.optional(),
      trim: schema.boolean.optional(),
    }),
    input: schema.object.optional().members({
      type: schema.string({ trim: true }),
      decimal: schema.object.optional().anyMembers(),
      select: schema.object.optional().anyMembers(),
      radio: schema.object.optional().anyMembers(),
      checkbox: schema.object.optional().anyMembers(),
    }),
  })

  protected tableSchema = schema.object().members({
    name: schema.string({ trim: true }, rules.maxLength['127']),
    generateUI: schema.boolean.optional(),
    generateController: schema.boolean(),
    generateModel: schema.boolean(),
    generateMigration: schema.boolean(),
    timestamp: schema.boolean.optional(),
    generateRoute: schema.boolean.optional(),
    singleton: schema.boolean.optional(),
    parent: schema.string.optional({ trim: true }),
    routeParents: schema.array.optional().members(schema.string({ trim: true })),
    indexColumns: schema.array.optional().members(schema.string({ trim: true })),
    operations: schema.object().members({
      index: schema.boolean(),
      store: schema.boolean(),
      update: schema.boolean(),
      destroy: schema.boolean(),
      storeMany: schema.boolean(),
      destroyMany: schema.boolean(),
    }),
    customOperations: schema.array().members(
      schema.object().members({
        name: schema.string({ trim: true }),
        method: schema.enum([
          RequestMethod.GET,
          RequestMethod.POST,
          RequestMethod.PATCH,
          RequestMethod.PUT,
          RequestMethod.DELETE,
        ] as const),
        singular: schema.boolean(),
      })
    ),
    relations: schema.array().members(this.relationSchema),
    columns: schema.array().members(this.columnSchema),
  })

  public schema = schema.create({
    name: schema.string({ trim: true }, [rules.minLength(2), rules.maxLength(256)]),
    database: schema.enum([Database.MySQL, Database.PostgreSQL] as const),
    types: schema.array().members(schema.enum([ProjectType.API, ProjectType.SSR] as const)),
    camelCaseStrategy: schema.boolean(),
    mailEnabled: schema.boolean(),
    mailers: schema.array
      .optional([rules.requiredWhen('mailEnabled', '=', true)])
      .members(
        schema.enum.optional([Mailer.SMTP, Mailer.SES, Mailer.Mailgun, Mailer.SparkPost] as const)
      ),
    defaultMailer: schema.string.optional({ trim: true }, [
      rules.requiredWhen('mailEnabled', '=', true),
    ]),
    storageEnabled: schema.boolean(),
    storageDrivers: schema.array
      .optional([rules.requiredWhen('storageEnabled', '=', true)])
      .members(schema.enum.optional([Storage.GCS, Storage.Local, Storage.S3] as const)),
    defaultStorageDriver: schema.string.optional({ trim: true }, [
      rules.requiredWhen('storageEnabled', '=', true),
    ]),
    tech: schema.object().members({
      backend: schema.enum([Backend.Adonis] as const),
      frontend: schema.enum([Frontend.Buefy] as const),
    }),
    generate: schema.object().members({
      api: schema.object().members({
        generate: schema.boolean(),
        crud: schema.boolean(),
        test: schema.boolean(),
      }),
      spa: schema.object().members({
        generate: schema.boolean(),
        crud: schema.boolean(),
      }),
      app: schema.object.optional().members({
        generate: schema.boolean(),
      }),
      web: schema.object.optional().members({
        generate: schema.boolean(),
      }),
    }),
    auth: schema.object().members({
      register: schema.boolean(),
      passwordReset: schema.boolean(),
      passwordChange: schema.boolean(),
      table: this.tableSchema,
    }),
    tenantSettings: schema.object().members({
      user: schema.enum([1, 0, 'n'] as const),
      tenant: schema.enum([1, 0, 'n'] as const),
      table: schema.string.optional({ trim: true }),
    }),
    rbac: schema.object().members({
      enabled: schema.boolean(),
      multipleRoles: schema.boolean.optional([rules.requiredWhen('rbac.enabled', '=', true)]),
      canAdminCreateRoles: schema.boolean.optional([rules.requiredWhen('rbac.enabled', '=', true)]),
      defaultRole: schema.string.optional({ trim: true }, [
        rules.requiredWhen('rbac.enabled', '=', true),
      ]),
      roles: schema.array
        .optional([rules.requiredWhen('rbac.enabled', '=', true)])
        .members(schema.string({ trim: true })),
      permissions: schema.array
        .optional([rules.requiredWhen('rbac.enabled', '=', true)])
        .members(schema.string({ trim: true })),
      matrix: schema.array.optional([rules.requiredWhen('rbac.enabled', '=', true)]).members(
        schema.object().members({
          role: schema.string({ trim: true }),
          permissions: schema.array().members(schema.string({ trim: true })),
        })
      ),
    }),
    tables: schema.array().members(this.tableSchema),
  })

  public messages = {}
}
