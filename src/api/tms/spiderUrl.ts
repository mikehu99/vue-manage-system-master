import request from '@/utils/request';
export const saveUpdate = (data:{}) => {
    return request({
        url: '/spiderUrl/saveUpdate',
        method: 'post',
        data:data
    });
};

export const getList = (params:{}) => {
    return request({
        url: '/spiderUrl/list',
        method: 'get',
        params:params
    });
};