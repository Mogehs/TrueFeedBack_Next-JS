import dbConnect from "@/app/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/option";
import userModel from "@/app/models/UserModel";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

export async function GET(request) {
  await dbConnect();
  let session = await getServerSession(authOptions);
  let user = session?.user;

  if (!user) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "No Authenticated User",
      }),
      { status: 500 }
    );
  }

  try {
    let userId = new mongoose.Types.ObjectId(user._id);
    const userMessages = await userModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!userMessages || userMessages.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No messages found",
        }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        messages: userMessages[0].messages,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error fetching messages",
      }),
      { status: 500 }
    );
  }
}
