

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const API = "http://localhost:5000/todos";

export default function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchTodos = async () => {
    const res = await axios.get(API);
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addOrUpdateTodo = async () => {
    if (!task.trim()) return;

    if (editId) {
      await axios.put(`${API}/${editId}`, { text: task });
      setEditId(null);
    } else {
      await axios.post(API, { text: task });
    }

    setTask("");
    fetchTodos();
  };

  const toggleComplete = async (todo) => {
    await axios.put(`${API}/${todo._id}`, {
      completed: !todo.completed,
    });
    fetchTodos();
  };

  const editTodo = (todo) => {
    setTask(todo.text);
    setEditId(todo._id);
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchTodos();
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to-slate-300 p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2 flex items-center justify-center gap-2">
          <span className="text-green-600">✔</span> Todo List
        </h1>

        <p className="text-center text-sm text-gray-500 mb-8">
          {completedCount} / {todos.length} tasks completed
        </p>

        <div className="flex gap-3 mb-8">
          <Input
            placeholder="Enter a task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addOrUpdateTodo()}
            className={`h-12 rounded-full bg-slate-100 focus:ring-2 focus:ring-purple-500 ${
              editId ? "ring-2 ring-orange-400" : ""
            }`}
          />
          <Button
            onClick={addOrUpdateTodo}
            className="h-12 px-8 rounded-full bg-purple-600 hover:bg-purple-700 text-black font-semibold"
          >
            {editId ? "UPDATE" : "ADD"}
          </Button>
        </div>

        <div className="space-y-4">
          {todos.map((todo) => (
            <div
              key={todo._id}
              className={`group flex items-center justify-between rounded-xl px-5 py-4 shadow-sm transition-all
                ${
                  todo.completed
                    ? "bg-slate-100 opacity-70"
                    : "bg-slate-200 hover:shadow-md"
                }`}
            >
              <div className="flex items-center gap-4">
                {/* ✅ RED TICK CHECKBOX - Fixed */}
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleComplete(todo)}
                  className="
    h-5 w-5
    rounded-md
    border-2 border-red-500
    data-[state=checked]:border-red-600
    data-[state=checked]:bg-transparent
    [&[data-state=checked]>svg]:stroke-red-600
    [&>svg]:h-4
    [&>svg]:w-4
    [&>svg]:stroke-[3px]
  "
                  style={{
                    "--checkbox-color": "red !important",
                  }}
                />

                <span
                  className={`text-lg ${
                    todo.completed
                      ? "line-through text-gray-400"
                      : "text-gray-800 font-medium"
                  }`}
                >
                  {todo.text}
                </span>
              </div>

              <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => editTodo(todo)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="text-purple-600 hover:text-red-600"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}

          {todos.length === 0 && (
            <p className="text-center text-gray-500">
              📋 No tasks yet. Add one ✨
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
