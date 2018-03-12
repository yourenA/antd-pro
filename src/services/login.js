import { stringify } from 'qs';
import request from '../utils/request';


export async function fakeAccountLogin(payload) {
  return request(`/login`, {
    method: 'POST',
    data: {
      ...payload
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


