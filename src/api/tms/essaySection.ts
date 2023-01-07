import request from '@/utils/request';
export const saveUpdate = (data:{}) => {
    return request({
        url: '/essaySection/saveUpdate',
        method: 'post',
        data:data
    });
};

export const getList = (params:{}) => {
    return request({
        url: '/essaySection/list',
        method: 'get',
        params:params
    });
};

export const spiderByUrl = (ids:String) => {
    const params = {
        ids
    }
    return request({
        url: '/essay/spiderByUrl',
        method: 'get',
        params:params
    });
};