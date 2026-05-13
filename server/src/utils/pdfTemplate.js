// pdfTemplate.js
const buildOrderPDFHTML = (orders) => {
  const now = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
 
  const statusColor = (status) => { 
    switch (status) {
      case "COMPLETED":  return { bg: "#d1fae5", color: "#065f46", dot: "#10b981" };
      case "PENDING":    return { bg: "#fef9c3", color: "#854d0e", dot: "#eab308" };
      case "CANCELLED":  return { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" };
      default:           return { bg: "#e2e8f0", color: "#475569", dot: "#94a3b8" };
    }
  };

  const rows = orders.map((order, i) => {
    const s = statusColor(order.status);
    const date = order.orderDate
      ? new Date(order.orderDate).toLocaleDateString("en-GB", {
          day: "2-digit", month: "short", year: "numeric",
        })
      : "—";

    const amount =
      order.totalAmount != null
        ? `$${parseFloat(order.totalAmount).toFixed(2)}`
        : "—";

    const productName =
      typeof order.product === "object"
        ? order.product?.name ?? "—"
        : order.product ?? "—";

    return `
      <tr>
        <td class="num">${String(i + 1).padStart(2, "0")}</td>
        <td class="main">${order.customerName ?? "—"}</td>
        <td>${productName}</td>
        <td>
          <span class="badge" style="background:${s.bg};color:${s.color};">
            <span class="dot" style="background:${s.dot};"></span>
            ${order.status ?? "—"}
          </span>
        </td>
        <td class="date">${date}</td>
        <td>${order.paymentMethod ?? "—"}</td>
        <td class="amount">${amount}</td>
      </tr>`;
  }).join("");

  const totalAmount = orders.reduce(
    (sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0
  );

  const countByStatus = orders.reduce((acc, o) => {
    const k = (o.status ?? "unknown").toLowerCase();
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  const statCards = [
    { label: "Total Orders", value: orders.length, color: "#1a1a2e" },
    { label: "Completed",    value: countByStatus.completed  ?? 0, color: "#065f46" },
    { label: "Pending",      value: countByStatus.pending    ?? 0, color: "#854d0e" },
    { label: "Cancelled",    value: countByStatus.cancelled  ?? 0, color: "#991b1b" },
    { label: "Total Revenue", value: `$${totalAmount.toFixed(2)}`, color: "#1a1a2e" },
  ].map(c => `
    <div class="stat-card">
      <div class="stat-label">${c.label}</div>
      <div class="stat-value" style="color:${c.color}">${c.value}</div>
    </div>`).join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600&family=DM+Mono:wght@400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #f0ede8;
    color: #2c2c2c;
    font-size: 12px;
    padding: 48px 52px;
  }

  /* ── Header ── */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 36px;
  }

  .header-left .eyebrow {
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #9c8f7e;
    font-weight: 500;
    margin-bottom: 6px;
  }

  .header-left h1 {
    font-size: 26px;
    font-weight: 600;
    color: #1a1a2e;
    letter-spacing: -0.4px;
  }

  .header-right {
    text-align: right;
  }

  .header-right .report-label {
    font-size: 10px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #9c8f7e;
    margin-bottom: 4px;
  }

  .header-right .report-date {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    color: #1a1a2e;
    font-weight: 500;
  }

  /* ── Divider ── */
  .divider {
    height: 1.5px;
    background: linear-gradient(90deg, #1a1a2e 0%, #d4cfc8 100%);
    margin-bottom: 28px;
  }

  /* ── Stat Cards ── */
  .stats {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
    margin-bottom: 32px;
  }

  .stat-card {
    background: #fff;
    border: 1px solid #e4dfd8;
    border-radius: 10px;
    padding: 14px 16px;
  }

  .stat-label {
    font-size: 9.5px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #9c8f7e;
    font-weight: 500;
    margin-bottom: 6px;
  }

  .stat-value {
    font-size: 20px;
    font-weight: 600;
    font-family: 'DM Mono', monospace;
    letter-spacing: -0.5px;
  }

  /* ── Table ── */
  .table-wrap {
    background: #fff;
    border: 1px solid #ddd8d0;
    border-radius: 14px;
    overflow: hidden;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead tr {
    background: #f7f4f0;
    border-bottom: 1.5px solid #ddd8d0;
  }

  thead th {
    padding: 11px 14px;
    font-size: 9.5px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #9c8f7e;
    font-weight: 500;
    text-align: left;
  }

  thead th.right { text-align: right; }

  tbody tr {
    border-bottom: 1px solid #f0ede8;
    transition: background 0.15s;
  }

  tbody tr:last-child { border-bottom: none; }
  tbody tr:nth-child(even) { background: #faf8f5; }

  tbody td {
    padding: 13px 14px;
    color: #3d3d3d;
    vertical-align: middle;
  }

  td.num {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #9c8f7e;
    font-weight: 500;
  }

  td.main {
    font-weight: 600;
    color: #1a1a2e;
  }

  td.date {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #c0392b;
  }

  td.amount {
    font-family: 'DM Mono', monospace;
    font-weight: 500;
    color: #1a1a2e;
    text-align: right;
  }

  /* ── Badge (status) ── */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 10.5px;
    font-weight: 500;
    text-transform: capitalize;
    white-space: nowrap;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* ── Footer ── */
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 28px;
    padding-top: 16px;
    border-top: 1px solid #ddd8d0;
  }

  .footer-left {
    font-size: 11px;
    color: #9c8f7e;
  }

  .footer-total {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .footer-total span {
    font-size: 11px;
    color: #9c8f7e;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .footer-total strong {
    font-family: 'DM Mono', monospace;
    font-size: 16px;
    font-weight: 600;
    color: #1a1a2e;
  }
</style>
</head>
<body>

  <div class="header">
    <div class="header-left">
      <div class="eyebrow">Order Management</div>
      <h1>Orders Ledger</h1>
    </div>
    <div class="header-right">
      <div class="report-label">Generated on</div>
      <div class="report-date">${now}</div>
    </div>
  </div>

  <div class="divider"></div>

  <div class="stats">${statCards}</div>

  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>№</th>
          <th>Customer</th>
          <th>Product</th>
          <th>Status</th>
          <th>Order Date</th>
          <th>Payment</th>
          <th class="right">Amount</th>
        </tr>
      </thead>
      <tbody>${rows || '<tr><td colspan="7" style="text-align:center;padding:32px;color:#9c8f7e;">No orders found</td></tr>'}</tbody>
    </table>
  </div>

  <div class="footer">
    <div class="footer-left">${orders.length} order${orders.length !== 1 ? "s" : ""} listed</div>
    <div class="footer-total">
      <span>Total Revenue</span>
      <strong>$${totalAmount.toFixed(2)}</strong>
    </div>
  </div>
</body>
</html>`;
};

export default buildOrderPDFHTML;