import { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import OrderForm from '../../components/order/orderForm'; 
import * as orderServices from '../../services/order.services';
import OrderList from '../../components/order/orderList'
import { useParams } from 'react-router-dom';
import Pagination from '../../components/common/pagination';
import * as adminServices from "../../services/admin.services"
function Order(){
    const [showForm,setShowForm]=useState(false);
     const [loading, setLoading] = useState(false);
     const [loading2, setLoading2] = useState(false);
     const [orders,setOrders] =useState([]);
     const [page,setPage] = useState(1);
     const [limit,setLimit]=useState(3);
     const [cur,setCur]=useState(1);
     const [totalPage,settotalPage]=useState(1);
     const {userId}=useParams();
     
      useEffect(() => {
     if(userId){
      adminServices.getAllOrdersAdmin(page,limit,userId).then((res) => {
      
         setOrders(res.data.data.orders);
         settotalPage(res.data.data.totalPage);
    }).catch((error) => {
      toast.error("Failed to fetch todos ❌");
    });
     }
     else{
    orderServices.getAllOrder(page,limit).then((res) => {
         setOrders(res.data.data.Orders);
         settotalPage(res.data.data.totalPage);
    }).catch((error) => {
      toast.error("Failed to fetch todos ❌");
    });
  }

  },[page,limit,orders.length]);
    console.log(orders)
   const handlelimit=(value)=>{
    
     setLimit(value);
     setCur(1);
   
     setPage(1);
  }
   
  

  const handleDownload = async () => {
  if (loading) return;
  setLoading(true);
  try {
    const res = await orderServices.downloadPDF();

    // axios puts the blob in res.data, not res itself
    const blob = new Blob([res.data], { type: "application/pdf" });
    const url  = URL.createObjectURL(blob);

    const a    = document.createElement("a");
    a.href     = url;
    a.download = `orders-${Date.now()}.pdf`;
    a.click();

    URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
    alert("Could not download PDF. Check server logs.");
  } finally {
    setLoading(false);
  }
};
  
const handleExcelDownload = async () => {
    if (loading2) return;
  setLoading2(true);
  const res = await orderServices.downloadExcel();
  const blob = new Blob([res.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `orders-${Date.now()}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
   setLoading2(false);
};

     return (
     <div className="min-h-screen bg-[#edeae4] flex">
      <div className="mb-6 w-screen">
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center gap-2 bg-[#c07057] hover:bg-[#a85e47] text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New entry
        </button>

        {showForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 px-4 py-6">
            <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-4 shadow-2xl max-h-[calc(100vh-6rem)] overflow-hidden">
              <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
                <OrderForm
                  setShowForm={setShowForm}
                  userId={userId}
                />
              </div>
            </div>
          </div>
        )}
         <div>
            <button
      onClick={handleDownload}
      disabled={loading}
      style={{
        display:        "inline-flex",
        alignItems:     "center",
        gap:            8,
        padding:        "9px 18px",
        background:     loading ? "#e4dfd8" : "#1a1a2e",
        color:          loading ? "#9c8f7e" : "#fff",
        border:         "none",
        borderRadius:   10,
        fontSize:       13,
        fontWeight:     500,
        fontFamily:     "inherit",
        cursor:         loading ? "not-allowed" : "pointer",
        transition:     "all 0.2s",
        letterSpacing:  0.2,
      }}
    >
      {loading ? (
        <>
          <span style={{ fontSize: 14 }}>⏳</span> Generating…
        </>
      ) : (
        <>
          <span style={{ fontSize: 14 }}>↓</span> Download PDF
        </>
      )}
    </button>

     <button
      onClick={handleExcelDownload}
      disabled={loading2}
      style={{
        display:        "inline-flex",
        alignItems:     "center",
        gap:            8,
        padding:        "9px 18px",
        background:     loading2 ? "#e4dfd8" : "#1a1a2e",
        color:          loading2 ? "#9c8f7e" : "#fff",
        border:         "none",
        borderRadius:   10,
        fontSize:       13,
        fontWeight:     500,
        fontFamily:     "inherit",
        cursor:         loading2 ? "not-allowed" : "pointer",
        transition:     "all 0.2s",
        letterSpacing:  0.2,
      }}
    >
      {loading2 ? (
        <>
          <span style={{ fontSize: 14 }}>⏳</span> Generating…
        </>
      ) : (
        <>
          <span style={{ fontSize: 14 }}>↓</span> Download Excel
        </>
      )}
    </button>
         </div>

        <OrderList orders={orders}/>

          <div className="flex items-center gap-100">
  {/* Input */}
     <input
    type="text"
    placeholder="Water the plants"
    value={limit}
    onChange={(e) => { handlelimit(e.target.value) }}
    className="w-48 bg-[#f5f0ea] border border-[#d4c9bc] rounded-2xl px-4 py-2.5 text-[#4a3f33] placeholder-[#b0a89e] outline-none focus:ring-2 focus:ring-[#c07057]/30 text-sm"
     />
    <Pagination 
     activePage={page}
    setActivePage={setPage}
    totalPage={totalPage}
    cur={cur}
    setCur={setCur}
     />
    </div>
      </div>
    </div>
    
     );
}

export default Order;
