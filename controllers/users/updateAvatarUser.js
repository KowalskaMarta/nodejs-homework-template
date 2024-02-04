import { User } from '#schemas/users.js'
import path from 'path'
import { rename } from 'node:fs/promises'
import Jimp from 'jimp'

const avatarsDir = path.resolve('public/avatars')

export const updateAvatarUser = async (req, res, next) => {
  const { _id: user } = req.user
  const { path: tempUpload, originalname } = req.file
  try {
    const resultUpload = path.join(avatarsDir, originalname)
    await rename(tempUpload, resultUpload)

     Jimp.read(resultUpload, async (error, avatar) => {
       if (error) throw error
       avatar.resize(250, 250).write(resultUpload)
     })

    const avatarURL = path.join('avatars', originalname)
    await User.findByIdAndUpdate(user, { avatarURL })

    res.status(200).json({
      status: `200 - OK`,
      'Content-Type': 'application/json',
      user_id: user,
      ResponseBody: { avatarURL: avatarURL },
      message: 'Avatar uploaded successfully',
    })
  } catch (error) {
    next(error)
    return res.status(500).json({ message: 'Server error' })
  }
}