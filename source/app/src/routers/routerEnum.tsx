interface RouterEnumType {
  path: string;
}

export const RouterEnum: Record<string, RouterEnumType> = {
  Login: { path: '/login'},
  Home: { path: '/'},
  Account: { path: '/account'},
  Templates: { path: '/templates'},
  DataGenerate: {path: '/data-generator'},
  DataGenerateStructured: {path: '/data-generator/gen-structured-data'},
  DataGenerateUnStructured: {path: '/data-generator/gen-unstructured-data'},
  BatchDeleteS3: {path: '/delete-s3'},
  SSHAgent: {path: '/ssh-agent' }
};
