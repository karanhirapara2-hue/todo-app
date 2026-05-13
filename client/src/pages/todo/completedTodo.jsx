import TodoForm from "../../components/todo/TodoForm";
import TodoList from "../../components/todo/TodoList";
import EditForm from "../../components/todo/EditTodo";
import AppLayout from "../../components/common/AppLayout";
import { useSelector, useDispatch } from 'react-redux';
import * as todoService from "../../services/todo.service";
import { useEffect, useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Pagination from "../../components/common/pagination";
import * as adminService from "../../services/admin.services";


function CompletedTodo() {
  const navigate = useNavigate();
 
  const [Todos, setTodos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const dispatch = useDispatch();
  const [confirmAction, setConfirmAction] = useState(null);
   const [page,setPage]=useState(1);
    const [limit,setLimit]=useState(3);
   const [activePage,setActivePage]=useState(1);
    const [cur,setCur]=useState(1);
    const [vis1,setVis1]=useState(true);
    const [vis2,setVis2]=useState(true);
    const [totalPage,setTotalPage]=useState(1);
    const { userId } = useParams();
 const pendingTodos   = Todos.filter((t) =>  t.completed);
 
 useEffect(() => {
  if (userId) {
    adminService
      .getTodosAdmin(true, page, limit, userId)
      .then((res) => {
        setTodos(res.data.data.todos);
        setTotalPage(res.data.data.totalPage);
      })
      .catch((error) => {
        toast.error("Failed to fetch todos ❌");
      });
  } else {
    todoService.getTodos(true,page,limit).then((res) => {
      setTodos(res.data.data.todos);
      setTotalPage(res.data.data.totalPage);
    }).catch((error) => {
      toast.error("Failed to fetch todos ❌");
    });
  }
  },[page,limit,pendingTodos?.length]);

  
   
    const handlelimit=(value)=>{
    
     setLimit(value);
     setCur(1);
     
     setPage(1);
  }

  
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = showForm || showEditForm ? "hidden" : "";
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, [showForm, showEditForm]);

 

  const handleOpenEdit = (todo) => {
    setShowForm(false);
    setEditingTodo(todo);
    setShowEditForm(true);
  };

  const handleAllDelete= async()=>{
     try {
      setConfirmAction(null)
      if(userId){
       await adminService.deleteAllCompletedTodosAdmin(userId);
      }
      else{
        await todoService.deleteAllTodo();
      }
       setTodos([]);
      toast.success("Todos deleted successfully ✅");
      
    } catch (err) {
      setError("Something went wrong");
      toast.error("Failed to deleted Todos ❌");
    }
  }

  const subtitle =
    pendingTodos.length === 0
      ? "Nothing on your plate — enjoy the calm."
      : `${pendingTodos.length} task${pendingTodos.length > 1 ? "s" : ""} remaining`;
  
      const Fun = () => {
        return (
          <div className="w-full max-w-4xl">

        {/* ── Header ── */}
       

        {/* ── Modals ── */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setConfirmAction('delete')}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear All
          </button>
        </div>

        {/* ── Title ── */}
       

      <div className="mb-6">

        {showForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 px-4 py-6">
            <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-4 shadow-2xl max-h-[calc(100vh-6rem)] overflow-hidden">
              <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
                <TodoForm
                  setTodos={setTodos}
                  isSubTodo={false}
                  todoId={null}
                  closeForm={() => setShowForm(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
        {/* ── Empty state — only when truly no todos at all ── */}
        {pendingTodos.length === 0 && (
          <div className="flex flex-col items-center mt-16 gap-2">
            <span className="text-4xl">🌿</span>
            <p className="text-[#7a6e5f] italic font-semibold text-lg">A clear mind awaits.</p>
            <p className="text-[#9e9182] text-sm">Add your first task above.</p>
          </div>
        )}

        {/* ── Pending todos ── */}
        {pendingTodos.length > 0 && (
          <TodoList Todos={pendingTodos} setTodos={setTodos} isSubTodo={false} onEditTodo={handleOpenEdit} />
        )}

        {showEditForm && editingTodo && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 px-4 py-6">
            <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-4 shadow-2xl">
              <EditForm
                todo={editingTodo}
                setTodos={setTodos}
                closeForm={() => {
                  setShowEditForm(false);
                  setEditingTodo(null);
                }}
              />
            </div>
          </div>
        )}

        {/* ── Completed section ── */}
        {confirmAction && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
        <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
          <h3 className="text-lg font-semibold text-[#2c2416] mb-4">
            {confirmAction === 'delete' ? 'Delete Todo' : 'Complete Todo'}
          </h3>
          <p className="text-[#7a6e5f] mb-6">
            {confirmAction === 'delete'
              ? 'Are you sure you want to delete this todo? This action cannot be undone.'
              : `Are you sure you want to mark this todo as ${todo.completed ? 'incomplete' : 'complete'}?`
            }
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setConfirmAction(null)}
              className="flex-1 px-4 py-2 rounded-xl border border-[#d5cfc6] bg-white text-[#4a3f33] hover:bg-[#f7f4f0] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmAction === 'delete' ? handleAllDelete : handleToggle}
              className={`flex-1 px-4 py-2 rounded-xl text-white transition-colors ${
                confirmAction === 'delete'
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-[#c07057] hover:bg-[#a85e47]'
              }`}
            >

      
              {confirmAction === 'delete' ? 'Delete' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    )}
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
        );
      };

      return (
        <>
          {userId ? (
            <>
              <button
                onClick={() => window.history.back()}
                className="mb-4 flex items-center gap-2 px-4 py-2 rounded-full 
                 bg-gray-200 text-gray-700 text-sm font-medium
                 hover:bg-gray-300 hover:text-black 
                 transition-all duration-200"
              >
                ← Back
              </button>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
              >
                <Fun />
              </div>
            </>
          ) : (
            <AppLayout>
              <Fun />
            </AppLayout>
          )}
        </>
      );
}

export default CompletedTodo;