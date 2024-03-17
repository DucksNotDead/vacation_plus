import React from 'react';

const Avatars = ({ maxCount=5, urls, backgroundColorClass = 'bg-white' }) => {
  return (
      <div className={"app-avatars-row"}>
        {urls.filter((_, i) => i<maxCount).map((url, i) => (
            <div key={url+i} className={`${backgroundColorClass} overflow-hidden p-[2px] rounded-full${i? ' -ml-sm' : ''}`}>
              <img
                  src={url}
                  alt="avatar-image-item"
                  height={28}
                  width={28}
              />
            </div>
        ))}
      </div>
  );
};

export default Avatars;