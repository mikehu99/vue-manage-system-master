import request from '@/utils/request';
export const saveUpdate = (source:{}) => {
    return request({
        url: '/source/saveUpdate',
        method: 'post',
        data:source
    });
};

export const getList = (params:{}) => {
    return request({
        url: '/source/list',
        method: 'get',
        params:params
    });
};