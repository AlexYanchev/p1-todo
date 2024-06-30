export type UserType = {
  _id: string;
  login: string;
  firstName: string;
  lastName: string;
  password: string;
  avatar: string;
  taskList: Array<string>;
};

export type UserLoginType = Pick<UserType, 'login' | 'password'>;
export type UserRegisterType = Pick<
  UserType,
  'login' | 'firstName' | 'lastName' | 'password'
>;
export type UserProfileType = Pick<
  UserType,
  'avatar' | 'firstName' | 'lastName' | 'login' | '_id'
>;
export type UserPublicProfileType = Pick<
  UserType,
  'firstName' | 'lastName' | 'avatar' | 'taskList'
>;
export type UserChangeFirstName = Pick<UserType, '_id' | 'firstName'>;
export type UserChangeLastName = Pick<UserType, '_id' | 'lastName'>;
export type UserChangeAvatar = Pick<UserType, '_id' | 'avatar'>;
