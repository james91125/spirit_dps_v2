import React from 'react';

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex flex-col justify-center items-center z-50">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500"></div>
      <h2 className="text-white text-2xl mt-8 font-bold">최적의 조합을 찾고 있습니다...</h2>
      <p className="text-white text-lg mt-2">잠시만 기다려 주세요.</p>
    </div>
  );
};

export default Loading;
