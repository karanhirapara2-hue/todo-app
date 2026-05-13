import * as orderService from "../services/order.services.js"
import ApiResponse  from "../utils/apiResponse.js";
import puppeteer from 'puppeteer';
import buildOrderPDFHTML from "../utils/pdfTemplate.js"
import ExcelJS from "exceljs";

export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const order = await orderService.createOrder({
      ...req.body,
      userId: userId,
    });


    res.status(201).json(
      new ApiResponse(true, "Order created successfully", order)
    );
  } catch (error) {
    next(error);
  }
};



 
// ─── GET /api/orders ──────────────────────────────────────────────────────────
export const getAllOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await orderService.getOrders(userId);
    res.status(200).json(new ApiResponse(true, "Orders fetched", orders));
  } catch (error) {
    next(error);
  }
};
 
// ─── GET /api/orders/download-pdf ────────────────────────────────────────────
export const downloadOrdersPDF = async (req, res, next) => {
  
  let browser;
  try {
    // 1. Fetch all orders from DB (reuses your existing service)
    const userId = req.user.id;
    const orders = await orderService.getOrders(userId);
 
    // 2. Build the HTML template
    const html = buildOrderPDFHTML(orders);
 
    // 3. Launch Puppeteer and render
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
 
    const page = await browser.newPage();
 
    // networkidle0 waits for Google Fonts to load
    await page.setContent(html, { waitUntil: "networkidle0" });
 
    const pdf = await page.pdf({
      format: "A4",
      landscape: true,           // wider table — flip to false if you prefer portrait
      printBackground: true,
      margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
    });
 
    await page.close();
 
    // 4. Send PDF as download
    const filename = `orders-${Date.now()}.pdf`;
    res.set({
      "Content-Type":        "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length":      pdf.length,
    });
 
    res.end(pdf);
 
  } catch (error) {
    next(error);
  } finally {
    if (browser) await browser.close();
  }
};


export const downloadOrdersExcel = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders =await orderService.getOrders(userId);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Orders");

    sheet.columns = [
      { header: "№",              key: "no",            width: 10 },
      { header: "Customer Name",  key: "customerName",  width: 20 },
      { header: "Product",        key: "product",       width: 20 },
      { header: "Status",         key: "status",        width: 14 },
      { header: "Order Date",     key: "orderDate",     width: 16 },
      { header: "Payment Method", key: "paymentMethod", width: 18 },
      { header: "Total Amount",   key: "totalAmount",   width: 14 },
    ];

    orders.forEach((order, i) => {
      sheet.addRow({
        no:            i + 1,
        customerName:  order.customerName ?? "—",
        product:       typeof order.product === "object"
                         ? order.product?.name ?? "—"
                         : order.product ?? "—",
        status:        order.status ?? "—",
        orderDate:     order.orderDate
                         ? new Date(order.orderDate).toLocaleDateString("en-GB")
                         : "—",
        paymentMethod: order.paymentMethod ?? "—",
        totalAmount:   order.totalAmount ?? 0,
      });
    });

    res.setHeader("Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="orders-${Date.now()}.xlsx"`);

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    next(error);
  }
};

export const getAllOrder = async (req, res, next) => {
  try {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const userId = req.user.id;

    const Orders = await orderService.getAllOrders(skip,limit,userId);
    
    const totalOrder=await orderService.getAllOrders(0,1000,userId);
    const totalPage =Math.ceil(totalOrder.length/limit);
    res.status(200).json(
      new ApiResponse(true, "Order fetched successfully", {
        count: Orders.length,
        Orders,
        page:page,
        limit:limit,
        totalPage:totalPage,
      })
    );
  } catch (error) {
    next(error);
  }
};