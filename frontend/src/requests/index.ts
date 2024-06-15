import { FETCH_SITE_URL } from '../options';

type MethodsFetchType = 'POST' | 'GET' | 'PATCH' | 'HEAD' | 'DELETE' | 'PUT';

export const customFetch = async (
  to: string,
  method: MethodsFetchType,
  data: unknown,
  headers: {
    [k: string]: string;
  }
) => {
  return fetch(`${FETCH_SITE_URL}${to}`, {
    method,
    headers,
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err) => {});
};
