import request from '@/utils/request';
export const saveUpdate = (data:{}) => {
    return request({
        url: '/mapping/saveUpdate',
        method: 'post',
        data:data
    });
};

export const getList = (params:{}) => {
    return request({
        url: '/mapping/list',
        method: 'get',
        params:params
    });
};