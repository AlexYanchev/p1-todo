import { createHmac, randomBytes } from 'crypto';
import * as dotenv from 'dotenv';
import { Response } from 'express';
import jwt from 'jsonwebtoken';

dotenv.config();

export const cryptographer = {
  encryptionMethod: 'sha256',
  secret: process.env.SECRET_PASSWORD,
  _createHmac: function () {
    if (!this.secret) {
      throw Error('Не указан секрет');
    }
    return createHmac(this.encryptionMethod, this.secret);
  },
  getHashedWithSecret: function (data: string): string {
    const hmac = this._createHmac();
    hmac.update(data);
    return hmac.digest('hex');
  },
  compareDataWithHash: function (data: string, hashedData: string): boolean {
    const hmac = this._createHmac();
    hmac.update(data);
    return hmac.digest('hex') === hashedData;
  },
  createSimpleHash: function () {
    return randomBytes(16).toString('hex');
  },
};

export const tokenizer = {
  secret: process.env.SECRET_TOKENS,
  _getSecret: function () {
    if (!this.secret) {
      throw Error('Не указан секрет');
    }
    return this.secret;
  },
  getTokenAndData: async function <T extends {}>(
    data: T
  ): Promise<T & { token: string }> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        data,
        this._getSecret(),
        { expiresIn: '24h' },
        function (err, token) {
          if (err || !token) {
            return reject('Ошибка получения токена');
          } else {
            return resolve({ ...data, token });
          }
        }
      );
    });
  },
  verifyToken: async function (token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this._getSecret(), function (err: any, decoded: any) {
        if (err || !decoded) {
          return reject('Неправильный токен');
        } else {
          return resolve(decoded);
        }
      });
    });
  },
};

export const resError = (
  res: Response,
  status: number,
  message: string
): void => {
  res.status(status).json({ error: true, message });
};

export const checkerBody = {
  includesKeyAndValueType: function (
    requiredFields: Array<string>,
    checkingObject: Record<string, string>,
    typeValue: 'string'
  ): boolean {
    return Object.keys(checkingObject).every((key) => {
      return (
        requiredFields.includes(key) && typeof checkingObject[key] === typeValue
      );
    });
  },
};
