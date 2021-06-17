export interface Names {
  camelCase: string
  pascalCase: string
  snakeCase: string
  camelCasePlural: string
  pascalCasePlural: string
  snakeCasePlural: string
}

export interface ExtendedNames extends Names {
  dashCase: string
  dashCasePlural: string
}

export interface Meta {
  expose: boolean // If this field is false then it won't show in create/update form
  dbLength?: number // Override length in db, useful for fields like password
  secret?: boolean // These fields won't be serialized like password, only works with string for now
  required: boolean // Required or not on db level, propogated in all layers
  unique?: boolean // Unique on db level, propogated till validation layer
  multiline?: boolean // Text or string on db level, propogated in all layers
  minLength?: number // Min length in string in UI and validator
  maxLength?: number // Max length in string in DB, UI and validator
  email?: boolean // String is email or not, UI and validator
  url?: boolean // String is url or not, UI and validator
  min?: number // Number min value, UI and validator
  max?: number // Number max value, UI and validator
  defaultTo: string | number | boolean // Default value in db
  index: boolean // Database level index
}

/**
 * Multiline string is alrady converted to textarea, only available option is WYSIWYG
 * String, Number can be input, select, radio, checkbox, file(String only)
 * Boolean can be radio or select
 * Maxlength and minlengh is already coming from meta
 */
export interface Input {
  displayName?: string // Display name will be used as label when displaying a field
  type?: string // input, select, radio, checkbox, file(String only)
  decimal?: {
    step: number|string // Only allowed for decimal inputs
  }
  select?: {
    options: any[]
  }
  radio?: {
    options: any[]
  }
  checkbox?: {
    options: any[]
  }
}

export interface Column {
  name: string
  names: Names
  columnName: string // In DB
  type: string // string, decimal, integer, date, boolean
  meta: Meta
  input?: Input
}

export interface Table {
  name: string
  names: Names
  tableName: string // In DB
  operations: string[]
  columns: Column[]
  timestamps: boolean
  role: string
}

export default interface ProjectInput {
  name: string // should be camelcase
  names: ExtendedNames
  projectsPath: string // Folder where all prjoects are stored
  path: string // project folder full path
  spaPath: string // project folder full path
  basePath: string // Project folder name
  generate: {
    api: {
      generate: boolean
      init: boolean
      db: boolean
      auth: boolean
      crud: boolean
      test: boolean
    }
    spa: {
      generate: boolean
      init: boolean
      auth: boolean
      crud: boolean
    }
    app: {
      generate: boolean
    }
    website: {
      generate: boolean
    }
  }
  auth: {
    login: boolean
    register: boolean
    table: Table
  }
  git: {
    name: string
    email: string
  }
  database: string // should be smallcase
  types: string[] // should be smallcaps, can be api or web
  camelCaseStrategy: boolean
  tables: Table[]
  tech: {
    backend?: string
    frontend?: string
    app?: string
  }
}
