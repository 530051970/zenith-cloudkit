import Accounts from 'pages/accounts';
import ChangePWD from 'pages/change-pwd';
import DataGenerator from 'pages/data-generator';
import AddStructuredData from 'pages/data-generator/AddStructuredData';
import AddUnStructuredData from 'pages/data-generator/AddUnStructuredData';
import BatchDeleteS3 from 'pages/delete-s3';
import FindPWD from 'pages/find-pwd';
import Login from 'pages/login';
import Register from 'pages/register';
import SSHAgent from 'pages/ssh-agent';
import Home from 'pages/summary';
import Templates from 'pages/templates';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
interface appRouterProps {
  user:any;
}
const AppRouter = (props:appRouterProps) => {
  const {user} = props
  // const routerList = Object.keys(RouterEnum);
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/find-password" element={<FindPWD />} />
        <Route path="/create-account" element={<Register />} />
        <Route path="/change-password" element={<ChangePWD />} />
        <Route path="/" element={user!=null?<Home />:<Login />} />
        <Route path="/account" element={user!=null?<Accounts />:<Login />} />
        <Route path="/templates" element={user!=null?<Templates />:<Templates />} />
        <Route path="/data-generator" element={user!=null?<DataGenerator />:<DataGenerator />} />
        <Route path="/data-generator/gen-structured-data" element={user!=null?<AddStructuredData />:<AddStructuredData />} />
        <Route path="/data-generator/gen-unstructured-data" element={user!=null?<AddUnStructuredData />:<AddUnStructuredData />} />
        <Route path="/delete-s3" element={user!=null?<BatchDeleteS3 />:<BatchDeleteS3 />} />
        <Route path="/ssh-agent" element={user!=null?<SSHAgent />:<SSHAgent />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
