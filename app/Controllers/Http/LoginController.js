'use strict'

const User = use('App/Models/User')

class LoginController {
  async redirect ({ ally }) {
    await ally.driver('facebook').redirect()
  }

  async callback ({ ally, auth }) {
    try {
      const fbUser = await ally.driver('facebook').getUser()

      // user details to be saved
      const userDetails = {
        email: fbUser.getEmail(),
        token: fbUser.getAccessToken(),
        login_source: 'facebook'
      }

      // search for existing user
      const whereClause = {
        email: fbUser.getEmail()
      }

      const user = await User.findOrCreate(whereClause, userDetails)
      await auth.login(user)

      return 'Logado'
    } catch (error) {
      return 'Incapaz de autenticar. Tente mais tarde'
    }
  }
}

module.exports = LoginController
