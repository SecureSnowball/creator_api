import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Projects extends BaseSchema {
  protected tableName = 'projects'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('rawInput')
      table.string('name')
      table.string('status')
      table.integer('userId').unsigned().references('id').inTable('users')
      table.json('projectInput')
      table.boolean('isHosted')
      table.boolean('isDeleted')
      table.boolean('isCleaned')

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('createdAt', { useTz: true })
      table.timestamp('updatedAt', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
