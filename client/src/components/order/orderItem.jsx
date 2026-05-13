
import { useNavigate } from "react-router-dom";
import { useEffect ,useState} from "react";
 const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
 }
function OrderItem({ order, index }) {
   

 const num = String(index + 1).padStart(2, "0");
  return (
    <>
    <tr className={`border-b border-[#ece7df] last:border-b-0 hover:bg-[#f7f4f0] transition-colors ${false ? 'bg-red-50' : ''}`}>

      {/* № */}
      <td className="py-5 pl-6 pr-3 align-middle w-16">
        <span className="text-[#9c8f82] italic text-sm font-light">{num}</span>
      </td>
      <td className="py-5 px-3 align-middle w-32">
        
          {order.customerName}
        
      </td><td className="py-5 px-3 align-middle w-32">
        
          {order.product}
        
      </td>
      <td className="py-5 px-3 align-middle w-32">
        
          {order.status}
      
      </td>
      <td className="py-5 px-3 align-middle w-32">
        
          {formatDate(order.orderDate)}
       
      </td>
       <td className="py-5 px-3 align-middle w-32">
       
          {order.paymentMethod}
        
      </td>
       <td className="py-5 px-3 align-middle w-32">
      
          {order.totalAmount}
       
      </td>
    </tr>


    </>
  );
};

export default OrderItem;