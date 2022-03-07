import { DateTime } from 'luxon'
import Env from '@ioc:Adonis/Core/Env'
import Project from 'App/Models/Project'
import Hash from '@ioc:Adonis/Core/Hash'
import Mail from '@ioc:Adonis/Addons/Mail'
import Encryption from '@ioc:Adonis/Core/Encryption'
import StripeService from 'App/Services/StripeService'
import { StripeCustomer } from 'App/Interfaces/ProjectInput'
import VerificationToken, { Reason } from 'App/Models/VerificationToken'
import { attachment, AttachmentContract } from '@ioc:Adonis/Addons/AttachmentLite'
import { column, beforeSave, BaseModel, hasMany, HasMany, afterCreate } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @attachment({
    preComputeUrl: true,
    folder: 'avatars',
    disk: 'local',
  })
  public avatar?: AttachmentContract | null

  @column({
    serializeAs: null,
  })
  public rememberMeToken?: string | null

  @column.dateTime()
  public emailVerifiedAt?: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column({
    prepare: (v) => JSON.stringify(v),
    consume: (v) => JSON.parse(v),
    serializeAs: null,
  })
  public stripe: StripeCustomer

  @hasMany(() => Project)
  public projects: HasMany<typeof Project>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  public static async sendEmailVerificationMail(user: User) {
    const encryptedEmail = Encryption.encrypt(user.email)
    const verificationToken = await VerificationToken.firstOrCreate(
      {
        email: user.email,
      },
      {
        email: user.email,
        token: VerificationToken.generateToken(),
        reason: Reason.emailUpdate,
      }
    )
    await Mail.sendLater((message) => {
      message
        .to(verificationToken.email)
        .from(Env.get('MAIL_FROM_ADDRESS'))
        .subject('Verify your email')
        .htmlView('emails/emailVerification', {
          user,
          url: `${Env.get('UI_URL')}/email/verify?token=${
            verificationToken.token
          }&email=${encryptedEmail}`,
        })
    })
  }

  @afterCreate()
  public static async sendRegistrationEmail(user: User) {
    return User.sendEmailVerificationMail(user)
  }

  public async getOrCreateStripeId() {
    if (this.stripe && this.stripe.id) {
      return this.stripe.id
    }

    const customer = await StripeService.createCustomer(this)
    this.stripe = {
      id: customer.id,
    }

    await this.save()
    return this.stripe.id
  }
}
