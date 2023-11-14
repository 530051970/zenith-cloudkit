import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import './style.scss';
import { Icon } from '@cloudscape-design/components';
import { RightModalProps } from 'ts/right-modal/types';

const RightModal: React.FC<RightModalProps> = (props: RightModalProps) => {
  const {
    needMask = false,
    children,
    showModal,
    setShowModal,
    className,
    header,
    footer,
    showFolderIcon,
  } = props;

  const [showCss, setShowCss] = useState(false);
  const [underTop, setUnderTop] = useState(false);

  const clickMask = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    needClose: boolean
  ) => {
    e.stopPropagation();
    e.preventDefault();
    !needClose && setShowModal(needClose);
  };

  useEffect(() => {
    window.addEventListener('scroll', () => listenScroll());
    return window.removeEventListener('scroll', () => listenScroll());
  }, []);

  useEffect(() => {
    showModalCss(true);
  }, [showModal]);

  const listenScroll = () => {
    const scrollTop =
      document.documentElement.scrollTop ||
      window.pageYOffset ||
      document.body.scrollTop;
    setUnderTop(scrollTop > 56);
  };

  const showModalCss = (
    isShow: boolean | ((prevState: boolean) => boolean)
  ) => {
    setTimeout(() => {
      setShowCss(isShow);
    }, 50);
  };

  const closeModal = () => {
    setTimeout(() => {
      setShowCss(false);
      setTimeout(() => {
        setShowModal(false);
      }, 300);
    }, 50);
  };

  const maskCls = classnames({
    'mask-modal': true,
    'mask-modal-color': needMask,
  });

  const modalHeaderCls = classnames({
    'right-modal-header': true,
    'header-normal': !showFolderIcon,
  });

  const rightShowCls = classnames({
    'right-modal': true,
    'right-modal-show': showCss,
    'under-top': underTop,
  });

  if (!showModal) {
    return <></>;
  }

  return (
    <div
      className={`${maskCls} ${className}`}
      onClick={(e) => clickMask(e, false)}
    >
      <div className={rightShowCls} onClick={(e) => clickMask(e, true)}>
        <div className={modalHeaderCls}>
          {showFolderIcon && (
            <>
              <Icon name="folder" size="medium" />
              <span className="modal-header-span">{header}</span>
            </>
          )}

          {!showFolderIcon && (
            <span className="modal-header-span modal-header-span-normal">
              {header}
            </span>
          )}

          <div className="modal-header-close" onClick={closeModal}>
            <Icon name="close" size="medium" />
          </div>
        </div>
        {children}
        {footer}
      </div>
    </div>
  );
};

export default RightModal;
