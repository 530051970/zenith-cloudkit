import { apiRequest } from 'tools/apiRequest';
// 获取SourceCoverage
const getSourceCoverage = async () => {
  const result = await apiRequest('get', 'data-source/coverage', '');
  return result;
};

// const refreshDataSource = async (params: any) => {
//   const result = await apiRequest('post', 'data-source/refresh', params);
//   return result;
// };

const getSecrets = async (params: any) => {
  const result = await apiRequest('get', 'data-source/secrets', params);
  return result;
};

const getDataBaseResourcesByAccount = async (params: any) => {
  // const result = await apiRequest('get', 'data-source/secrets', params);
  // return result;
  if(params.page ==1){
  return {
    total: 12,
    page: params.page,
    size: params.size,
    items:[
    {
      sourceID: "mall-customer-db",
      url: "jdbc:mysql//120.23.23.15:9000/custom",
      provider: "AWS",
      accountID: "78962342424",
      region: "cn-northwest-1"
    },
    {
      sourceID: "mall-goods-db",
      url: "jdbc:mysql//120.23.23.15:9000/good",
      provider: "AWS",
      accountID: "78962342424",
      region: "cn-north-1"
    },{
      sourceID: "mall-market-db",
      url: "jdbc:mysql//120.23.23.15:9000/market",
      provider: "AWS",
      accountID: "78962342424",
      region: "cn-north-1"
    },{
      sourceID: "mall-clothes-db",
      url: "jdbc:mysql//120.23.23.15:9000/clothes",
      provider: "AWS",
      accountID: "78962342424",
      region: "cn-northwest-1"
    },{
      sourceID: "mall-activity-db",
      url: "jdbc:mysql//120.23.23.15:9000/activity",
      provider: "AWS",
      accountID: "78962342424",
      region: "cn-north-1"
    },{
      sourceID: "mall-factory-db",
      url: "jdbc:mysql//120.23.23.15:9000/factory",
      provider: "AWS",
      accountID: "78962342424",
      region: "cn-northwest-1"
    },{
      sourceID: "mall-customer-db",
      url: "jdbc:mysql//120.23.23.15:9000/custom",
      provider: "AWS",
      accountID: "78962342424",
      region: "cn-northwest-1"
    },
    {
      sourceID: "mall-goods-db",
      url: "jdbc:mysql//120.23.23.15:9000/good",
      provider: "AWS",
      accountID: "78962342424",
      region: "cn-north-1"
    },{
      sourceID: "mall-market-db",
      url: "jdbc:mysql//120.23.23.15:9000/market",
      provider: "AWS",
      accountID: "78962342424",
      region: "cn-north-1"
    },{
      sourceID: "mall-clothes-db",
      url: "jdbc:mysql//120.23.23.15:9000/clothes",
      provider: "AWS",
      accountID: "78962342424",
      region: "cn-northwest-1"
    }
  ]}} else {
     return { 
      total: 12,
      page: params.page,
      size: params.size,
      items:[
      {
        sourceID: "mall-customer-db",
        url: "jdbc:mysql//120.23.23.15:9000/custom",
        provider: "AWS",
        accountID: "78962342424",
        region: "cn-northwest-1"
      },
      {
        sourceID: "mall-goods-db",
        url: "jdbc:mysql//120.23.23.15:9000/good",
        provider: "AWS",
        accountID: "78962342424",
        region: "cn-north-1"
      }]
     }
  }
};

export {
  getSourceCoverage,
  getSecrets,
  getDataBaseResourcesByAccount
};
