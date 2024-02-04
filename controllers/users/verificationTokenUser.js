import { User } from '#schemas/users.js'

export const verificationTokenUser = async (req, res, next) => {
  try {
    const { verificationToken } = req.params
    const user = await User.findOne({ verificationToken })

    if (!user) {
      return res.status(404).json({
        status: '404 - Not Found',
        'Content-Type': 'application/json',
        ResponseBody: {
          message: 'User not found',
        },
      })
    }

    const result = await User.findOneAndUpdate(
      { verificationToken },
      { verify: true, verificationToken: null },
      { new: true }
    )

    return res.status(200).json({
      status: '200 - OK',
      'Content-Type': 'application/json',
      ResponseBody: {
        message: 'Verification successful',
        verify: result.verify,
        verificationToken: result.verificationToken,
      },
    })
  } catch (error) {
    next(error)
  }
}