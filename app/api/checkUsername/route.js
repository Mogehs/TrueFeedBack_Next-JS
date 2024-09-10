import dbConnect from "@/app/lib/dbConnect";
import userModel from "@/app/models/UserModel";
import * as z from "zod";
import { usernameValidation } from "@/app/schemas/signupSchema";
import { NextResponse } from "next/server";

// Define the validation schema
const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };

    // Use safeParse to validate the query parameters
    const result = UsernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      // Extract validation errors if any
      const usernameErrors = result.error.errors.map((err) => err.message);
      return NextResponse.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    // Check if username exists in the database
    const existingVerifiedUser = await userModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
