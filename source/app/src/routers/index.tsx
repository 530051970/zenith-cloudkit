import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { RouterEnum } from './routerEnum';

const AppRouter = () => {
  const routerList = Object.keys(RouterEnum);
  return (
    <Suspense fallback={null}>
      <Routes>
        {routerList.map((item, index) => (
          <Route
            key={`${item}${index}`}
            path={RouterEnum[item].path}
            element={RouterEnum[item].element}
          />
        ))}
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
