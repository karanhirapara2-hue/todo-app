import * as todoService from "../../services/todo.service";
import * as subTodoService from "../../services/subTodo.services"
import { useNavigate } from "react-router-dom";
import { useEffect ,useState} from "react";
import toast from 'react-hot-toast';
const PRIORITY_STYLES = {
  Easy:   { dot: "bg-green-400",  text: "text-green-800",  bg: "bg-green-50",  border: "border-green-200" },
  Medium: { dot: "bg-yellow-400", text: "text-yellow-800", bg: "bg-yellow-50", border: "border-yellow-200" },
  Hard:   { dot: "bg-red-400",    text: "text-red-800",    bg: "bg-red-50",    border: "border-red-200"   },
};

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

function TodoItem({ todo, setTodos, isSubTodo, index, onEdit }) {
  console.log(todo)
  const navigate = useNavigate();
  const [subTodoCount,setSubTodoCount] =useState(0);
  const [confirmAction, setConfirmAction] = useState(null); // 'delete' or 'complete'
  const handleToggle = async () => {
    try {
      let res;
      if(isSubTodo){
               res = await subTodoService.updateSubTodo(
              todo.parentTodoId,
             todo._id,
             { completed: !todo.completed }
            );
      }
      else{
        res = await todoService.updateTodo(todo._id, { completed: !todo.completed });
      }
      setTodos((prev) => prev.map((t) => (t._id === todo._id ? res.data.data : t)));
      
      toast.success(todo.completed ? "Todo marked as incomplete" : "Todo marked as complete");
      setConfirmAction(null);
    } catch (error) {
      toast.error("Failed to update todo ❌");
    }
  };

  const handleDelete = async () => {
    try {
      if(isSubTodo){
        const res = await subTodoService.deleteSubTodo(todo.parentTodoId,todo._id);
      }
      else{
      await todoService.deleteTodo(todo._id);
      }
      setTodos((prev) => prev.filter((t) => t._id !== todo._id));
      
      toast.success("Todo deleted successfully");
      setConfirmAction(null);
    } catch (error) {
      toast.error("Failed to delete todo ❌");
    }
  };
   
 
const today = new Date();
today.setHours(0, 0, 0, 0);
  const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < today;

  const p = PRIORITY_STYLES[todo.priority] || PRIORITY_STYLES.Easy;
  const num = String(index + 1).padStart(2, "0");

  return (
    <>
    <tr className={`border-b border-[#ece7df] last:border-b-0 hover:bg-[#f7f4f0] transition-colors ${isOverdue ? 'bg-red-50' : ''}`}>

      {/* № */}
      <td className="py-5 pl-6 pr-3 align-middle w-16">
        <span className="text-[#9c8f82] italic text-sm font-light">{num}</span>
      </td>

      {/* Title & Notes */}
      <td className="py-5 px-3 align-middle">
        <>
          <p className={`font-bold text-[#1e2a3a] text-base leading-snug ${todo.completed ? "line-through text-[#9e9182]" : ""}`}>
            {todo.title}
          </p>
          {todo.description && (
            <p className={`text-sm mt-0.5 ${todo.completed ? "line-through text-[#b0a89e]" : "text-[#9c8f82]"}`}>
              {todo.description}
            </p>
          )}
        </>
      </td>

      {/* Priority */}
      <td className="py-5 px-3 align-middle w-32">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide border ${p.bg} ${p.text} ${p.border}`}>
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${p.dot}`} />
          {todo.priority?.toUpperCase()}
        </span>
      </td>

      {/* Due */}
      <td className="py-5 px-3 align-middle w-36">
        <span className={`flex items-center gap-2 text-sm whitespace-nowrap ${isOverdue ? 'text-red-600' : 'text-[#4a3f33]'}`}>
          <svg className="w-4 h-4 text-[#9c8f82] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          {formatDate(todo.dueDate)}
        </span>
      </td>

      {/* Tasks — hidden for subTodo */}
      {!isSubTodo && (
        <td className="py-5 px-3 align-middle w-28">
          <span
             onClick={() => navigate(`/PendingSubTodo/${todo._id}`)}
           className="inline-flex flex-col items-center justify-center gap-0.5 w-16 h-14   text-[#7a6e5f]"
           >
            
            <span className="text-sm font-bold text-[#4a3f33]">{todo.task  || 0}</span>

          </span>
        </td>
      )}

      {/* Actions */}
      <td className="py-5 pl-3 pr-6 align-middle w-32">
        <div className="flex items-center gap-2">

          {/* Check / complete toggle karan */}
                 <button
               onClick={() => {
                //  if (subTodoCount > 0 && !todo.completed) {
                //    toast.error("Complete all subtasks before marking this todo as complete");
                //    return;
                //  }
                 setConfirmAction('complete');
               }}
               className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 ${
               todo.completed
                 ? "bg-green-100 border-green-400 focus:ring-green-400"
                : "bg-gray-100 border-gray-300 hover:bg-gray-200 focus:ring-gray-400"
                 }`}
                 aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                 >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="hidden sm:inline text-xs">{todo.completed ? "Completed" : "Complete"}</span>
               </button>

          {/* Edit — hidden when completed */}
          {!todo.completed && (
            <button
                onClick={onEdit}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border bg-gray-100 border-gray-300 hover:bg-gray-200 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                aria-label="Edit todo"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              
            </button>
          )}

          {/* Delete */}
          <button
            onClick={() => setConfirmAction('delete')}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border bg-red-100 border-red-400 hover:bg-red-200 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Delete todo"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            
          </button>

        </div>
      </td>
    </tr>

    {/* Confirmation Modal */}
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
              onClick={confirmAction === 'delete' ? handleDelete : handleToggle}
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
    </>
  );
}

export default TodoItem;