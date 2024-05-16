import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from 'pages/summary';
import Login from 'pages/login';
import Accounts from 'pages/accounts';
import Templates from 'pages/templates';
import DataGenerator from 'pages/data-generator';
import AddStructuredData from 'pages/data-generator/AddStructuredData';
import AddUnStructuredData from 'pages/data-generator/AddUnStructuredData';
import BatchDeleteS3 from 'pages/delete-s3';
import SSHAgent from 'pages/ssh-agent';
interface appRouterProps {
  user:any
}
const AppRouter = (props:appRouterProps) => {
  const {user} = props
  // const routerList = Object.keys(RouterEnum);
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={user!=null?<Home />:<Home />} />
        <Route path="/account" element={user!=null?<Accounts />:<Accounts />} />
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
