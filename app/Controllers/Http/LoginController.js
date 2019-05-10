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
        return 'Logado!'
      }

      // user details to be saved
      const userDetails = {
        email: fbUser.getEmail(),
        token: fbUser.getAccessToken(),
        provider: 'facebook',
        name: fbUser.getName(),
        username: fbUser.getNickname(),
        provider_id: fbUser.getId(),
        avatar: fbUser.getAvatar()
      }

      const user = await User.create(userDetails)
      await auth.login(user)
      return 'Logado!'
    } catch (error) {
      return 'Incapaz de autenticar. Tente mais tarde'
    }
  }

  async logout ({ auth, response }) {
    await auth.logout()

    response.redirect('/')
  }
}

module.exports = LoginController
