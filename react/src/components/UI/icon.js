import React from 'react';

const Icon = ({ name, size = 28, onClick=null }) => {
  return (
      <div onClick={() => onClick&& onClick()} className={`app-icon${onClick? ' cursor-pointer' : ''}`} style={{ width: size, height: 'auto' }}>
        <img
            src={`/icons/${name}${name.includes('.png')? '' : '.svg'}`}
            alt={name+'-icon'}
        />
      </div>
  );
};

export default Icon;