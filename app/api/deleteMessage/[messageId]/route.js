import dbConnect from "@/app/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import userModel from "@/app/models/UserModel";

export async function DELETE(request, { params }) {
  await dbConnect();

  let messageId = params.messageId;
  let session = await getServerSession(authOptions);
  let user = session?.user;

  if (!user || !session.user) {
    return Response.json(
      {
        success: false,
        message: "No Authenticated User",
      },
      { status: 500 }
    );
  }
  if (!user || !session.user) {
    return Response.json(
      {
        success: false,
        message: "No Authenticated User",
      },
      { status: 401 }
    );
  }
  try {
    const updatedResult = await userModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updatedResult.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "No message this is and may be already deleted",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: false,
        message: "Successfully deleted the message ",
      },
      { status: 200 }
    );
  } catch (e) {
    console.log("Error in founding Message " + e);
    return Response(
      JSON.stringify(
        {
          success: false,
          message: "Error in deleting",
        },
        { status: 400 }
      )
    );
  }
}
