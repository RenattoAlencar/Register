import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import UserRepository from '../repositories/UserRepository'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

class SessionController {
  async create(request: Request, response: Response) {
    const { username, password } = request.body

    const userRepository = getCustomRepository(UserRepository)
    const user = await userRepository.findOne({
      username
    })
    if (!user) {
      return response.status(400).json({ error: 'User not found' })
    }

    // Compare password
    const matchPassword = await compare(password, user.password)
    if (!matchPassword) {
      return response.status(400).json({ error: 'Incorrect password or username' })
    }

    const token = sign({}, process.env.SECRET_KEY, {
      subject: user.id,
      expiresIn: '1d'
    })
    delete user.password
    return response.json({
      token,
      user
    })
  }
}
export default SessionController
