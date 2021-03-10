import { Router } from 'express'

import UserController from './controllers/UserController'
import SessionController from './controllers/SessionController'
import PermissionController from './controllers/PermissionController'
import RoleController from './controllers/RoleController'
import ProductController from './controllers/ProductController'
import is from './middlewares/permission'

const router = Router()

const userController = new UserController()
const sessionController = new SessionController()
const permissionController = new PermissionController()
const roleController = new RoleController()
const productController = new ProductController()

router.post('/users', userController.create)
router.post('/sessions', sessionController.create)

router.post('/permissions', permissionController.create)

router.post('/roles', roleController.create)
router.get('/roles', roleController.index)

router.post('/product', productController.create)
router.get('/product', is(['DEVELOPMENT_SYSTEM']), productController.index)
router.get('/product/:id', productController.show)

export default router
