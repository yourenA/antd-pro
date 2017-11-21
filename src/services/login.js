import { stringify } from 'qs';
import request from '../utils/request';


export async function fakeAccountLogin({username,password}) {
  return request(`/login`, {
    method: 'POST',
    data: {
      username,
      password
    },
  });
}

export async function fakeMobileLogin(params) {
  return request(`/logout`, {
    method: 'POST',
  });
}

export async function logout(params) {
  return request(`/logout`, {
    method: 'POST',
  });
}


