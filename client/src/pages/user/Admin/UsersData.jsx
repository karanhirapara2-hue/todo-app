import { useParams, useNavigate } from "react-router-dom";

const MENU_ITEMS = [
  {
    label: "Pending Todos",
    path: "PendingTodo",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#c1694f" : "#a09d96"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3"/>
        <path d="M9 12l2 2 4-4"/>
        <path d="M9 8h6M9 16h4"/>
      </svg>
    ),
    active: true,
  },
  {
    label: "Completed Todos",
    path: "CompletedTodo",
    icon: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a09d96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
  {
    label: "Pending SubTodos",
    path: "PendingSubTodos",
    icon: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a09d96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3"/>
        <path d="M9 12l2 2 4-4"/>
        <path d="M9 8h6M9 16h4"/>
      </svg>
    ),
  },
  {
    label: "Completed SubTodo",
    path: "CompletedSubTodo",
    icon: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a09d96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
  {
    label: "Order",
    path: "Order",
    icon: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a09d96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
];

const UserData = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{
      padding: "32px 24px",
      fontFamily: "'DM Sans', sans-serif",
      background: "#f5f3ee",
      minHeight: "100vh",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .menu-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #faf9f6;
          border: 1.5px solid #e8e4dc;
          border-radius: 16px;
          padding: 18px 20px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.12s ease, box-shadow 0.15s ease;
          user-select: none;
        }

        .menu-card:hover {
          background: #f0ece3;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }

        .menu-card:active {
          transform: translateY(0);
        }

        .menu-card.menu-active {
          background: #faf9f6;
          border-color: #d4a898;
        }

        .icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #ede9e1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.15s;
        }

        .icon-wrap.icon-active {
          background: #c1694f;
        }

        .icon-wrap.icon-active svg {
          stroke: #fff !important;
        }

        .menu-label {
          font-size: 15px;
          font-weight: 600;
          color: #1e1c19;
          letter-spacing: -0.01em;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #a09d96;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 24px;
          background: none;
          border: none;
          font-family: 'DM Sans', sans-serif;
          padding: 0;
        }

        .back-btn:hover { color: #2d2b27; }

        .page-title {
          font-size: 20px;
          font-weight: 600;
          color: #1e1c19;
          letter-spacing: -0.02em;
          margin-bottom: 20px;
        }

        .user-id-pill {
          display: inline-block;
          background: #e8e4dc;
          color: #7a766e;
          font-size: 12px;
          font-weight: 500;
          border-radius: 20px;
          padding: 3px 10px;
          margin-bottom: 24px;
          letter-spacing: 0.02em;
        }
      `}</style>

      <button className="back-btn" onClick={() => navigate("/admin")}>
        ← Back to Users
      </button>

      <div className="page-title">User Overview</div>
      <div className="user-id-pill">ID: {userId}</div>

      <div>
        {MENU_ITEMS.map((item, i) => (
          <div
            key={item.path}
            className={`menu-card${i === 0 ? " menu-active" : ""}`}
            onClick={() => navigate(`/${item.path}/${userId}`)}
          >
            <div className={`icon-wrap${i === 0 ? " icon-active" : ""}`}>
              {item.icon(i === 0)}
            </div>
            <span className="menu-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserData;