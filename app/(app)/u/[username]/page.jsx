"use client";
import messageSchema from "@/app/schemas/messageSchema";
import { useParams } from "next/navigation";
import { useCompletion } from "ai/react";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { CardContent, CardHeader, Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
const specialChar = "||";
const parseStringMessages = (messagesString) => {
  if (!messagesString) return [];
  return messagesString.split(specialChar).filter(Boolean);
};

const initialMesssageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

const SendMessages = () => {
  const params = useParams();
  const username = params.username;

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: "/api/suggestMessage",
    initialCompletion: initialMesssageString,
  });

  const form = useForm({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  let handleMessageClick = (message) => {
    form.setValue("content", message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      let response = await axios.post("/api/sendMessage", {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (e) {
      console.log("Error in on submit:", e);
      toast({
        title: e.response?.data?.message || "Something went wrong!",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const fetchSuggestedMessages = async () => {
    try {
      complete("");
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Send Me A Message Anonymously
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Separator />

          {isSuggestLoading ? (
            <Button onClick={fetchSuggestedMessages} className="my-4" disabled>
              Generating Messages
            </Button>
          ) : (
            <Button onClick={fetchSuggestedMessages} className="my-4">
              Get &nbsp; <b> AI </b> &nbsp; Messages
            </Button>
          )}
          <Separator />
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 h-52">
            {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={"/sign-up"}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
};

export default SendMessages;
