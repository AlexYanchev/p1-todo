export type UserType = {
  id: string;
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
  'avatar' | 'firstName' | 'lastName' | 'login'
>;
export type UserPublicProfileType = Pick<
  UserType,
  'firstName' | 'lastName' | 'avatar' | 'taskList'
>;
export type UserChangeFirstName = Pick<UserType, 'id' | 'firstName'>;
export type UserChangeLastName = Pick<UserType, 'id' | 'lastName'>;
export type UserChangeAvatar = Pick<UserType, 'id' | 'avatar'>;
