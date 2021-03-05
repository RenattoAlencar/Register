import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'

import UsersRepository from '../repositories/UserRepository'

class UserController {
  async create(request: Request, response: Response) {
    const userRepository = getCustomRepository(UsersRepository)

    const { name, username, password } = request.body

    const existUser = await userRepository.findOne({ username })

    if (existUser) {
      return response.status(400).json({ message: 'User already exists' })
    }

    const user = userRepository.create({
      name,
      username,
      password
    })
    await userRepository.save(user)

    return response.status(201).json(user)
  }
}

export default UserController
