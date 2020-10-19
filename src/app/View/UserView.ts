import User from '../models/User';



export default {

  render(User: User){


    return{
      id: User.id,
      name: User.name,
      email: User.email,
      authorized: User.authorized
    }
  }
}