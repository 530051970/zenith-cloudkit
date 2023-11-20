import Home from 'pages/summary';
import Accounts from 'pages/accounts';
import DataCatalogList from '../pages/data-generator';
import BatchDeleteS3 from '../pages/delete-s3';

interface RouterEnumType {
  path: string;
  element: JSX.Element;
}

export const RouterEnum: Record<string, RouterEnumType> = {
  Home: { path: '/', element: <Home /> },
  Account: { path: '/account', element: <Accounts />},
  DataGenerate: {path: '/data-generator', element: <DataCatalogList /> },
  BatchDeleteS3: {path: '/delete-s3', element: <BatchDeleteS3 /> },
  SSHAgent: {path: '/ssh-agent', element: <BatchDeleteS3 /> }
};
