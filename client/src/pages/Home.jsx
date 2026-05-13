import TodoForm from "../components/todo/TodoForm";
import TodoList from "../components/todo/TodoList";
import EditForm from "../components/todo/EditTodo";
import ProfileMenu from "../components/Profile/ProfileMenu";
import EditProfileMenu from "../components/Profile/EditProfileMenu";
import { useSelector, useDispatch } from "react-redux";
import Pagination from "../components/common/pagination";
import { fetchUser } from "../redux/slices/profileslice";
import * as todoService from "../services/todo.service";
import { useEffect, useState, useMemo } from "react";
import { clearAuth } from "../redux/slices/Authslice";
import * as authService from "../services/user.sevices";
import { useNavigate, NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { socket } from "../services/socket.service";
function Home() {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [Todos, setTodos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [totalPage, setTotalPage] = useState(0);
  const [cur, setCur] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const dispatch = useDispatch();

  const profile = useSelector((state) => state.Profile.data);
  const authUser = useSelector((state) => state.Auth.user);
  const user = profile || authUser;
  useEffect(() => {
    if (user) {
      socket.connect();

      socket.on("connect", () => {
        console.log("✅ Connected:", socket.id); // does this print?
      });

      socket.on("connect_error", (err) => {
        console.log("❌ Connection error:", err.message); // check this
      });
    }
  }, [user]);
  useEffect(() => {
    const isAdmin = Boolean(
      authUser?.role == "69ec311f790dff2bd1294bb7" ||
      authUser?.role == "69f1c7e7072238bd3255cfb5",
    );
    setIsAdmin(isAdmin);
  }, [authUser]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error(err);
      toast.error("Logout failed ❌");
    } finally {
      localStorage.removeItem("token");
      dispatch(clearAuth());
      navigate("/login");
    }
    socket.disconnect();
  };
  // ✅ Recomputes whenever Todos changes
  const pendingTodos = useMemo(() => {
    // console.log("recomputing pendingTodos:", Todos); // ← add this
    return Todos.filter((t) => !t.completed);
  }, [Todos]);
  useEffect(() => {
    const fetchTodos = () => {
      todoService
        .getTodos(false, page, limit)
        .then((res) => {
          setTodos(res.data.data.todos);

          setTotalPage(res.data.data.totalPage);
        })
        .catch(() => {
          toast.error("Failed to fetch todos ❌");
        });
    };

    // Initial fetch
    fetchTodos();

    // Refetch on socket events
    socket.on("todoCreated", fetchTodos);
    socket.on("todoUpdated", fetchTodos);
    socket.on("todoDeleted", fetchTodos);

    return () => {
      socket.off("todoCreated", fetchTodos);
      socket.off("todoUpdated", fetchTodos);
      socket.off("todoDeleted", fetchTodos);
    };
  }, [page, limit]);
  // ✅ remove pendingTodos.length

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = showForm || showEditForm ? "hidden" : "";
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, [showForm, showEditForm]);

  const completedTodos = Todos.filter((t) => t.completed);

  const handleOpenEdit = (todo) => {
    setShowForm(false);
    setEditingTodo(todo);
    setShowEditForm(true);
  };

  const handlelimit = (value) => {
    setLimit(value);
    setCur(1);

    setPage(1);
  };

  const subtitle =
    pendingTodos.length === 0
      ? "Nothing on your plate — enjoy the calm."
      : `${pendingTodos.length} task${pendingTodos.length > 1 ? "s" : ""} remaining`;

  if (user?.is_banned) {
    return (
      <div className="min-h-screen bg-[#edeae4] flex items-center justify-center px-6">
        <p className="text-[#a32d2d] text-lg font-semibold">
          This ID is banned.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#edeae4] flex">
      <div className="hidden md:block md:w-64 md:bg-[#f4ede4] md:shadow-xl md:fixed md:left-0 md:top-0 md:h-full md:z-40 md:p-8 md:rounded-r-2xl">
        <div className="flex flex-col gap-6">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#7a6e5f]">
            Views
          </span>
          <nav className="flex flex-col gap-3">
            <NavLink
              to="/PendingTodo"
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-3xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-[#1a2438] text-white shadow-[0_16px_40px_-28px_rgba(0,0,0,0.8)]"
                    : "bg-white text-[#2c2416] hover:bg-[#f8e7de] hover:text-[#2c2416] border border-[#e8dfd6]"
                }`
              }
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e8ddd3] text-[#6d6559] transition-colors duration-200 group-hover:bg-[#c07057] group-hover:text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M9 12l2 2 4-4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </span>
              <span className="font-semibold text-sm">Pending Todos</span>
            </NavLink>
            <NavLink
              to="/CompletedTodo"
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-3xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-[#1a2438] text-white shadow-[0_16px_40px_-28px_rgba(0,0,0,0.8)]"
                    : "bg-white text-[#2c2416] hover:bg-[#f8e7de] hover:text-[#2c2416] border border-[#e8dfd6]"
                }`
              }
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e8ddd3] text-[#6d6559] transition-colors duration-200 group-hover:bg-[#c07057] group-hover:text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <span className="font-semibold text-sm">Completed Todos</span>
            </NavLink>
            <NavLink
              to="/PendingSubTodo"
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-3xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-[#1a2438] text-white shadow-[0_16px_40px_-28px_rgba(0,0,0,0.8)]"
                    : "bg-white text-[#2c2416] hover:bg-[#f8e7de] hover:text-[#2c2416] border border-[#e8dfd6]"
                }`
              }
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e8ddd3] text-[#6d6559] transition-colors duration-200 group-hover:bg-[#c07057] group-hover:text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M9 12l2 2 4-4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </span>
              <span className="font-semibold text-sm">Pending subTodos</span>
            </NavLink>

            <NavLink
              to="/CompletedSubTodo"
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-3xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-[#1a2438] text-white shadow-[0_16px_40px_-28px_rgba(0,0,0,0.8)]"
                    : "bg-white text-[#2c2416] hover:bg-[#f8e7de] hover:text-[#2c2416] border border-[#e8dfd6]"
                }`
              }
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e8ddd3] text-[#6d6559] transition-colors duration-200 group-hover:bg-[#c07057] group-hover:text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <span className="font-semibold text-sm">Completed SubTodo</span>
            </NavLink>
            {user.access.includes("Order") && (
              <NavLink
                to="/Order"
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-3xl px-4 py-3 transition-all duration-200 ${
                    isActive
                      ? "bg-[#1a2438] text-white shadow-[0_16px_40px_-28px_rgba(0,0,0,0.8)]"
                      : "bg-white text-[#2c2416] hover:bg-[#f8e7de] hover:text-[#2c2416] border border-[#e8dfd6]"
                  }`
                }
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e8ddd3] text-[#6d6559] transition-colors duration-200 group-hover:bg-[#c07057] group-hover:text-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <span className="font-semibold text-sm">Order</span>
              </NavLink>
            )}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-3xl px-4 py-3 transition-all duration-200 ${
                    isActive
                      ? "bg-[#1a2438] text-white shadow-[0_16px_40px_-28px_rgba(0,0,0,0.8)]"
                      : "bg-white text-[#2c2416] hover:bg-[#f8e7de] hover:text-[#2c2416] border border-[#e8dfd6]"
                  }`
                }
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e8ddd3] text-[#6d6559] transition-colors duration-200 group-hover:bg-[#c07057] group-hover:text-white">
                  <path d="M20 6L9 17l-5-5" />
                </span>
                <span className="font-semibold text-sm">Admin</span>
              </NavLink>
            )}
          </nav>
        </div>
      </div>
      <div className="flex-1 md:ml-64 min-h-screen bg-[#edeae4] flex flex-col items-center px-6 py-12">
        {/* ── Page content capped at 4xl for table breathing room ── */}
        <div className="w-full max-w-4xl">
          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-3">
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="flex items-center gap-3 rounded-full border border-[#d5cfc6] bg-white py-2 px-3 text-sm text-[#4a3f33] hover:border-[#c07057] transition-colors min-w-0"
            >
              {user?.profilePicture ? (
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/${user.profilePicture}`}
                  alt={user.name || "Profile"}
                  className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c07057] text-sm font-semibold text-white flex-shrink-0">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </span>
              )}
              <span className="truncate">{user?.name || "Your profile"}</span>
            </button>

            <button
              onClick={handleLogout}
              className="text-sm text-[#9e9182] hover:text-[#c07057] transition-colors font-medium whitespace-nowrap flex-shrink-0"
            >
              Sign out
            </button>
          </div>

          {/* ── Modals ── */}
          {profileOpen && (
            <ProfileMenu
              user={user}
              onClose={() => setProfileOpen(false)}
              onEdit={() => {
                setProfileOpen(false);
                setEditOpen(true);
              }}
            />
          )}
          {editOpen && (
            <EditProfileMenu user={user} onClose={() => setEditOpen(false)} />
          )}

          {/* ── Title ── */}
          <div className="text-center mb-10">
            <h1
              className="text-4xl sm:text-5xl font-bold text-[#2c2416] tracking-tight"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Terra Focus
            </h1>
            <p className="text-[#7a6e5f] mt-2 text-base">{subtitle}</p>
          </div>

          <div className="mb-6">
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New entry
            </button>

            {showForm && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 px-4 py-6">
                <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-4 shadow-2xl max-h-[calc(100vh-6rem)] overflow-hidden">
                  <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
                    <TodoForm
                      setTodos={setTodos}
                      isSubTodo={false}
                      parentUser={user.parentUser}
                      todoId={null}
                      closeForm={() => setShowForm(false)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* ── Empty state — only when truly no todos at all ── */}
          {Todos.length === 0 && (
            <div className="flex flex-col items-center mt-16 gap-2">
              <span className="text-4xl">🌿</span>
              <p className="text-[#7a6e5f] italic font-semibold text-lg">
                A clear mind awaits.
              </p>
              <p className="text-[#9e9182] text-sm">
                Add your first task above.
              </p>
            </div>
          )}

          {/* ── Pending todos ── */}
          {pendingTodos.length > 0 && (
            <TodoList
              Todos={pendingTodos}
              setTodos={setTodos}
              isSubTodo={false}
              onEditTodo={handleOpenEdit}
              limit={limit}
            />
          )}

          {showEditForm && editingTodo && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 px-4 py-6">
              <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-4 shadow-2xl">
                <EditForm
                  todo={editingTodo}
                  setTodos={setTodos}
                  isSubTodo={false}
                  closeForm={() => {
                    setShowEditForm(false);
                    setEditingTodo(null);
                  }}
                />
              </div>
            </div>
          )}

          {/* ── Completed section ── */}
          <div className="flex items-center gap-100">
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
      </div>
    </div>
  );
}

export default Home;
