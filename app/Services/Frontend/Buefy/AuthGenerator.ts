import mkdirp from 'mkdirp'
import Env from '@ioc:Adonis/Core/Env'
import View from '@ioc:Adonis/Core/View'
import { HostingPorts } from 'App/Interfaces/Enums'
import HelperService from 'App/Services/HelperService'
import ProjectInput from 'App/Interfaces/ProjectInput'

export default class AuthGenerator {
  private input: ProjectInput

  constructor(input: ProjectInput) {
    this.input = input
  }

  /**
   * Copies login and register vue
   * Changes maxlength and adds other fields if required
   */
  protected async copyPages() {
    await mkdirp(`${this.input.spaPath}/src/views/setting`)
    await Promise.all([this.copyLoginView(), this.copyRegisterView(), this.copyDashboardView()])
    if (this.input.auth.passwordReset) {
      await Promise.all([this.copyForgotPasswordRequestView(), this.copyForgotPasswordUpdateView()])
    }
    await this.copyEmailVerificationPendingView()
    await this.copyUpdateEmailView()
    await this.copyVerifyEmailView()
    await this.copySettingView()
    await this.copySettingProfileView()
    await this.copySettingAccountView()
    await this.copySettingSecurityView()
    await this.copyRbacMatrixView()
  }

  protected async copyRegisterView() {
    if (this.input.auth.register) {
      const path = `${this.input.spaPath}/src/views/Register.vue`
      const exists = await HelperService.fileExists(path)
      if (!exists) {
        const table = this.input.auth.table
        const email = table.columns.find((c) => c.name === 'Email')
        const password = table.columns.find((c) => c.name === 'Password')
        const content = await View.render(
          `stubs/frontend/${this.input.tech.frontend}/full/src/views/registerVue`,
          {
            input: this.input,
            email,
            password,
          }
        )
        await HelperService.writeFile(path, content)
      }
    }
  }

  protected async copyLoginView() {
    const path = `${this.input.spaPath}/src/views/Login.vue`
    const exists = await HelperService.fileExists(path)
    if (!exists) {
      const table = this.input.auth.table
      const email = table.columns.find((c) => c.name === 'Email')
      const password = table.columns.find((c) => c.name === 'Password')
      const content = await View.render(
        `stubs/frontend/${this.input.tech.frontend}/full/src/views/loginVue`,
        {
          input: this.input,
          email,
          password,
        }
      )
      await HelperService.writeFile(path, content)
    }
  }

  protected async copyDashboardView() {
    const path = `${this.input.spaPath}/src/views/Dashboard.vue`
    const exists = await HelperService.fileExists(path)
    if (!exists) {
      const content = await View.render(
        `stubs/frontend/${this.input.tech.frontend}/full/src/views/dashboardVue`
      )
      await HelperService.writeFile(path, content)
    }
  }

  protected async copyForgotPasswordRequestView() {
    const path = `${this.input.spaPath}/src/views/ForgotPasswordRequest.vue`
    const exists = await HelperService.fileExists(path)
    if (!exists) {
      const email = this.input.auth.table.columns.find((c) => c.name === 'Email')
      const content = await View.render(
        `stubs/frontend/${this.input.tech.frontend}/full/src/views/ForgotPasswordRequestVue`,
        {
          email,
        }
      )
      await HelperService.writeFile(path, content)
    }
  }

  protected async copyForgotPasswordUpdateView() {
    const path = `${this.input.spaPath}/src/views/ForgotPasswordUpdate.vue`
    const exists = await HelperService.fileExists(path)
    if (!exists) {
      const content = await View.render(
        `stubs/frontend/${this.input.tech.frontend}/full/src/views/ForgotPasswordUpdateVue`
      )
      await HelperService.writeFile(path, content)
    }
  }

  protected async copyEmailVerificationPendingView() {
    const path = `${this.input.spaPath}/src/views/EmailVerificationPending.vue`
    const exists = await HelperService.fileExists(path)
    if (!exists) {
      const content = await View.render(
        `stubs/frontend/${this.input.tech.frontend}/full/src/views/emailVerificationPendingVue`
      )
      await HelperService.writeFile(path, content)
    }
  }

  protected async copySettingView() {
    const path = `${this.input.spaPath}/src/views/Setting.vue`
    const exists = await HelperService.fileExists(path)
    if (!exists) {
      const content = await View.render(
        `stubs/frontend/${this.input.tech.frontend}/full/src/views/SettingVue`,
        {
          input: this.input,
        }
      )
      await HelperService.writeFile(path, content)
    }
  }

  protected async copyRbacMatrixView() {
    if (this.input.rbac.enabled) {
      const path = `${this.input.spaPath}/src/views/RbacMatrix.vue`
      const exists = await HelperService.fileExists(path)
      if (!exists) {
        const content = await View.render(
          `stubs/frontend/${this.input.tech.frontend}/full/src/views/rbacMatrixVue`,
          {
            input: this.input,
          }
        )
        await HelperService.writeFile(path, content)
      }
    }
  }

  protected async copyVerifyEmailView() {
    const path = `${this.input.spaPath}/src/views/VerifyEmail.vue`
    const exists = await HelperService.fileExists(path)
    if (!exists) {
      const content = await View.render(
        `stubs/frontend/${this.input.tech.frontend}/full/src/views/VerifyEmailVue`
      )
      await HelperService.writeFile(path, content)
    }
  }

  protected async copyUpdateEmailView() {
    const path = `${this.input.spaPath}/src/views/UpdateEmail.vue`
    const exists = await HelperService.fileExists(path)
    if (!exists) {
      const content = await View.render(
        `stubs/frontend/${this.input.tech.frontend}/full/src/views/updateEmailVue`
      )
      await HelperService.writeFile(path, content)
    }
  }

  protected async copySettingAccountView() {
    const table = this.input.auth.table
    const email = table.columns.find((c) => c.name === 'Email')
    const path = `${this.input.spaPath}/src/views/setting/Account.vue`
    const exists = await HelperService.fileExists(path)
    if (!exists) {
      const content = await View.render(
        `stubs/frontend/${this.input.tech.frontend}/full/src/views/setting/AccountVue`,
        {
          email,
          input: this.input,
        }
      )
      await HelperService.writeFile(path, content)
    }
  }

  protected async copySettingProfileView() {
    const table = this.input.auth.table
    const path = `${this.input.spaPath}/src/views/setting/Profile.vue`
    const exists = await HelperService.fileExists(path)
    if (!exists) {
      const content = await View.render(
        `stubs/frontend/${this.input.tech.frontend}/full/src/views/setting/ProfileVue`,
        {
          table,
          input: this.input,
        }
      )
      await HelperService.writeFile(path, content)
    }
  }

  protected async copySettingSecurityView() {
    const table = this.input.auth.table
    const path = `${this.input.spaPath}/src/views/setting/Security.vue`
    const password = table.columns.find((c) => c.name === 'Password')
    const exists = await HelperService.fileExists(path)
    if (!exists) {
      const content = await View.render(
        `stubs/frontend/${this.input.tech.frontend}/full/src/views/setting/SecurityVue`,
        {
          password,
          input: this.input,
        }
      )
      await HelperService.writeFile(path, content)
    }
  }

  /**
   * Copies .env and .env.example files
   */
  protected async copyEnv() {
    const envApiUrlLine = `VUE_APP_API_URL=http://localhost:3333`
    let envApiUrlLineLocal = `VUE_APP_API_URL=http://localhost:3333`
    if (Env.get('HOSTING_ENABLED')) {
      envApiUrlLineLocal = `VUE_APP_API_URL=https://${Env.get('HOSTING_API_DOMAIN')}:${
        HostingPorts.nginxApi + this.input.id
      }`
    }

    const localEnvPath = `${this.input.spaPath}/.env.local`
    const localEnvExists = await HelperService.fileExists(localEnvPath)
    if (!localEnvExists) {
      await HelperService.writeFile(localEnvPath, envApiUrlLineLocal)
    }

    const exampleEnvPath = `${this.input.spaPath}/.env.example`
    const exampleEnvExists = await HelperService.fileExists(exampleEnvPath)
    if (!exampleEnvExists) {
      await HelperService.writeFile(exampleEnvPath, envApiUrlLine)
    }
  }

  /**
   * Copies state file
   */
  protected async copyState() {
    await mkdirp(`${this.input.spaPath}/src/store/modules`)
    const path = `${this.input.spaPath}/src/store/modules/auth.state.js`
    const exists = await HelperService.fileExists(path)
    if (!exists) {
      const content = await View.render(
        `stubs/frontend/${this.input.tech.frontend}/full/src/store/modules/authStateJs`,
        {
          input: this.input,
        }
      )
      await HelperService.writeFile(path, content)
    }
  }

  /**
   * Imports auth state
   */
  protected async importState() {
    const path = `${this.input.spaPath}/src/store/index.js`
    let content = await HelperService.readFile(path)

    // If import auth statement is not in file then it is not registered
    if (content.indexOf('import auth') === -1) {
      const importVuexLine = 'import Vuex from "vuex";'
      const importAuthStateLine = 'import auth from "./modules/auth.state";'
      const index = content.indexOf(importVuexLine) + importVuexLine.length + 1
      content = await HelperService.insertLines(content, index, importAuthStateLine)
      await HelperService.writeFile(path, content)
    }
  }

  /**
   * Registers auth state
   */
  protected async registerState() {
    const path = `${this.input.spaPath}/src/store/index.js`
    let content = await HelperService.readFile(path)

    // If import auth statement is not in file then it is not registered
    if (content.indexOf('auth,') === -1) {
      const moduleLine = 'modules: {},'
      await HelperService.writeFile(path, content.replace(moduleLine, 'modules: { auth,},'))
    }
  }

  protected async copyAsset() {
    const path = `${this.input.spaPath}/src/assets/welcome.svg`
    await HelperService.copyFile(
      `resources/views/stubs/frontend/${this.input.tech.frontend}/full/src/assets/welcomeSvg.edge`,
      path
    )
  }

  /**
   * Steps
   * 1. Copy Pages
   * 2. Add & Register AuthState
   * 3. Add Auth Routes
   */
  protected async start() {
    await this.copyState()
    await this.importState()
    await this.registerState()
    await this.copyPages()
    await this.copyAsset()
    await this.copyEnv()
    await HelperService.execute('npm', ['run', 'lint'], {
      cwd: this.input.spaPath,
    })
    await HelperService.commit('Auth Added', this.input.spaPath)
  }

  public async init() {
    await this.start()
  }
}
