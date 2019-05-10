'use strict'

const User = use('App/Models/User')

class LoginController {
  async redirect ({ ally }) {
    await ally.driver('instagram').redirect()
  }

  async callback ({ ally, auth }) {
    try {
      const insUser = await ally.driver('instagram').getUser()

      // user details to be saved
      const userDetails = {
        email: insUser.getEmail(),
        token: insUser.getAccessToken(),
        avatar: insUser.getAvatar(),
        login_source: 'instagram'
      }

      // search for existing user
      const whereClause = {
        email: insUser.getEmail()
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
