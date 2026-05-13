import * as orderService from "../../services/order.services";
import { useState } from "react";
import toast from 'react-hot-toast';
import * as adminService from "../../services/admin.services"
function OrderForm({ setShowForm,userId}) {
  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const [customerName, setCustomerName] = useState("");
  const [orderDate, setOrderDate] = useState(getTodayDate);
  const [status, setStatus] = useState("PENDING");
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [product, setProduct] = useState("");
  const [orderDateError, setOrderDateError] = useState("");
  const [error, setError] = useState("");

  const handleOrderDateChange = (value) => {
    setOrderDate(value);
    if (value && value < getTodayDate()) {
      setOrderDateError("Past dates are not allowed");
    } else {
      setOrderDateError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) return setError("Please enter customer name");
    if (!product.trim()) return setError("Please enter product");
    if (orderDate && orderDate < getTodayDate()) {
      setOrderDateError("Past dates are not allowed");
      return;
    }
    setError("");
    setOrderDateError("");

    const payload = { customerName, orderDate, status, totalAmount, paymentMethod, product };

    try {
      if(userId){
       
       const res = await adminService.createOrderAdmin(payload,userId);
      }
      else{
      const res = await orderService.createOrder(payload);
      }
      
      setShowForm(false);
      toast.success("Order created successfully ✅");

      setCustomerName("");
      setOrderDate(getTodayDate);
      setStatus("PENDING");
      setTotalAmount(0);
      setPaymentMethod("CASH");
      setProduct("");
    } catch (err) {
      setError("Something went wrong");
      toast.error("Failed to create order ❌");
    }
  };

  return (
    <div className="bg-[#ede8e1] rounded-2xl px-6 py-5 shadow-sm mb-6 space-y-5">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold text-[#2e2416]">New Order</h2>
          <p className="text-sm text-[#9c8f82] mt-0.5">Fill in the order details below.</p>
        </div>
        <button
          onClick={() => setShowForm(false)}
          className="text-[#9c8f82] hover:text-[#4a3f33] text-xl leading-none"
        >
          ✕
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Customer Name */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-[#4a3f33]">Customer Name*</label>
        <input
          type="text"
          placeholder="John Doe"
          value={customerName}
          onChange={(e) => { setCustomerName(e.target.value); setError(""); }}
          className="w-full bg-[#f5f0ea] border border-[#c9a898] rounded-2xl px-4 py-3 text-[#4a3f33] placeholder-[#b0a89e] outline-none focus:ring-2 focus:ring-[#c07057]/30"
        />
      </div>

      {/* Product */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-[#4a3f33]">Product*</label>
        <input
          type="text"
          placeholder="Product name"
          value={product}
          onChange={(e) => { setProduct(e.target.value); setError(""); }}
          className="w-full bg-[#f5f0ea] border border-[#ddd8d0] rounded-2xl px-4 py-3 text-[#4a3f33] placeholder-[#b0a89e] outline-none focus:ring-2 focus:ring-[#c07057]/20"
        />
      </div>

      {/* Total Amount */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-[#4a3f33]">Total Amount</label>
        <input
          type="number"
          placeholder="0.00"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          className="w-full bg-[#f5f0ea] border border-[#ddd8d0] rounded-2xl px-4 py-3 text-[#4a3f33] placeholder-[#b0a89e] outline-none focus:ring-2 focus:ring-[#c07057]/20"
        />
      </div>

      {/* Payment Method */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#4a3f33]">Payment Method</label>
        <div className="flex gap-2">
          {["CASH", "CARD", "ONLINE"].map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setPaymentMethod(method)}
              className={`flex-1 py-2.5 rounded-2xl text-sm border transition ${
                paymentMethod === method
                  ? "bg-[#f5f0ea] border-[#c9a898] text-[#4a3f33] font-medium"
                  : "bg-[#f5f0ea] border-transparent text-[#7a6e5f]"
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#4a3f33]">Status</label>
        <div className="flex gap-2">
          {["PENDING", "COMPLETED", "CANCELLED"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`flex-1 py-2.5 rounded-2xl text-sm border transition ${
                status === s
                  ? "bg-[#f5f0ea] border-[#c9a898] text-[#4a3f33] font-medium"
                  : "bg-[#f5f0ea] border-transparent text-[#7a6e5f]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Order Date */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-[#4a3f33]">Order Date</label>
        <input
          type="date"
          min={getTodayDate()}
          value={orderDate}
          onChange={(e) => handleOrderDateChange(e.target.value)}
          className="w-full bg-[#f5f0ea] border border-[#ddd8d0] rounded-2xl px-4 py-3 text-[#4a3f33] outline-none focus:ring-2 focus:ring-[#c07057]/20"
        />
        {orderDateError && <p className="text-red-500 text-sm mt-1">{orderDateError}</p>}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-1">
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="text-sm text-[#7a6e5f] px-4 py-2"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-[#c07057] hover:bg-[#a85e47] text-white text-sm font-medium px-6 py-2.5 rounded-2xl transition-colors"
        >
          Add Order
        </button>
      </div>
    </div>
  );
}

export default OrderForm;