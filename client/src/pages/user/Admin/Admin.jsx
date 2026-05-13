import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as adminService from "../../../services/admin.services";
import * as userService from "../../../services/user.sevices"
import Pagination from "../../../components/common/pagination";
import AddUser from "./AddUser"
import UpdateUser from "./UpdateUser";
import { useSelector, useDispatch } from "react-redux";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [cur, setCur] = useState(1);
  const [res, setRes] = useState({});
  const navigate = useNavigate();
  const [update, setUpdate] = useState(false);
  const [update2, setUpdate2] = useState(false);
  const [change, setChange] = useState(1);
  const [usersId, setUsersId] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [close, setClose] = useState(false);
  const [isMAdmin,setIsMAdmin]=useState(false);
  const [credentialModal, setCredentialModal] = useState(false);
  const [credentialForm, setCredentialForm] = useState({
    credentialMail: "",
    credentialPassword: "",
  });
  const profile = useSelector((state) => state.Profile.data);
  const authUser = useSelector((state) => state.Auth.user);
  const user = profile || authUser;

  useEffect(() => {
    if(user.role=="69ec311f790dff2bd1294bb7"){
    adminService
      .getAllUsers(page, limit)
      .then((res) => {
        setUsers(res.data.data.users);
        setTotalPage(res.data.data.totalPage);
      })
      .catch(() => {
        toast.error("Failed to fetch users");
      });
       setIsMAdmin(false);
       
    }
    else{
       adminService
      .getAllAdmins(page, limit)
      .then((res) => {
        
        setUsers(res.data.data.admins);
        setTotalPage(res.data.data.totalPage);
      })
      .catch(() => {
        toast.error("Failed to fetch users");
      });
     setIsMAdmin(true);
    }

  }, [page, limit, res, change]);

  const handlelimit = (value) => {
    setLimit(value);
    setCur(1);

    setPage(1);
  };
  

  const handleBan = (userId, userStatus) => {
    adminService
      .updateUserStatusAdmin(!userStatus, userId)
      .then((response) => {
        setRes(response);
        // do something after success (e.g. update UI, show toast)
      })
      .catch((error) => {
        console.error("Error:", error);
        // handle error (e.g. show error message)
      });
  };

  const handleCredential = () => {
  userService.setUserCredentialService(credentialForm)
    .then(() => {
      setCredentialModal(false);
      setCredentialForm({ credentialMail: "", credentialPassword: "" });
    })
    .catch((error) => {
      console.error("Error setting credential:", error);
    });
};

  return (
    <div
      style={{
        padding: "32px",
        fontFamily: "'DM Sans', sans-serif",
        background: "#f5f3ee",
        minHeight: "100vh",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .admin-table-wrapper {
          background: #faf9f6;
          border: 1.5px solid #e4e0d8;
          border-radius: 16px;
          overflow: hidden;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
        }

        .admin-table thead tr {
          border-bottom: 1.5px solid #e4e0d8;
        }

        .admin-table thead th {
          padding: 14px 20px;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: #a09d96;
          text-transform: uppercase;
        }

        .admin-table tbody tr {
          border-bottom: 1px solid #edeae3;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .admin-table tbody tr:last-child {
          border-bottom: none;
        }

        .admin-table tbody tr:hover {
          background: #f0ece3;
        }

        .admin-table tbody td {
          padding: 18px 20px;
          font-size: 14px;
          color: #2d2b27;
        }

        .row-num {
          color: #b0aca4;
          font-size: 13px;
          font-weight: 500;
        }

        .user-name {
          font-weight: 600;
          color: #1e1c19;
        }

        .user-email {
          font-size: 13px;
          color: #7a766e;
          margin-top: 2px;
        }

        .pagination {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 20px;
          justify-content: flex-end;
        }

        .page-btn {
          padding: 6px 14px;
          border-radius: 8px;
          border: 1.5px solid #e4e0d8;
          background: #faf9f6;
          color: #2d2b27;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.15s;
        }

        .page-btn:hover:not(:disabled) {
          background: #edeae3;
        }

        .page-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .page-btn.active {
          background: #2d2b27;
          color: #faf9f6;
          border-color: #2d2b27;
        }

        .limit-select {
          padding: 6px 10px;
          border-radius: 8px;
          border: 1.5px solid #e4e0d8;
          background: #faf9f6;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: #2d2b27;
          cursor: pointer;
        }

        .table-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .table-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e1c19;
          letter-spacing: -0.02em;
        }

        .empty-state {
          text-align: center;
          padding: 48px 20px;
          color: #a09d96;
          font-size: 14px;
        }
          .btn-edit,
.btn-ban,
.btn-unban {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
  white-space: nowrap;
}

.btn-edit:active,
.btn-ban:active,
.btn-unban:active {
  transform: scale(0.97);
}

/* Edit */
.btn-edit {
  border: 1px solid #c0dd97;
  background: #eaf3de;
  color: #3b6d11;
}
.btn-edit:hover {
  background: #d4eab8;
}

/* Ban */
.btn-ban {
  border: 1px solid #f7c1c1;
  background: #fcebeb;
  color: #a32d2d;
}
.btn-ban:hover {
  background: #f7d4d4;
}

/* Unban */
.btn-unban {
  border: 1px solid #fac775;
  background: #faeeda;
  color: #854f0b;
}
.btn-unban:hover {
  background: #f5ddb0;
}
      `}</style>

      <div className="table-header-row">
        <h2 className="table-title">Users</h2>
      {user.access.includes("User") &&
        <button
          onClick={() => {
            
            setCredentialModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 active:scale-95 transition-all duration-150 cursor-pointer whitespace-nowrap"
        >
          + Add Credential
        </button>}

        {user.access.includes("User") &&
          <button
            onClick={() => {
              if(user.credentialMail && user.credentialPassword){
              setClose(true);
              }
              else{
              toast.error("credential needed");
            }
          }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 active:scale-95 transition-all duration-150 cursor-pointer whitespace-nowrap"
        >
          + Add Staff
        </button>}
      </div>
      {credentialModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-[#f5f5f0] rounded-xl shadow-xl p-6 w-full max-w-md">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Set Credential
      </h3>

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-gray-500">
            Credential Email
          </label>
          <input
            type="email"
            value={credentialForm.credentialMail}
            onChange={(e) =>
              setCredentialForm({ ...credentialForm, credentialMail: e.target.value })
            }
            className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
            placeholder="Enter email"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">
            Credential Password
          </label>
          <input
            type="password"
            value={credentialForm.credentialPassword}
            onChange={(e) =>
              setCredentialForm({ ...credentialForm, credentialPassword: e.target.value })
            }
            className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
            placeholder="Enter password"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => {
            setCredentialModal(false);
            setCredentialForm({ credentialMail: "", credentialPassword: "" });
          }}
          className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
             handleCredential();
           
          }}
          className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 active:scale-95 transition-all duration-150"
        >
          Save
        </button>
      </div>

    </div>
  </div>
)}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>№</th>
              <th>Username</th>
              <th>Email</th>
              <th className="pl-16">Activity</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={3} className="empty-state">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user._id || user.id}>
                  <td className="row-num">
                    {String((page - 1) * limit + index + 1).padStart(2, "0")}
                  </td>

                  <td
                    
                    style={{ cursor: "pointer" }}
                  >
                    <div className="user-name">
                      {user.userName || user.username || user.name}
                    </div>
                  </td>
                   
                  <td
                    
                    style={{ cursor: "pointer" }}
                  >
                    <div className="user-email">{user.email}</div>
                  </td>

                  <td onClick={(e) => e.stopPropagation()}>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      <button
                        onClick={() => {
                          (setUsersId(user._id),
                            setUpdate(true),
                            setEmail(user.email),
                            setName(user.name));
                        }}
                        className="btn-edit"
                      >
                        ✎ Edit
                      </button>

                      <button
                        onClick={() =>
                          handleBan(user._id || user.id, user.is_banned)
                        }
                        className={user.is_banned ? "btn-unban" : "btn-ban"}
                      >
                        {user.is_banned ? "↩ Unban" : "🚫 Ban"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {update && (
        <UpdateUser
          userId={usersId}
          setUpdate={setUpdate}
          Email={email}
          Name={name}
          setChange={setChange}
        />
      )}
      {close && <AddUser setUpdate={setClose}  isMAdmin={isMAdmin} parentUser={user._id}/>}
      <div className="flex items-center gap-4 mt-4">
        {/* Input */}
        <input
          type="text"
          placeholder="Water the plants"
          value={limit}
          onChange={(e) => {
            handlelimit(e.target.value);
          }}
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
  );
};

export default Admin;
