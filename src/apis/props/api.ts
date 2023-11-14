import { apiRequest } from 'tools/apiRequest';

// search all props by props type
const requestPropsByType = async (params: { type: string }) => {
  const result: any = await apiRequest(
    'get',
    `template/list-props-by-type/${params.type}`,
    params
  );
  return result;
};

// 创建 Props
const requestCreateProps = async (params: {
  prop_name: string;
  prop_type: string;
}) => {
  const result: any = await apiRequest('post', `template/props`, params);
  return result;
};

// 删除 Props
const requestDeleteProps = async (params: { id: string }) => {
  const result: any = await apiRequest(
    'delete',
    `/template/props/${params.id}`,
    params
  );
  return result;
};

// 修改 Props
const requestUpdateProps = async (params: {
  id: string;
  prop_name: string;
  prop_type: string;
}) => {
  const result: any = await apiRequest(
    'patch',
    `template/props/${params.id}`,
    params
  );
  return result;
};

export {
  requestPropsByType,
  requestCreateProps,
  requestDeleteProps,
  requestUpdateProps,
};
