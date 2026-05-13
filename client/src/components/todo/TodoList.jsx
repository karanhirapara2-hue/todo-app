import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import * as subTodoService from "../../services/subTodo.services"
function TodoList({ Todos,limit, setTodos, isSubTodo, onEditTodo }) {
  console.log(Todos);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [Dir, setDir] = useState(0);
  const [Current, setCurrent] = useState("");
  const [listTodo,setListTodo]=useState(Todos);
  useEffect(() => {
  if (isSubTodo) {
    setListTodo(Todos); // ← keep in sync for subTodos
    return;
  }

  const fetchSubTodoCounts = async () => {
    const counts = await Promise.all(
      Todos.map((todo) =>
        subTodoService
          .getSubTodos(todo._id, false)
          .then((res) => ({ id: todo._id, task: res.data.data.subTodos.length }))
          .catch(() => ({ id: todo._id, task: 0 }))
      )
    );

    // ✅ Start from fresh Todos, then patch task count
    setListTodo(
      Todos.map((todo) => {
        const found = counts.find((c) => c.id === todo._id);
        return found ? { ...todo, task: found.task } : todo;
      })
    );
  };

  fetchSubTodoCounts();
}, [limit, Todos]);
  const keyMap = {
    "TITLE & NOTES": "title",
    PRIORITY: "priority",
    DUE: "dueDate",
    TASKS:"task"
  };

  const priorityMap = {
    Easy: 1,
    Medium: 2,
    Hard: 3,
  };
  useEffect(() => {
    setDir(0);
  }, [Current]);

  const counts = {
    ALL: Todos.length,
    EASY: Todos.filter((t) => t.priority === "Easy").length,
    MEDIUM: Todos.filter((t) => t.priority === "Medium").length,
    HARD: Todos.filter((t) => t.priority === "Hard").length,
  };

  const filtered = listTodo.filter((t) => {
    const matchPriority =
      filter === "ALL" ||
      (filter === "EASY" && t.priority === "Easy") ||
      (filter === "MEDIUM" && t.priority === "Medium") ||
      (filter === "HARD" && t.priority === "Hard");

    const matchSearch =
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase());

    return matchPriority && matchSearch;
  });

  const handleSort = (label) => {
    const key = keyMap[label];

    const sorted = [...listTodo].sort((a, b) => {
      let valA = a[key];
      let valB = b[key];
      
      // Handle priority mapping
      if (key === "priority") {
        valA = priorityMap[valA];
        valB = priorityMap[valB];
      }

      // Handle string (title)
      if (key === "title") {
        return Dir ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      if (key === "dueDate") {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      // Handle numbers / dates
      return Dir ? valA - valB : valB - valA;
    });

    setListTodo(sorted); // update state
  };
 
  return (
    <div className="space-y-4">
      {/* Filter Bar + Search — same row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] tracking-[0.2em] text-[#9c8f82] font-medium mr-1">
          FILTER:
        </span>

        {["ALL", "EASY", "MEDIUM", "HARD"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest border transition-all ${
              filter === f
                ? "bg-[#1e2a3a] text-white border-[#1e2a3a]"
                : "bg-transparent text-[#4a3f33] border-[#d5cfc6] hover:border-[#4a3f33]"
            }`}
          >
            {f}
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                filter === f
                  ? "bg-white text-[#1e2a3a]"
                  : "bg-[#e8e3db] text-[#7a6e5f]"
              }`}
            >
              {counts[f]}
            </span>
          </button>
        ))}

        {/* Search pushed to the right on the same row */}
        <div className="flex items-center gap-2 bg-[#f0ece6] border border-[#e0dbd3] rounded-full px-4 py-2 ml-auto min-w-0 max-w-full flex-1">
          <svg
            className="w-4 h-4 text-[#9c8f82] flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search the ledger..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-[#4a3f33] placeholder-[#b0a89e] outline-none w-full min-w-0"
          />
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="border-2 border-dashed border-[#d5cfc6] rounded-2xl flex flex-col items-center justify-center py-24 mt-2">
          <span className="text-4xl mb-4">🌿</span>
          <p className="font-serif italic text-[#2e2416] text-xl mb-1">
            The ledger is empty.
          </p>
          <p className="text-[#9c8f82] text-sm">
            Press <strong className="text-[#4a3f33]">New entry</strong> to
            begin.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#1e2a3a] mt-2">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-[#1e2a3a]">
                {[
                  { label: "№", cls: "w-16 pl-6" },
                  { label: "TITLE & NOTES", cls: "w-auto" },
                  { label: "PRIORITY", cls: "w-32" },
                  { label: "DUE", cls: "w-36" },
                  ...(!isSubTodo ? [{ label: "TASKS", cls: "w-28" }] : []),
                  { label: "ACTIONS", cls: "w-32 pr-6" },
                ].map(({ label, cls }) => (
                  <th
                    key={label}
                    className={`text-[10px] tracking-widest text-[#9c8f82] font-semibold py-4 px-3 text-left ${cls}`}
                    onClick={() => {
                      (setCurrent(label), setDir(!Dir), handleSort(label));
                    }}
                  >
                    {label}{" "}
                    {label !== "№" &&
                      label !== "ACTIONS" &&
                      label === Current && (
                        <span className="text-lg ml-1">{!Dir ? "↓" : "↑"}</span>
                      )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((todo, i) => (
                <TodoItem
                  key={todo._id}
                  todo={todo}
                  index={i}
                  setTodos={setTodos}
                  isSubTodo={isSubTodo}
                  onEdit={() => onEditTodo && onEditTodo(todo)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TodoList;
