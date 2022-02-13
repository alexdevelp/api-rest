import { Request, Response } from 'express';
import UploadUserService from '../services/UploadUserAvatarService';

export default class UsersAvatarController {
  public async update(req: Request, res: Response): Promise<Response> {
    const uploadAvatar = new UploadUserService();

    const user = uploadAvatar.execute({
      userId: req.user.id,
      avatarFileName: req.file.filename,
    });

    return res.json(user);
  }
}
