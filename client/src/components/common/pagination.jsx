import {  useState } from 'react';

const Pagination=({ activePage, setActivePage, totalPage, cur, setCur })=>{
   
  return(
    <>
  {/* Pagination Buttons */}
  <div className="flex items-center gap-2">
    {cur > 1 && (
      <button
        onClick={() => {
        if(activePage > cur){
            setActivePage(activePage-1);
        }
        else{
        setActivePage(activePage-1);
        setCur(cur-1)}
       }
      }
        className="px-4 py-2 rounded-full border border-[#d4c9bc] bg-[#f5f0ea] text-[#4a3f33] text-sm font-medium hover:bg-[#ede7de] transition-colors"
      >
        ← Prev
      </button>
    )}

     <button
        key={cur}
        onClick={() => {
          setActivePage(cur);
          
        }}
        className={`w-9 h-9 rounded-full text-sm font-semibold transition-colors
          ${activePage === cur
            ? "bg-[#1e2d3d] text-white hover:bg-[#2a3f55]"
            : "border border-[#d4c9bc] bg-[#f5f0ea] text-[#4a3f33] hover:bg-[#ede7de]"
          }`}
      >
        {cur}
      </button> 

    {cur+1<=totalPage && <button
    key={cur+1}
    onClick={() => {
        setActivePage(cur+1);
    
    }}
    className={`w-9 h-9 rounded-full text-sm font-semibold transition-colors
        ${activePage === (cur+1)
        ? "bg-[#1e2d3d] text-white hover:bg-[#2a3f55]"
        : "border border-[#d4c9bc] bg-[#f5f0ea] text-[#4a3f33] hover:bg-[#ede7de]"
        }`}
    >
    {cur+1}
    </button>}

      {cur+2<=totalPage && <button
        key={cur+2}
        onClick={() => {
          setActivePage(cur+2);
          
        }}
        className={`w-9 h-9 rounded-full text-sm font-semibold transition-colors
          ${activePage === (cur+2)
            ? "bg-[#1e2d3d] text-white hover:bg-[#2a3f55]"
            : "border border-[#d4c9bc] bg-[#f5f0ea] text-[#4a3f33] hover:bg-[#ede7de]"
          }`}
      >
        {cur+2}
      </button>}

    {cur+2 < totalPage && <button
      onClick={() => {
        if(activePage < (cur+2)){
            setActivePage(activePage+1);
        }
        else{
       setActivePage(activePage+1);
        setCur(cur+1)}
      }
    }
      className="px-4 py-2 rounded-full border border-[#d4c9bc] bg-[#f5f0ea] text-[#4a3f33] text-sm font-medium hover:bg-[#ede7de] transition-colors"
    >
      Next →
    </button>
     }
  </div>
  </>
 );
}

export default Pagination;