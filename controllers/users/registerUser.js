import { User, registerSchema } from "#schemas/users.js";

import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import { nanoid } from 'nanoid'
import { sendEmail } from '#utils/nodemailer.js'

export async function registerUser(req, res, next) {
  const { email, password } = req.body;

  const validationResult = registerSchema.validate(req.body);

  if (validationResult.error) {
    res.status(400).json({
      message: `missing field`,
      error: validationResult.error,
    });
    return;
  }

  const user = await User.findOne({ email });

  // Registration conflict error
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email is already in use",
      data: "Conflict",
    });
  }

  try {
    const hashPasswd = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);

    const verificationToken = nanoid();

    const isEmailSend = await sendEmail({ email, verificationToken });

    if (!isEmailSend) {
      return res.status(500).json({
        status: "error",
        code: 500,
        message: "Server error",
      });
    }

    const result = await User.create({
      email,
      password: hashPasswd,
      avatarURL,
      verify: false,
      verificationToken,
    });

    res.status(201).json({
      status: "success",
      code: 201,
      ResponseBody: {
        user: {
          email: result.email,
          subscription: result.subscription,
          avatarURL: result.avatarURL,
        },
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}
