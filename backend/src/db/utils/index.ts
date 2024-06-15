import { createHmac } from 'crypto';
import * as dotenv from 'dotenv';
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
};

export const tokenizer = {
  secret: process.env.SECRET_TOKENS,
  _getSecret: function () {
    if (!this.secret) {
      throw Error('Не указан секрет');
    }
    return this.secret;
  },
  getTokenAndData: async function (
    data: any
  ): Promise<{ data: any; token: string }> {
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
      jwt.verify(token, this._getSecret(), function (err, decoded) {
        if (err || !decoded) {
          reject('Неправильный токен');
        } else {
          resolve(decoded);
        }
      });
    });
  },
};
