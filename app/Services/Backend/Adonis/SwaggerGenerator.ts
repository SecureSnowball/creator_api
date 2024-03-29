import { string } from '@ioc:Adonis/Core/Helpers'
import { RelationType } from 'App/Interfaces/Enums'
import ProjectInput, { Column, Relation } from 'App/Interfaces/ProjectInput'

export default class SwaggerGenerator {
  private input: ProjectInput

  constructor(input: ProjectInput) {
    this.input = input
  }

  /**
   * Prepares very basic metadata about project
   * @returns {Object}
   */
  protected prepareInfo() {
    return {
      title: string.noCase(this.input.name),
      description: `This is API OpenAPI 3 documentation for ${string.noCase(this.input.name)}`,
      version: '1.0.0',
    }
  }

  protected prepareModelPath(paths) {
    const security = [
      {
        bearerAuth: [],
      },
    ]
    this.input.tables.forEach((table) => {
      const routeParentInPathSchema: unknown[] = []
      const routeParentPart = table.routeParentRelations.length
        ? table.routeParentRelations
            .map((parentTable) => {
              routeParentInPathSchema.push({
                in: 'path',
                name: `${parentTable.names?.camelCase}Id`,
                schema: {
                  type: 'integer',
                  format: 'int64',
                  example: 1,
                },
                required: true,
                description: `ID of the ${parentTable.names?.camelCase}`,
              })
              return `/${parentTable.names?.camelCase}/{${parentTable.names?.camelCase}Id}`
            })
            .join('')
        : ''

      if (table.operations.index) {
        const queryParams: unknown[] = []
        table.columns
          .filter((c) => c.meta.filterable)
          .forEach((column) => {
            queryParams.push({
              in: 'query',
              name: column.columnName,
              schema: {
                type: 'string',
              },
              description: `Filter data by ${column.columnName}`,
            })
          })
        if (!paths[`${routeParentPart}/${table.names.camelCase}`]) {
          paths[`${routeParentPart}/${table.names.camelCase}`] = {}
        }
        paths[`${routeParentPart}/${table.names.camelCase}`].get = {
          security,
          tags: [table.names.pascalCase],
          summary: `Returns list of ${table.names.camelCasePlural}`,
          operationId: `${table.names.camelCase}Index`,
          parameters: [...routeParentInPathSchema, ...queryParams],
          responses: {
            '200': {
              description: `List of ${table.names.camelCasePlural}`,
              content: {
                'application/json': {
                  schema: {
                    $ref: `#/components/schemas/${table.names.pascalCase}List`,
                  },
                },
              },
            },
          },
        }
      }

      if (table.operations.store) {
        if (!paths[`${routeParentPart}/${table.names.camelCase}`]) {
          paths[`${routeParentPart}/${table.names.camelCase}`] = {}
        }
        paths[`${routeParentPart}/${table.names.camelCase}`].post = {
          security,
          tags: [table.names.pascalCase],
          summary: `Create new ${table.names.camelCase}`,
          operationId: `${table.names.camelCase}Store`,
          parameters: routeParentInPathSchema,
          responses: {
            '200': {
              description: `Newly created ${table.names.camelCase}`,
              content: {
                'application/json': {
                  schema: {
                    $ref: `#/components/schemas/${table.names.pascalCase}`,
                  },
                },
              },
            },
          },
        }
      }

      if (table.operations.show) {
        if (!paths[`${routeParentPart}/${table.names.camelCase}/{${table.names.camelCase}Id}`]) {
          paths[`${routeParentPart}/${table.names.camelCase}/{${table.names.camelCase}Id}`] = {}
        }
        paths[`${routeParentPart}/${table.names.camelCase}/{${table.names.camelCase}Id}`].get = {
          security,
          tags: [table.names.pascalCase],
          summary: `Get ${table.names.camelCase}`,
          parameters: [
            {
              in: 'path',
              name: `${table.names.camelCase}Id`,
              schema: {
                type: 'integer',
                format: 'int64',
                example: 1,
              },
              required: true,
              description: `ID of the ${table.names.camelCase} to get`,
            },
            ...routeParentInPathSchema,
          ],
          operationId: `${table.names.camelCase}Show`,
          responses: {
            '200': {
              description: `Newly created ${table.names.camelCase}`,
              content: {
                'application/json': {
                  schema: {
                    $ref: `#/components/schemas/${table.names.pascalCase}`,
                  },
                },
              },
            },
          },
        }
      }

      if (table.operations.update) {
        if (!paths[`${routeParentPart}/${table.names.camelCase}/{${table.names.camelCase}Id}`]) {
          paths[`${routeParentPart}/${table.names.camelCase}/{${table.names.camelCase}Id}`] = {}
        }
        paths[`${routeParentPart}/${table.names.camelCase}/{${table.names.camelCase}Id}`].put = {
          security,
          tags: [table.names.pascalCase],
          summary: `Update existing ${table.names.camelCase}`,
          parameters: [
            {
              in: 'path',
              name: `${table.names.camelCase}Id`,
              schema: {
                type: 'integer',
                format: 'int64',
                example: 1,
              },
              required: true,
              description: `ID of the ${table.names.camelCase} to update`,
            },
            ...routeParentInPathSchema,
          ],
          operationId: `${table.names.camelCase}Destroy`,
          responses: {
            '200': {
              description: `Newly created ${table.names.camelCase}`,
              content: {
                'application/json': {
                  schema: {
                    $ref: `#/components/schemas/${table.names.pascalCase}`,
                  },
                },
              },
            },
          },
        }
      }

      if (table.operations.destroy) {
        if (!paths[`${routeParentPart}/${table.names.camelCase}/{${table.names.camelCase}Id}`]) {
          paths[`${routeParentPart}/${table.names.camelCase}/{${table.names.camelCase}Id}`] = {}
        }
        paths[`${routeParentPart}/${table.names.camelCase}/{${table.names.camelCase}Id}`].delete = {
          security,
          tags: [table.names.pascalCase],
          summary: `Delete ${table.names.camelCase}`,
          parameters: [
            {
              in: 'path',
              name: `${table.names.camelCase}Id`,
              schema: {
                type: 'integer',
                format: 'int64',
                example: 1,
              },
              required: true,
              description: `ID of the ${table.names.camelCase} to update`,
            },
            ...routeParentInPathSchema,
          ],
          operationId: `${table.names.camelCase}Update`,
          responses: {
            '204': {
              description: 'No body',
              content: {},
            },
          },
        }
      }
    })
  }

  /**
   * All routers are defined here
   */
  protected preparePaths() {
    const paths = {}
    const registerPathSchema = {
      post: {
        tags: ['Auth'],
        summary: 'Register user and get auth token',
        operationId: 'register',
        requestBody: {
          description: 'Enter username/email and password and other basic details',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RegisterRequest',
              },
            },
            'application/x-www-form-urlencoded': {
              schema: {
                $ref: '#/components/schemas/RegisterRequest',
              },
            },
          },
        },
        responses: {
          '422': {
            description: 'Validation errors',
            content: {},
          },
          '200': {
            description: 'Registration successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginResponse',
                },
              },
            },
          },
        },
      },
    }
    const loginPathSchema = {
      post: {
        tags: ['Auth'],
        summary: 'Login user and get auth token',
        operationId: 'login',
        requestBody: {
          description: 'Email and password',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginRequest',
              },
            },
            'application/x-www-form-urlencoded': {
              schema: {
                $ref: '#/components/schemas/LoginRequest',
              },
            },
          },
        },
        responses: {
          '400': {
            description: 'Email or password incorrect',
            content: {},
          },
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginResponse',
                },
              },
            },
          },
        },
      },
    }
    const logoutPathSchema = {
      post: {
        tags: ['Auth'],
        summary: 'Logout',
        operationId: 'logout',
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          description: 'Empty request body',
          content: {},
        },
        responses: {
          '200': {
            description: 'String indicating successful logout',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LogoutResonse',
                },
              },
            },
          },
        },
      },
    }

    // Auth routes
    if (this.input.auth.register) paths['/register'] = registerPathSchema
    paths['/login'] = loginPathSchema
    paths['/logout'] = logoutPathSchema

    // Prepare model paths
    this.prepareModelPath(paths)
    return paths
  }

  /**
   * Tags allows you to categorize your API by logical groups
   * Example: auth, user, rbac, post, comment, etc.
   * @returns {Object}
   */
  protected prepareTags() {
    const tags = [
      {
        name: 'Auth',
        description:
          'Everything related to authentication like login, register, forget password, etc.',
      },
      {
        name: 'Me',
        description: 'Everything related to loggged in user like profile, update profile, etc.',
      },
      {
        name: 'User',
        description: 'Everything related to user model',
      },
    ]

    // Conditionally add rbac if required
    if (this.input.rbac.enabled) {
      tags.push({
        name: 'RBAC',
        description: 'Role & permission management system',
      })
    }
    this.input.tables.forEach((table) => {
      tags.push({
        name: table.names.pascalCase,
        description: `Everything related to ${table.names.camelCase} model`,
      })
    })
    return tags
  }

  /**
   * Prepares model schema for component
   */
  protected prepareRequestResponseSchemas() {
    const properties: any = {
      id: {
        type: 'integer',
        format: 'int64',
        example: 1,
      },
    }

    this.input.auth.table.columns.forEach((column) => {
      properties[column.columnName] = {
        type: column.type.toLowerCase(),
      }
    })

    const user = {
      type: 'object',
      properties,
    }
    return {
      RegisterRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            example: 'John Doe',
          },
          email: {
            type: 'string',
            example: 'john@example.com',
            format: 'email',
            maxLength: 128,
          },
          password: {
            type: 'string',
            example: 'P@ssw0rd',
          },
          passwordConfirmation: {
            type: 'string',
            example: 'P@ssw0rd',
          },
        },
      },
      LoginRequest: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            example: 'john@example.com',
          },
          password: {
            type: 'string',
            example: 'P@ssw0rd',
          },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            example: 'MzA.LuljnEe7Y9QzHSmL2tdsjkXNuyy96p39D9ZUNsdY-WiGIU-cwaRpSfsLrpIz',
          },
          user: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                format: 'int32',
                example: 1,
              },
              name: {
                type: 'string',
                example: 'John Doe',
              },
              email: {
                type: 'string',
                example: 'john@example.com',
              },
            },
          },
        },
      },
      LogoutResonse: {
        type: 'string',
        example: 'You have been logged out',
      },
      User: user,
    }
  }

  protected getColumnDetails(column: Column) {
    const columnMetaData = {
      nullable: !column.meta.required,
    }
    switch (column.type) {
      case 'String':
        columnMetaData['type'] = 'string'
        if (column.meta.minLength) columnMetaData['minLength'] = column.meta.minLength
        if (column.meta.maxLength) columnMetaData['maxLength'] = column.meta.maxLength
        if (column.meta.email) columnMetaData['format'] = 'email'
        break
      case 'Decimal':
        columnMetaData['type'] = 'number'
        columnMetaData['format'] = 'double'
        if (column.meta.min) columnMetaData['minimum'] = column.meta.min
        if (column.meta.max) columnMetaData['maximum'] = column.meta.max
        if (column.input?.decimal?.step) columnMetaData['multipleOf'] = column.input?.decimal?.step
        break
      case 'Integer':
        columnMetaData['type'] = 'number'
        columnMetaData['format'] = 'int64'
        if (column.meta.min) columnMetaData['minimum'] = column.meta.min
        if (column.meta.max) columnMetaData['maximum'] = column.meta.max
        break
      case 'Date':
        columnMetaData['type'] = 'string'
        columnMetaData['formate'] = 'date-time'
        break
      case 'Boolean':
        columnMetaData['type'] = 'string'
        break
    }
    return columnMetaData
  }

  protected getRelationDetails(relation: Relation) {
    switch (relation.type) {
      case RelationType.BelongsTo:
      case RelationType.HasOne:
        return {
          [relation.names!.camelCase]: {
            $ref: `#/components/schemas/${relation.modelNames.pascalCase}`,
          },
        }
      default:
        return {
          [relation.names!.camelCasePlural]: {
            type: 'array',
            items: {
              $ref: `#/components/schemas/${relation.modelNames.pascalCase}`,
            },
          },
        }
    }
  }

  protected prepareModelSchema() {
    const integerSchema = {
      type: 'integer',
      format: 'int64',
      example: 20,
    }
    const pageUrlSchema = {
      type: 'string',
      example: '/?page=1',
    }
    const modelsScheam = {
      PaginationMeta: {
        type: 'object',
        properties: {
          total: integerSchema,
          perPage: integerSchema,
          currentPage: integerSchema,
          fistPage: integerSchema,
          lastPage: integerSchema,
          firstPageUrl: pageUrlSchema,
          lastPageUrl: pageUrlSchema,
          nextPageUrl: pageUrlSchema,
          previousPageUrl: pageUrlSchema,
        },
      },
    }

    this.input.tables.forEach((table) => {
      const columnsSchema = {}
      let relationsSchema = {}
      table.columns.map((column) => {
        columnsSchema[column.columnName] = this.getColumnDetails(column)
      })
      table.relations.map((relation) => {
        relationsSchema = {
          ...relationsSchema,
          ...this.getRelationDetails(relation),
        }
      })
      modelsScheam[table.names.pascalCase] = {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
            example: 1,
            nullable: false,
          },
          ...columnsSchema,
          ...relationsSchema,
        },
      }
      modelsScheam[`${table.names.pascalCase}List`] = {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            meta: {
              $ref: `#/components/schemas/PaginationMeta`,
            },
            data: {
              $ref: `#/components/schemas/${table.names.pascalCase}`,
            },
          },
        },
      }
    })
    return modelsScheam
  }

  /**
   * Prepare models and security (autherization)
   */
  protected prepareComponents() {
    return {
      schemas: {
        ...this.prepareRequestResponseSchemas(),
        ...this.prepareModelSchema(),
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    }
  }

  /**
   * Steps
   * 1. Prepare an object because it is easy to work
   * 2. Write it as json file or convert it to yaml and write
   */
  protected async start() {
    const openApi3Schema = {
      openapi: '3.0.1',
      info: this.prepareInfo(),
      servers: [
        {
          url: 'http://localhost:3333/api',
        },
      ],
      tags: this.prepareTags(),
      paths: this.preparePaths(),
      components: this.prepareComponents(),
    }
    return openApi3Schema
  }

  public async init() {
    return this.start()
  }
}
