/**
 * Input of the project with bare minimum and one table
 * That table belogns to auth
 */
import { RelationType } from 'App/Interfaces/Enums'
const oneTableMin = {
  name: 'OneIndependentTable',
  database: 'MySQL',
  types: ['API'],
  camelCaseStrategy: true,
  mailEnabled: false,
  mailers: ['SMTP'],
  defaultMailer: 'SMTP',
  storageEnabled: false,
  storageDrivers: ['Local'],
  defaultStorageDriver: 'Local',
  tech: { backend: 'Adonis', frontend: 'Buefy' },
  generate: {
    api: { generate: true, crud: true, test: true },
    spa: { generate: false, crud: true },
    app: { generate: false },
    website: { generate: false },
  },
  auth: {
    register: true,
    passwordReset: false,
    passwordChange: true,
    table: {
      name: 'User',
      generateUI: true,
      generateController: true,
      generateModel: true,
      generateMigration: false,
      timestamps: true,
      generateRoute: true,
      indexColumns: ['Name', 'Email'],
      operations: {
        index: true,
        create: true,
        store: true,
        edit: true,
        show: true,
        update: true,
        destroy: true,
        storeMany: true,
        destroyMany: true,
      },
      customOperations: [],
      relations: [],
      columns: [],
    },
  },
  tenantSettings: { user: 1, tenant: 0 },
  rbac: {
    enabled: false,
    multipleRoles: false,
    roles: [{ name: 'Admin', description: 'User with full access to everything', default: false }],
    permissions: [],
    matrix: [{ role: 'Admin', permissions: [] }],
  },
  tables: [
    {
      name: 'Country',
      generateUI: true,
      generateController: true,
      generateModel: true,
      generateMigration: true,
      defaultColumn: 'Name',
      timestamps: true,
      generateRoute: true,
      singleton: false,
      routeParents: [],
      indexColumns: ['Name', 'Code'],
      operations: {
        index: true,
        create: true,
        store: true,
        edit: true,
        show: true,
        update: true,
        destroy: true,
        storeMany: true,
        destroyMany: true,
      },
      customOperations: [],
      relations: [
        {
          type: RelationType.BelongsTo,
          withModel: '$auth',
          name: '',
          required: true,
        },
      ],
      columns: [
        {
          name: 'Name',
          type: 'String',
          meta: {
            required: true,
            minLength: 2,
            maxLength: 128,
            expose: true,
            filterable: false,
            sortable: false,
            trim: true,
          },
          input: {
            type: 'Input',
            decimal: { step: 'any' },
            select: { types: ['object', 'string', 'number'], type: 'string', options: [] },
            radio: { types: ['object', 'string', 'number'], type: 'string', options: [] },
            checkbox: { options: [] },
          },
        },
        {
          name: 'Code',
          type: 'String',
          meta: {
            required: true,
            multiline: false,
            minLength: 2,
            maxLength: 2,
            expose: true,
            filterable: false,
            sortable: false,
            trim: true,
          },
          input: {
            type: 'Input',
            decimal: { step: 'any' },
            select: { types: ['object', 'string', 'number'], type: 'string', options: [] },
            radio: { types: ['object', 'string', 'number'], type: 'string', options: [] },
            checkbox: { options: [] },
          },
        },
        {
          name: 'Description',
          type: 'String',
          meta: {
            required: false,
            multiline: true,
            maxLength: 4096,
            expose: true,
            filterable: false,
            sortable: false,
            trim: true,
          },
          input: {
            type: 'Input',
            decimal: { step: 'any' },
            select: { types: ['object', 'string', 'number'], type: 'string', options: [] },
            radio: { types: ['object', 'string', 'number'], type: 'string', options: [] },
            checkbox: { options: [] },
          },
        },
      ],
    },
  ],
}

export default oneTableMin
