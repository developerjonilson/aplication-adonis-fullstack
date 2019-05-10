'use strict'

const User = use('App/Models/User')

class LoginController {
  async redirect ({ ally }) {
    await ally.driver('facebook').redirect()
  }

  async callback ({ ally, auth, response }) {
    try {
      const fbUser = await ally.driver('facebook').getUser()

      // search for existing user
      const whereClause = {
        email: fbUser.getEmail()
      }

      const userDb = await User.find(whereClause)
      if (userDb) {
        await auth.login(userDb)
        return 'Logado'
      }

      // user details to be saved
      const userDetails = {
        email: fbUser.getEmail(),
        token: fbUser.getAccessToken(),
        login_source: 'facebook'
      }

      const user = await User.create(userDetails)
      await auth.login(user)
      return 'Logado'
    } catch (error) {
      return 'Incapaz de autenticar. Tente mais tarde'
    }
  }
}

module.exports = LoginController
