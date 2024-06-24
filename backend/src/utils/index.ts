import { NextFunction, Response, Request } from 'express';
import { UserType } from '../db/schemas/userSchema.js';
import { tokenizer } from '../db/utils/index.js';
import { Types } from 'mongoose';
import express from 'express';

export const getUser = (req: Request) => {
  return req.body.userDecoded as UserType;
};

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.path.startsWith('/store')) {
    return next();
  }
  const token = req.headers.authorization || '';

  tokenizer
    .verifyToken(token)
    .then((decoded) => {
      req.body.userDecoded = decoded;
      next();
    })
    .catch((error) => {
      next(error);
    });
};

export const getFormatDataFile = (req: Request) => {
  const imgTypes: { [mime: string]: string } = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
  };
  const contentType = req.headers['content-type'];

  return contentType ? imgTypes[contentType] : undefined;
};

export const getPathToFiles = (userId: Types.ObjectId, type: 'avatars') => {
  switch (type) {
    case 'avatars': {
      return `db/storeFiles/${userId}/avatars/`;
    }
    default: {
      return null;
    }
  }
};
