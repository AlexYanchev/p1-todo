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
      throw new Error('Не указан секрет');
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
      throw new Error('Не указан секрет');
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
            return reject(new Error('Ошибка получения токена'));
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

export const checkerBody = {
  includesKeyAndValueType: function (
    requiredFields: Array<string>,
    checkingObject: Record<string, string>,
    typeValue: 'string'
  ): boolean {
    console.log('От Чекера. Проверяю body.', checkingObject);
    if (typeof checkingObject !== 'object') {
      console.log('От Чекера. Body не является объектом.', false);
      return false;
    }
    const result =
      Object.keys(checkingObject).length &&
      Object.keys(checkingObject).every((key) => {
        return (
          requiredFields.includes(key) &&
          typeof checkingObject[key] === typeValue
        );
      });

    console.log('От Чекера. Результат общей проверки: ', Boolean(result));

    return Boolean(result);
  },
};

export const checkerParams = (
  paramsObject: Record<string, string | Array<string>>
): boolean => {
  console.log('Работает Чекер Параметров. Поступил объект: ', paramsObject);
  const result = Object.keys(paramsObject).every((parametr) => {
    console.log(
      'Работает Чекер Параметров. Смотрим параметр: ',
      parametr,
      ' Значение: ',
      paramsObject[parametr],
      ' Тип значения: ',
      typeof paramsObject[parametr]
    );
    if (!paramsObject[parametr]) {
      console.log(`Параметра ${parametr} нет, смотрим дальше`);
      return true;
    }

    if (typeof paramsObject[parametr] === 'string') {
      return parametr === paramsObject[parametr];
    } else if (Array.isArray(paramsObject[parametr])) {
      return paramsObject[parametr].includes(parametr);
    } else {
      return false;
    }
  });
  console.log('Работает Чекер Параметров. Результат проверки: ', result);
  return result;
};
