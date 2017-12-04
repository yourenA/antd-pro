import { stringify } from 'qs';
import request from '../utils/request';


export async function fakeAccountLogin({username,password,company_id}) {
  return request(`/login`, {
    method: 'POST',
    data: {
      username,
      password,
      company_id
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


