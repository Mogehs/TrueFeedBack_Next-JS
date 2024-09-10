import dbConnect from "@/app/lib/dbConnect";
import userModel from "@/app/models/UserModel";

export async function POST(request) {
  await dbConnect();

  let { content, username } = await request.json();

  try {
    let user = await userModel.findOne({ username });
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No User Found",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!user.isAcceptingMessages) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User is not accepting messages anymore",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const newMessage = { content, isCreatedAt: new Date() };
    user.messages.push(newMessage);
    await user.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Message Sent Successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.log("Error in sending message: " + e);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error in sending message",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
