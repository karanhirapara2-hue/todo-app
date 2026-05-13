import api from "../utils/api";

export const createOrder = (data) => api.post("/order", data);


export const downloadPDF = () => api.get("/order/download-pdf", {
  responseType: "blob",
});

export const downloadExcel = () =>
  api.get("/order/download-excel", { responseType: "blob" });  // same pattern as PDF

export const getAllOrder =(page,limit)=>  api.get(`/order?page=${page}&limit=${limit}`); 
