import { useState } from "react";
import * as todoService from "../../services/todo.service";
import toast from 'react-hot-toast';
import * as subTodoService from "../../services/subTodo.services"

function EditForm({ todo, setTodos, closeForm ,isSubTodo}) {
  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [dueDate, setDueDate] = useState(todo.dueDate);
  const [priority, setPriority] = useState(todo.priority);
  const [error, setError] = useState("");
  const [dueDateError, setDueDateError] = useState("");

  const handleDueDateChange = (value) => {
    setDueDate(value);
    if (value && value < getTodayDate()) {
      setDueDateError("Past dates are not allowed");
    } else {
      setDueDateError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError("Please enter title");
    if (!description.trim()) return setError("Please enter description");
    if (dueDate && dueDate < getTodayDate()) {
      setDueDateError("Past dates are not allowed");
      return;
    }
    setError("");
    setDueDateError("");

    const payload = { title, description, dueDate, priority };

    try {
      if(!isSubTodo){
      const res = await todoService.updateTodo(todo._id, payload);
      setTodos((prev) =>
        prev.map((t) => (t._id === res.data.data._id ? res.data.data : t))
      );
      } 
      else{
        
         const res = await subTodoService.updateSubTodo(todo.parentTodoId,todo._id, payload);
      setTodos((prev) =>
        prev.map((t) => (t._id === res.data.data._id ? res.data.data : t))
      );
      }

      closeForm();
    } catch (err) {
      setError("Something went wrong");
      toast.error("Failed to update todo ❌");
    }
  };

  const priorities = [
    { label: "Easy", dot: "bg-green-400" },
    { label: "Medium", dot: "bg-yellow-400" },
    { label: "Hard", dot: "bg-red-400" },
  ];

  return (
    <div className="bg-[#ede8e1] rounded-2xl px-6 py-5 shadow-sm mb-6 space-y-5">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold text-[#2e2416]">Edit task</h2>
          <p className="text-sm text-[#9c8f82] mt-0.5">Update the selected task.</p>
        </div>
        <button
          onClick={closeForm}
          className="text-[#9c8f82] hover:text-[#4a3f33] text-xl leading-none"
        >
          ✕
        </button>
      </div>

     

      {/* Title */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-[#4a3f33]">Title*</label>
        <input
          type="text"
          placeholder="Water the plants"
          value={title}
          onChange={(e) => {setTitle(e.target.value),setError("")}}
          className="w-full bg-[#f5f0ea] border border-[#c9a898] rounded-2xl px-4 py-3 text-[#4a3f33] placeholder-[#b0a89e] outline-none focus:ring-2 focus:ring-[#c07057]/30"
        />
         {error && (!title.trim()) && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-[#4a3f33]">Description*</label>
        <textarea
          placeholder="A few quiet notes..."
          value={description}
          onChange={(e) => {setDescription(e.target.value),setError("")}}
          rows={3}
          className="w-full bg-[#f5f0ea] border border-[#ddd8d0] rounded-2xl px-4 py-3 text-[#4a3f33] placeholder-[#b0a89e] outline-none resize-none focus:ring-2 focus:ring-[#c07057]/20"
        />
         {error && (!description.trim()) && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {/* Priority */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#4a3f33]">Priority</label>
        <div className="flex gap-2">
          {priorities.map(({ label, dot }) => (
            <button
              key={label}
              type="button"
              onClick={() => setPriority(label)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm border transition ${
                priority === label
                  ? "bg-[#f5f0ea] border-[#c9a898] text-[#4a3f33] font-medium"
                  : "bg-[#f5f0ea] border-transparent text-[#7a6e5f]"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${dot}`} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Due Date */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-[#4a3f33]">Due date</label>
        <input
          type="date"
          min={getTodayDate()}
          value={dueDate}
          onChange={(e) => handleDueDateChange(e.target.value)}
          aria-invalid={!!dueDateError}
          className="w-full bg-[#f5f0ea] border border-[#ddd8d0] rounded-2xl px-4 py-3 text-[#4a3f33] outline-none focus:ring-2 focus:ring-[#c07057]/20"
        />
        {dueDateError && <p className="text-red-500 text-sm mt-1">{dueDateError}</p>}
        
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-1">
        <button
          type="button"
          onClick={closeForm}
          className="text-sm text-[#7a6e5f] px-4 py-2"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-[#c07057] hover:bg-[#a85e47] text-white text-sm font-medium px-6 py-2.5 rounded-2xl transition-colors"
        >
          Update task
        </button>
      </div>
    </div>
  );
}

export default EditForm;