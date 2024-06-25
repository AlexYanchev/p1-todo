import { taskSchema } from '../../db/schemas/taskSchema.js';
import { getUser } from '../../utils/index.js';
import { Request, Response } from 'express';

taskSchema.statics.deleteTask = async function (req: Request, res: Response) {
  const user = getUser(req);
  const _id = req.params.id;
  this.findOneAndDelete({ owner: user._id, _id })
    .then((response) => {
      res.status(200).json({ success: true, message: 'Объект удален', _id });
    })
    .catch((err) => {
      res.status(400).json({ error: true, message: 'Ошибка удаления объекта' });
    });
};
