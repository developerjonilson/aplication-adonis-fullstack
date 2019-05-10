'use strict'

const User = use('App/Models/User')

class LoginController {
  async redirect ({ ally }) {
    await ally.driver('facebook').redirect()
  }

  async callback ({ ally, auth, response }) {
    try {
      const fbUser = await ally.driver('facebook').getUser()

      // user details to be saved
      // const userDetails = {
      //   email: fbUser.getEmail(),
      //   token: fbUser.getAccessToken(),
      //   login_source: 'facebook'
      // }

      // search for existing user
      const whereClause = {
        email: fbUser.getEmail()
      }

      const user = await User.find(whereClause)
      // const user = await User.findOrCreate(
      //   { email: whereClause },
      //   { username: 'virk', email: 'virk@adonisjs.com' }
      // )

      // const user = await User.findOrCreate(whereClause, userDetails)
      // await auth.login(user)

      // return 'Logado'
      console.log(user)
      return user
      // return response.send(user)
    } catch (error) {
      return 'Incapaz de autenticar. Tente mais tarde'
    }
  }
}

module.exports = LoginController
