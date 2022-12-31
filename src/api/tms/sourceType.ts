import request from '@/utils/request';
export const sourceTypeSaveEdit = (sourceType:{}) => {
    return request({
        url: '/sourceType/saveEdit',
        method: 'post',
        data:sourceType
    });
};

export const sourceTypeList = (params:{}) => {
    return request({
        url: '/sourceType/list',
        method: 'get',
        params:params
    });
};