import { Icon } from '@cloudscape-design/components';
import React from 'react';
import '../style.scss';
import { RouterEnum } from 'routers/routerEnum';

const IdentifierFilterTag: React.FC<any> = (props: any) => {
  const { identifiers, setShowFilter } = props;
  const clearIdentifiersFilter = () => {
    setShowFilter(true);
    window.history.pushState(null, '', RouterEnum.Catalog.path);
  };
  return (
    <div className="filter-identifiers catalog-identifiers">
      <span className="title-identifiers">Identifiers: {identifiers}</span>
      <div className="clear-identifiers" onClick={clearIdentifiersFilter}>
        <Icon name="close" alt="clear" size="small" />
      </div>
    </div>
  );
};

export default IdentifierFilterTag;
