import request from '@/utils/request';
import { stringify } from 'qs';
export async function queryflies(params) {
    return request(`/api/files?${stringify(params)}`);
  }
