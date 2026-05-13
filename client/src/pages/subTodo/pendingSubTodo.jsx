import TodoForm from "../../components/todo/TodoForm";
import TodoList from "../../components/todo/TodoList";
import EditForm from "../../components/todo/EditTodo";
import AppLayout from "../../components/common/AppLayout";
import { useSelector, useDispatch } from 'react-redux';
import * as todoService from "../../services/todo.service";
import * as subTodoService from "../../services/subTodo.services"
import * as adminService from "../../services/admin.services"
import { useEffect, useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';

import toast from 'react-hot-toast';
import Pagination from "../../components/common/pagination"

function PendingSubTodo() {
    const { todoId } = useParams();
    
    
  const navigate = useNavigate();
 
  const [Todos, setTodos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
 const [subTodos, setSubTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [Value, setValue] = useState("");
 
  const [page,setPage]=useState(1);
  const [limit,setLimit]=useState(3);
 const [cur,setCur]=useState(1);
  const [totalPage,setTotalPage] = useState(1);
  const [activePage,setActivePage]=useState(1);
  const {userId}=useParams();

  useEffect(() => {
    if(userId){
      
      adminService.getTodosAdmin(3,1,10,userId).then((res) => {
        setTodos(res.data.data.todos);
        
      }).catch((error) => {
        toast.error("Failed to fetch todos ❌");
      });
    }
    else{
    todoService.getTodos(3).then((res) => {
      setTodos(res.data.data.todos);
      
    }).catch((error) => {
      toast.error("Failed to fetch todos ❌");
    });
  }
  },[]);
  
     useEffect(() => {
      if(todoId){
        setValue(todoId);
      }  
      
    },[Todos]);
  
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = showForm || showEditForm ? "hidden" : "";
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, [showForm, showEditForm]);

   const pendingTodos=subTodos.filter((t) => !t.completed);
    
  useEffect(() => {
    if(Value){
      
      subTodoService.getSubTodos(Value,false,page,limit).then((res) => {
      
         setSubTodos(res.data.data.subTodos);
         
         setTotalPage(res.data.data.totalPage);
      }).catch((error) => {
        toast.error("Failed to fetch sub-todos ❌");
      });
    // setpendingTodos(subTodos.filter((t) => (!t.completed) && (t.parentTodoId==value)));
    }
    else{
      if(userId){
        adminService.getAllSubTodosAdmin(false,page,limit,userId).then((res) => {
       
          setSubTodos(res.data.data.subTodos);
         
          setTotalPage(res.data.data.totalPage);
          
       }).catch((error) => {
         toast.error("Failed to fetch sub-todos ❌");
       });
      }
      else{
      subTodoService.getAllSubTodo(false,page,limit).then((res) => {
       
         setSubTodos(res.data.data.subTodos);
        
         setTotalPage(res.data.data.totalPage);
         
      }).catch((error) => {
        toast.error("Failed to fetch sub-todos ❌");
      });
    }
    }
  },[Value,limit,page,pendingTodos?.length]);


  
  const handleOpenEdit = (todo) => {
    setShowForm(false);
    setEditingTodo(todo);
    setShowEditForm(true);
  };

  

  const handlelimit=(value)=>{
    
     setLimit(value);
     setCur(1);
     
     setPage(1);
  }
  

  const subtitle =
    pendingTodos.length === 0
      ? "Nothing on your plate — enjoy the calm."
      : `${pendingTodos.length} task${pendingTodos.length > 1 ? "s" : ""} remaining`;
  
      const Fun = () => {
        return (
          <div className="w-full max-w-4xl">
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New entry
            </button>
            
           <div className="relative">
             <select 
               value={Value} 
               onChange={(e) => setValue(e.target.value)}
               className="appearance-none bg-[#ddd8cf] rounded-xl px-4 py-3 pr-10 text-[#4a3f33] text-base outline-none focus:ring-2 focus:ring-[#c07057] hover:bg-[#d0ccc3] transition-all duration-200 cursor-pointer min-w-[200px]"
             >
               {Todos.map((todo) => (
                 <option key={todo._id} value={todo._id}>
                   {todo.title}
                 </option>
               ))}
             </select>
            
           </div>
            {showForm && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 px-4 py-6">
                <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-4 shadow-2xl max-h-[calc(100vh-6rem)] overflow-hidden">
                  <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
                    <TodoForm
                      setTodos={setSubTodos}
                      isSubTodo={true}
                      userId={userId}
                      todoId={Value || Todos[0]?._id}
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
              <TodoList Todos={pendingTodos} setTodos={setSubTodos} isSubTodo={true} onEditTodo={handleOpenEdit} />
            )}
    
            {showEditForm && editingTodo && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 px-4 py-6">
                <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-4 shadow-2xl">
                  <EditForm
                    todo={editingTodo}
                    setTodos={setSubTodos}
                    isSubTodo={true}
                    closeForm={() => {
                      setShowEditForm(false);
                      setEditingTodo(null);
                    }}
                  />
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
        )
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

export default PendingSubTodo;