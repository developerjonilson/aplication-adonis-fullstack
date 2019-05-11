'use strict'

const User = use('App/Models/User')
const Database = use('Database')

class LoginController {
  // somente com usando o facebook
  // async redirect ({ ally }) {
  //   await ally.driver('facebook').redirect()
  // }

  // somente com usando o facebook segundo metodo
  // async callback ({ ally, auth, response }) {
  //   try {
  //     const fbUser = await ally.driver('facebook').getUser()

  //     // search for existing user
  //     const whereClause = {
  //       email: fbUser.getEmail()
  //     }

  //     const userDb = await User.find(whereClause)
  //     if (userDb) {
  //       await auth.login(userDb)
  //       return response.redirect('/')
  //     }

  //     // user details to be saved
  //     const userDetails = {
  //       email: fbUser.getEmail(),
  //       token: fbUser.getAccessToken(),
  //       provider: 'facebook',
  //       name: fbUser.getName(),
  //       username: fbUser.getNickname(),
  //       provider_id: fbUser.getId(),
  //       avatar: fbUser.getAvatar()
  //     }

  //     const user = await User.create(userDetails)
  //     await auth.login(user)
  //     return response.redirect('/')
  //   } catch (error) {
  //     return 'Incapaz de autenticar. Tente mais tarde'
  //   }
  // }

  async redirect ({ ally, params }) {
    if (params.provider === 'admin') {
      return 'admin user!'
    }

    await ally.driver(params.provider).redirect()
  }

  // login com facebook e instagram
  async callback ({ params, ally, auth, response }) {
    const provider = params.provider

    const userData = await ally.driver(provider).getUser()
    const idUser = userData.getId()

    const whereClause = {
      provider: params.provider,
      provider_id: idUser
    }

    // const authSaved = await User.findBy(whereClause)

    const authSaved = await Database.from('users')
      .where({ provider: params.provider })
      .where({ provider_id: idUser })
      .first()

    if (!authSaved) {
      return 'Usuario não existe no banco'
    }

    return response.send(whereClause, authSaved)

    // try {
    //   const userData = await ally.driver(provider).getUser()

    // const userId = userData.id
    // const userDetails = {
    //   email: userData.getEmail(),
    //   token: userData.getAccessToken(),
    //   provider: provider,
    //   name: userData.getName(),
    //   username: userData.getNickname(),
    //   provider_id: userData.getId(),
    //   avatar: userData.getAvatar()
    // }

    // const authUser = await User.query()
    //   .where({
    //     provider: params.provider,
    //     provider_id: userData.getId()
    //   })
    //   .first()
    // console.log(userData.getId())

    // const authUser = await User.query()
    //   .where({ provider: params.provider })
    //   .where({ provider_id: userData.getId() })
    //   .first()
    // const authUser = await Database.from('users')
    //   .where('provider', params.provider)
    //   .where('provider_id', userData.getId())
    //   .first()

    // return response.send(authUser)

    // return authUser

    // if (!(authUser === null)) {
    //   await auth.loginViaId(authUser.id)
    //   return response.redirect('/')
    // } else {
    //   if (!(userData.getEmail() === null)) {
    //     // search for existing user by email
    //     const whereClause = {
    //       email: userData.getEmail()
    //     }

    //     const userDb = await User.find(whereClause)
    //     if (userDb) {
    //       await auth.login(userDb)
    //       return response.redirect('/')
    //     }

    //     // user details to be saved
    //     const userDetails = {
    //       email: userData.getEmail(),
    //       token: userData.getAccessToken(),
    //       provider: provider,
    //       name: userData.getName(),
    //       username: userData.getNickname(),
    //       provider_id: userData.getId(),
    //       avatar: userData.getAvatar()
    //     }

    //     const user = await User.create(userDetails)
    //     await auth.login(user)
    //     return response.redirect('/')
    //   }
    // }
    // } catch (error) {
    //   return 'Incapaz de autenticar. Tente mais tarde'
    // }
  }

  async logout ({ auth, response }) {
    await auth.logout()

    return response.redirect('/')
  }
}

module.exports = LoginController
