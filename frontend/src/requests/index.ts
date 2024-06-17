import { ThunkDispatch } from '@reduxjs/toolkit';
import { UnknownAction } from 'redux';
import { FETCH_SITE_URL } from '../options';
import { RootState } from '../redux/store';
import { logout } from '../redux/slices/userSlice';

type MethodsFetchType = 'POST' | 'GET' | 'PATCH' | 'HEAD' | 'DELETE' | 'PUT';
type HeadersType = {
  'Content-Type': 'application/json;charset=utf-8';
  Authorization: string;
};

type CustomFetchParamsType = {
  to: string;
  method: MethodsFetchType;
  headers: Partial<HeadersType>;
  data?: unknown;
  dispatch?: ThunkDispatch<RootState, undefined, UnknownAction>;
};

export async function customFetch({
  to,
  method,
  headers,
  data,
  dispatch,
}: CustomFetchParamsType) {
  return fetch(`${FETCH_SITE_URL}${to}`, {
    method,
    headers,
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      if (dispatch && res.invalidToken) {
        dispatch(logout());
        throw new Error(res.message);
      } else if (res.error) {
        throw new Error(res.message);
      } else {
        return res;
      }
    });
}
