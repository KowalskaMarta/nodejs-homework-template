import {
    User,
    userEmailResendVerificationSchema,
  } from '#schemas/users.js'
  import { sendEmail } from '#utils/nodemailer.js'
  
  export const resendVerificationTokenUser = async (req, res, next) => {
    try {
      const { email } = req.body
  
      const validationResult = userEmailResendVerificationSchema.validate(
        req.body
      )
      if (validationResult.error) {
        return res.status(400).json({
          POST: `/users/verify`,
          status: `400 - Bad Request`,
          'Content-Type': 'application/json',
          RequestBody: {
            message: 'missing required field email',
          },
          ResponseBody: validationResult.error,
        })
      }
  
      const user = await User.findOne({ email })
  
      if (!user) {
        return res.status(404).json({
          status: '404 - Not found',
          'Content-Type': 'application/json',
          ResponseBody: { message: `User not found.` },
        })
      }
  
      const { verify, verificationToken } = user
  
      if (verify === true) {
        return res.status(400).json({
          status: '400 - Bad Request',
          'Content-Type': 'application/json',
          ResponseBody: { message: `Verification has already been passed.` },
        })
      }
  
      const isEmailSend = await sendEmail({ email, verificationToken })
  
      if (!isEmailSend) {
        return res.status(500).json({
          status: 'error',
          code: 500,
          message: 'Server error',
        })
      }
  
      res.status(200).json({
        status: '200 - OK',
        'Content-Type': 'application/json',
        ResponseBody: { message: 'Verification email sent.' },
      })
    } catch (error) {
      next(error)
    }
  }