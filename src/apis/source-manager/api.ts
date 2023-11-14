import { apiRequest } from 'tools/apiRequest';

// 获取Source list
const getSourceList = async (params: any) => {
  // const result = await apiRequest('post', 'data-source/list-account', params);
  // return result;
  if(params.page ==1){
    return {
      page: params.page,
      size: params.size,
      total: 11,
      items: [{
        sourceID: "mall-goods-db",
        engine_type: "MYSQL",
        provider: "AWS",
        accountID: "78962342424",
        region: "cn-north-1"
      },{
        sourceID: "mall-goods-db",
        engine_type: "MYSQL",
        provider: "AWS",
        accountID: "78962342424",
        region: "cn-north-1"
      },{
        sourceID: "mobile-custom-db",
        engine_type: "MYSQL",
        provider: "GOOGLE CLOUD",
        accountID: "78962342424",
        region: "cn-north-1"
      },{
        sourceID: "mall-goods-db",
        engine_type: "MYSQL",
        provider: "ALIYUN",
        accountID: "78962342424",
        region: "ap-east-1"
      },{
        sourceID: "mall-goods-db",
        engine_type: "POSTGRESQL",
        provider: "INDIVIDUAL",
        accountID: "78962342424",
        region: "cn-north-1"
      },{
        sourceID: "motor-factory",
        engine_type: "ORACEL",
        provider: "AWS",
        accountID: "78962342424",
        region: "cn-north-1"
      },{
        sourceID: "mall-goods-db",
        engine_type: "MYSQL",
        provider: "ALIYUN",
        accountID: "78962342424",
        region: "cn-northwest-1"
      },{
        sourceID: "clothes-market",
        engine_type: "ORACLE",
        provider: "AWS",
        accountID: "78962342424",
        region: "cn-north-1"
      },{
        sourceID: "mall-goods-db",
        engine_type: "MYSQL",
        provider: "AWS",
        accountID: "78962342424",
        region: "cn-north-1"
      },{
        sourceID: "mall-goods-db",
        engine_type: "MYSQL",
        provider: "INDIVIDUAL",
        accountID: "78962342424",
        region: "cn-north-1"
      }]

    }
  } else {
    return {
      page: params.page,
      size: params.size,
      total: 11,
      items: [{
        sourceID: "mall-goods-db",
        engine_type: "MYSQL",
        provider: "AWS",
        accountID: "78962342424",
        region: "cn-north-1"
      }]

    }
  }
};



// 删除Source
const deleteSource = async (params: any) => {
  const result = await apiRequest('post', 'data-source/delete_account', params);
  return result;
};

export { getSourceList, deleteSource };
