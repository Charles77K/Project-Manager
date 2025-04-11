import Message, { zodMessageSchema } from "../models/message";
import { catchAsync } from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { sendEmail } from "../utils/sendEmail";

export const createMessage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsedMessage = zodMessageSchema.safeParse(req.body);

    if (!parsedMessage.success) {
      const errorMessage = Object.values(
        parsedMessage.error.flatten().fieldErrors
      )
        .flat()
        .join(", ");
      return next(new AppError(`Invalid Input: ${errorMessage}`, 400));
    }
    const newMessage = await Message.create(parsedMessage.data);

    await sendEmail(
      `"${newMessage.email}"`,
      process.env.EMAIL_USER!,
      `New Message from ${newMessage.name}`,
      `You received a message from:\n\nName: ${newMessage.name}\nEmail: ${newMessage.email}\n\nMessage:\n${newMessage.message}`
    );

    res.status(201).json({
      message: "Message sent successfully",
      status: "success",
      newMessage,
    });
  }
);

export const getAllMessages = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const messages = await Message.find();

    res.status(200).json({
      message: "Messages fetched successfully",
      status: "success",
      messages,
    });
  }
);
