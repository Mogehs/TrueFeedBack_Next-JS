import dbConnect from "@/app/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/option";
import { getServerSession } from "next-auth";
import userModel from "@/app/models/UserModel";

export async function POST(request) {
  await dbConnect();
  let session = await getServerSession(authOptions);
  let user = session?.user;
  if (!user || !session.user) {
    return Response.json({
      success: false,
      message: "Not Authenticated user",
    });
  }

  let userId = user._id;
  let body = await request.json();

  let { acceptMessages } = body;

  try {
    let foundUser = await userModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessages: acceptMessages,
      },
      { new: true }
    );

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "No user Found",
        },
        { status: 401 }
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: "Accept Message Updated successfully",
      }),
      { status: 200 }
    );
  } catch (e) {
    console.log("Error in getting accept message details" + e);
    return Response.json(
      {
        success: false,
        message: "Message accept delay",
      },
      { status: 401 }
    );
  }
}
export async function GET(request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const foundUser = await userModel.findById(user._id);

    if (!foundUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving message acceptance status:", error);
    return Response.json(
      { success: false, message: "Error retrieving message acceptance status" },
      { status: 500 }
    );
  }
}
