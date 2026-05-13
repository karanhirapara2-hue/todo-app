import { useState } from "react";
import OrderItem from "./orderItem"

function OrderList({orders}) {
  

  return (
    <div className="space-y-4">
      
      {false ? (
        <div className="border-2 border-dashed border-[#d5cfc6] rounded-2xl flex flex-col items-center justify-center py-24 mt-2">
          <span className="text-4xl mb-4">🌿</span>
          <p className="font-serif italic text-[#2e2416] text-xl mb-1">The ledger is empty.</p>
          <p className="text-[#9c8f82] text-sm">
            Press <strong className="text-[#4a3f33]">New entry</strong> to begin.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#1e2a3a] mt-2">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-[#1e2a3a]">
                {[
                  { label: "№",             cls: "w-16 pl-6"  },
                  { label: "Customer Name", cls: "w-auto"     },
                  { label: "Product",      cls: "w-auto"   },
                  { label: "Status",           cls: "w-36"       },
                  { label: "Order Date",      cls: "w-36"  },
                  { label: "Payment Method",      cls: "w-36"  },
                  { label: "Total Amount",      cls: "w-36"  },
                ].map(({ label, cls }) => (
                  <th
                    key={label}
                    className={`text-[10px] tracking-widest text-[#9c8f82] font-semibold py-4 px-3 text-left ${cls}`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <OrderItem
                  key={order._id}
                  order={order}
                  index={i}
                  
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OrderList;