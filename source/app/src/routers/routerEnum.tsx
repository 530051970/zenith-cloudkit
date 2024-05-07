import Home from 'pages/summary';
import Accounts from 'pages/accounts';
import DataGenerator from 'pages/data-generator';
import BatchDeleteS3 from 'pages/delete-s3';
import AddStructuredData from 'pages/data-generator/AddStructuredData';
import AddUnStructuredData from 'pages/data-generator/AddUnStructuredData';
import Login from 'pages/login';
import Templates from 'pages/templates';

interface RouterEnumType {
  path: string;
  element: JSX.Element;
}

export const RouterEnum: Record<string, RouterEnumType> = {
  Home: { path: '/', element: <Home /> },
  Login: { path: '/login', element: <Login /> },
  Account: { path: '/account', element: <Accounts />},
  Templates: { path: '/templates', element: <Templates /> },
  DataGenerate: {path: '/data-generator', element: <DataGenerator /> },
  DataGenerateStructured: {path: '/data-generator/gen-structured-data', element: <AddStructuredData /> },
  DataGenerateUnStructured: {path: '/data-generator/gen-unstructured-data', element: <AddUnStructuredData /> },
  BatchDeleteS3: {path: '/delete-s3', element: <BatchDeleteS3 /> },
  SSHAgent: {path: '/ssh-agent', element: <BatchDeleteS3 /> }
};
