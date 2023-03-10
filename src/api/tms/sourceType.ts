import request from '@/utils/request';
export const saveUpdate = (sourceType:{}) => {
    return request({
        url: '/sourceType/saveUpdate',
        method: 'post',
        data:sourceType
    });
};

export const getList = (params:{}) => {
    return request({
        url: '/sourceType/list',
        method: 'get',
        params:params
    });
};