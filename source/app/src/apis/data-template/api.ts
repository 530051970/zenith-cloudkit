import { apiRequest } from 'tools/apiRequest';

// 获取template列表
const getTemplateMappingList = async (params: any) => {
  const result = await apiRequest(
    'post',
    'template/list-template-mappings',
    params
  );
  return result;
};

// 删除template列表
const deleteTemplateMapping = async (params: any) => {
  const result = await apiRequest(
    'delete',
    'template/template-mappings/' + params.id,
    ''
  );
  return result;
};

// 更新template列表
const updateTemplateMapping = async (params: any) => {
  const result = await apiRequest(
    'patch',
    'template/template-mappings/' + params.id,
    params
  );
  return result;
};

// 获取identifiers列表
const getIdentifiersList = async (params: any) => {
  const result = await apiRequest('post', 'template/list-identifiers', params);
  return result;
};

// 创建Identifiers
const createIdentifiers = async (params: any) => {
  const result = await apiRequest('post', 'template/identifiers', params);
  return result;
};

// 创建Identifiers
const updateIdentifiers = async (params: any) => {
  const result = await apiRequest(
    'patch',
    'template/identifiers/' + params.id,
    params
  );
  return result;
};

// 删除Identifiers
const deleteIdentifiers = async (params: any) => {
  const result = await apiRequest(
    'delete',
    'template/identifiers/' + params.id,
    ''
  );
  return result;
};

// 添加identifiers的mapping进template
const addMappingsToTemplate = async (params: any) => {
  const result = await apiRequest('post', 'template/template-mappings', params);
  return result;
};

const getIndentifierInTemplate = async () => {
  const result = await apiRequest(
    'get',
    'template/list-identifiers-by-template/1',
    ''
  );
  return result;
};

const getTemplateUpdateTime = async () => {
  const result = await apiRequest('get', 'template/template-time/1', '');
  return result;
};

export {
  getTemplateMappingList,
  deleteTemplateMapping,
  updateTemplateMapping,
  getIdentifiersList,
  createIdentifiers,
  deleteIdentifiers,
  addMappingsToTemplate,
  updateIdentifiers,
  getIndentifierInTemplate,
  getTemplateUpdateTime,
};
