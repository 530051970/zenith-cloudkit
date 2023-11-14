import { apiRequest } from 'tools/apiRequest';

/**
 * 获取筛选项信息
 * @param params
 * @returns
 */
const getPropertyValues = async (
  params: string | { table: string; column: string }
) => {
  const result = await apiRequest(
    'get',
    '/query/property_values',
    params as any
  );
  return result;
};

/**
 * 通用查询
 * @param params
 * @returns
 */
const sendQuery = async (params: Record<string, any> | undefined) => {
  const result = await apiRequest('post', '/query/', params);
  return result;
};

export { getPropertyValues, sendQuery };
