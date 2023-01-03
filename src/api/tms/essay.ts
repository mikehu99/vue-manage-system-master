import request from '@/utils/request';
export const saveUpdate = (data:{}) => {
    return request({
        url: '/essay/saveUpdate',
        method: 'post',
        data:data
    });
};

export const getList = (params:{}) => {
    return request({
        url: '/essay/list',
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