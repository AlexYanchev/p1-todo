import { Request, Response } from 'express';
import { userSchema } from '../../db/schemas/userSchema.js';
import { checkerBody, resError } from '../../db/utils/index.js';
import { getUser } from '../../utils/index.js';

userSchema.statics.changeUserData = async function (
  req: Request,
  res: Response
) {
  type FieldsForChanges = 'avatar' | 'firstName' | 'lastName';
  type FieldsForChangesBodyDTO = { [field in FieldsForChanges]: string };

  const user = getUser(req);

  if (
    !checkerBody.includesKeyAndValueType(
      ['avatar', 'firstName', 'lastName'],
      req.body.fields,
      'string'
    )
  ) {
    resError(res, 400, 'Некорректный запрос');
    return;
  }

  const fields = req.body.fields as FieldsForChangesBodyDTO;

  this.findOneAndUpdate({ userId: user._id }, fields)
    .then((user) => {
      res.status(200).json({
        success: true,
        message: 'Успешно',
        fields,
      });
    })
    .catch((error) => {
      resError(res, 400, 'Ошибка обновления данных');
    });
};
