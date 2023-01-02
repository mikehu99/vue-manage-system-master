import request from '@/utils/request';
export const saveUpdate = (data:{}) => {
    return request({
        url: '/spiderLink/saveUpdate',
        method: 'post',
        data:data
    });
};

export const getList = (params:{}) => {
    return request({
        url: '/spiderLink/list',
        method: 'get',
        params:params
    });
};