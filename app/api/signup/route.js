import userModel from "@/app/models/UserModel";
import dbConnect from "@/app/lib/dbConnect";
import bcrypt from "bcrypt";
import sendEmails from "@/app/helpers/sendEmail";

export async function POST(request) {
  await dbConnect();
  try {
    let { username, email, password } = await request.json();

    // Check if the required fields are present
    if (!username || !email || !password) {
      return new Response.json(
        {
          success: false,
          message:
            "Please provide a username, email, and password to register.",
        },
        { status: 400 }
      );
    }

    // Check if a user with the username exists and is not verified
    const existingVerifiedUser = await userModel.findOne({
      username,
      isVerified: false,
    });

    if (existingVerifiedUser) {
      return new Response.json(
        {
          success: false,
          message: "This username is already in use by an unverified account.",
        },
        { status: 400 }
      );
    }

    const existingUserByMail = await userModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiryDate = new Date(Date.now() + 30 * 60 * 1000);

    if (existingUserByMail) {
      if (existingUserByMail.isVerified) {
        return new Response(
          JSON.stringify({
            success: false,
            message:
              "An account with this email already exists and is verified.",
          }),
          { status: 400 }
        );
      } else {
        // Update existing user's password and verification code
        existingUserByMail.password = hashedPassword;
        existingUserByMail.verifyCode = verifyCode;
        existingUserByMail.verifyCodeExpiry = expiryDate;
        await existingUserByMail.save();
      }
    } else {
      // Create a new user
      let newUser = new userModel({
        username,
        email,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        password: hashedPassword,
        isAcceptingMessages: true,
        messages: [],
        isVerified: false,
      });
      await newUser.save();
    }

    const elResponse = await sendEmails({ username, email, verifyCode });
    if (!elResponse.success) {
      return new Response.json(
        {
          success: false,
          message:
            "An error occurred while sending the verification email. Please try again later.",
        },
        { status: 500 }
      );
    }

    // Succ response
    return new Response(
      JSON.stringify({
        success: true,
        message: "A verification email has been sent. Please check your inbox.",
      }),
      { status: 200 }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        success: false,
        message:
          "An error occurred during the registration process. Please try again later.",
      }),
      { status: 500 }
    );
  }
}
