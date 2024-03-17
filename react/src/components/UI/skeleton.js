import React from 'react';

const Skeleton = ({ isVisible=true, children, className }) => {
  return isVisible&& (
      <div className={`app-skeleton${className? ' ' + className : ''}`}>
        { children }
      </div>
  );
};

export default Skeleton;