export type UserType = {
  _id: string;
  login: string;
  firstName: string;
  lastName: string;
  password: string;
  avatar: string;
  taskList: Array<string>;
  friends: Array<string>;
};

export type UserLoginType = Pick<UserType, 'login' | 'password'>;
export type UserRegisterType = Pick<
  UserType,
  'login' | 'firstName' | 'lastName' | 'password'
>;
export type UserProfileType = Pick<
  UserType,
  'avatar' | 'firstName' | 'lastName' | 'login' | '_id' | 'friends'
>;
export type UserPublicProfileType = Pick<
  UserType,
  '_id' | 'firstName' | 'lastName' | 'avatar' | 'taskList' | 'friends'
>;
export type UserChangeFirstName = Pick<UserType, '_id' | 'firstName'>;
export type UserChangeLastName = Pick<UserType, '_id' | 'lastName'>;
export type UserChangeAvatar = Pick<UserType, '_id' | 'avatar'>;
