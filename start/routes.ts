import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.post('/login', 'API/AuthController.login')
  Route.post('/register', 'API/AuthController.register')
  Route.post('/logout', 'API/AuthController.logout')

  // Public API for downloading project
  Route.get('/project/:projectId/download/:type', 'API/ProjectsController.download').as(
    'projectDownload'
  )

  // Route forgot password
  Route.post('/password/forget/request', 'API/PasswordResetController.sendResetEmail')
  Route.post('/password/forget/verify', 'API/PasswordResetController.verifyToken')
  Route.post('/password/forget/update', 'API/PasswordResetController.updatePassword')
}).prefix('/api')

Route.group(() => {
  Route.get('/me', 'API/AuthController.me')

  // Profile routes
  Route.post('/profile', 'API/ProfileController.updateProfile')
  Route.post('/profile/account', 'API/ProfileController.updateAccount')
  Route.post('/profile/password', 'API/ProfileController.updatePassword')

  Route.get('/project', 'API/ProjectsController.index')
  Route.post('/project', 'API/ProjectsController.store')

  // Project link generate and download options
  Route.get('/project/:projectId/generate/:type', 'API/ProjectsController.generateSignedUrl').as(
    'generateSignedUrl'
  )
})
  .middleware(['auth'])
  .prefix('/api')
