import React from 'react';

const SpiritSlot = ({ spirit, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`border-2 rounded-lg p-3 text-center cursor-pointer transition
      ${spirit ? 'border-indigo-400 bg-indigo-50' : 'border-dashed border-gray-300 bg-gray-50 hover:border-indigo-200'}
    `}
    >
      {spirit ? (
        <>
          <div className="font-bold text-gray-800">{spirit.name}</div>
          <div className="text-xs text-gray-600">{spirit.element_type}</div>
          {spirit.comment && (
            <div className="text-[10px] text-amber-600 mt-1 italic">{spirit.comment}</div>
          )}
        </>
      ) : (
        <div className="text-gray-400 text-sm">+ 정령 배치</div>
      )}
    </div>
  );
};

export default SpiritSlot;
