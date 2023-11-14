import React, { useEffect, useState } from 'react';
import Spinner from '@cloudscape-design/components/spinner';

const PageSpinner: React.FC = () => {
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    window.addEventListener('showSpinner', showSpinner);
    return () => {
      window.removeEventListener('showSpinner', showSpinner);
    };
  }, []);

  const showSpinner = (event: any) => {
    setIsShow(event.detail.isShow);
  };

  return (
    <>
      {isShow && (
        <div className="spinner-father">
          <Spinner size="large" />
        </div>
      )}
    </>
  );
};

export default PageSpinner;
