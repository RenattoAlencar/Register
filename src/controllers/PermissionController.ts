import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import PermissionRepository from '../repositories/PermissionRepository'

class PermissionController {
  async create(request: Request, response: Response) {
    const permissionsRepository = getCustomRepository(PermissionRepository)

    const { name, description } = request.body

    const existPermission = await permissionsRepository.findOne({ name })

    if (existPermission) {
      return response.status(400).json({ message: 'Permission already exists' })
    }

    const permission = permissionsRepository.create({
      name,
      description

    })

    await permissionsRepository.save(permission)
    return response.status(201).json(permission)
  }
}
export default PermissionController
