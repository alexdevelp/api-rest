import { Request, Response } from 'express';
import SendForgotPassawordEmailService from '../services/SendForgotPassawordEmailService';

export default class ForgotPasswordController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    const sendForgotPasswordEmail = new SendForgotPassawordEmailService();

    await sendForgotPasswordEmail.execute({
      email,
    });

    return res.status(204).json();
  }
}
