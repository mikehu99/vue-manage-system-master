import request from '@/utils/request';
export const saveUpdate = (data:{}) => {
    return request({
        url: '/spiderTag/saveUpdate',
        method: 'post',
        data:data
    });
};

export const getList = (params:{}) => {
    return request({
        url: '/spiderTag/list',
        method: 'get',
        params:params
    });
};

export const deleteByIds = (ids:string) => {
    return request({
        url: '/spiderTag/delete/'+ids,
        method: 'get',
    });
};