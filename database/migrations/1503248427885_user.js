'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', table => {
      table.increments()
      table.string('name').notNullable()
      table.string('username', 80).notNullable()
      table
        .string('email', 254)
        .notNullable()
        .unique()
      table.string('password', 60)
      table.string('avatar')
      table.string('provider_id')
      table.string('provider').notNullable()
      table.string('token')
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
