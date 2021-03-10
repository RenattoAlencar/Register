import { NextFunction, Request, Response } from 'express'
import { decode } from 'jsonwebtoken'
import { getCustomRepository } from 'typeorm'
import User from '../models/User'
import UsersRepository from '../repositories/UserRepository'

async function decoder(request: Request): Promise<User | undefined> {
  const authHeader = request.headers.authorization || ''
  const userRepository = getCustomRepository(UsersRepository)

  const [, token] = authHeader?.split(' ')

  const payload = decode(token)

  const user = await userRepository.findOne(payload?.sub, {
    relations: ['roles']
  })

  return user
}

function is(role: String[]) {
  const roleAuthorized = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const user = await decoder(request)

    const userRoles = user?.roles.map((role) => role.name)

    const existsRoles = userRoles?.some((roleUser) => role.includes(roleUser))

    if (existsRoles) {
      return next()
    }
    return response.status(401).json({ message: 'Not authorized!' })
  }
  return roleAuthorized
}

export default is
