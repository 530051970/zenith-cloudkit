import React from 'react';

export interface RightModalProps {
  needMask?: boolean;
  children?: React.ReactNode;
  showModal: boolean;
  setShowModal: (modal: boolean) => void;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  showFolderIcon?: boolean;
}
