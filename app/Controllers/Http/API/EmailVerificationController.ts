import { DateTime } from 'luxon'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'
import Mail from '@ioc:Adonis/Addons/Mail'
import Encryption from '@ioc:Adonis/Core/Encryption'
import VerificationToken from 'App/Models/VerificationToken'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { validator, schema, rules } from '@ioc:Adonis/Core/Validator'

export default class EmailVerificationController {
  public async resendEmail({ auth, response }: HttpContextContract) {
    const user = auth.user!
    if (user.emailVerifiedAt) {
      return response.badRequest('Email is already verified')
    }
    const email = user.email
    const verificationToken = await VerificationToken.query().where({ email }).firstOrFail()
    const encryptedEmail = Encryption.encrypt(email)

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
    return 'Email resent successfully'
  }

  public async verifyEmail({ request }: HttpContextContract) {
    const tokenVerificationScheam = schema.create({
      email: schema.string({ trim: true }, [rules.email(), rules.maxLength(128)]),
      token: schema.string({ trim: true }, [rules.maxLength(128), rules.minLength(128)]),
    })
    const input = {
      email: Encryption.decrypt(request.input('email')),
      token: request.input('token'),
    }
    const { token, email } = await validator.validate({
      schema: tokenVerificationScheam,
      data: input,
    })
    const verificationToken = await VerificationToken.query().where({ token, email }).firstOrFail()
    const user = await User.findByOrFail('email', email)
    user.emailVerifiedAt = DateTime.now()
    await user.save()
    await verificationToken.delete()
    return 'Email verified successfully'
  }
}
