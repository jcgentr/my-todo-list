"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { Todo } from "./lib/types";

// follows: https://inclusive-components.design/a-todo-list/

export default function Page() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoInput, setTodoInput] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch("/api/todos");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
      setIsFetching(false);
    };

    fetchTodos();
  }, []);

  const isTodosListEmpty = todos.length === 0;
  const isInvalidInput = todoInput.length === 0;

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTodo = {
      title: todoInput,
    };

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const newlyAddedTodo = await response.json();
      setTodos([...todos, newlyAddedTodo]);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }

    setTodoInput("");
  };

  const handleCompleteTodo = async (todo: Todo) => {
    try {
      const response = await fetch("/api/todos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...todo, completed: !todo.completed }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const updatedTodo = await response.json();
      const currTodos = todos.map((todo) =>
        todo.id === updatedTodo.id ? { ...updatedTodo } : todo
      );
      setTodos(currTodos);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      const response = await fetch(`/api/todos?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const currTodos = todos.filter((todo) => todo.id !== id);
      setTodos(currTodos);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  return (
    <Wrapper aria-labelledby="todos-label">
      <h1 tabIndex={-1} id="todos-label" className="text-9xl font-bold m-12">
        My Todo List
      </h1>

      <form onSubmit={handleAddTodo} className="m-8">
        <input
          type="text"
          name="todoInput"
          aria-invalid={isInvalidInput}
          aria-label="Write a new todo item"
          placeholder="E.g. Adopt an owl"
          onChange={(e) => setTodoInput(e.target.value)}
          value={todoInput}
          className="text-4xl py-2 px-4 rounded border-2 border-black"
        />
        <AddButton
          type="submit"
          disabled={isInvalidInput}
          className="text-4xl py-2 px-4 rounded border-2 border-black"
        >
          Add
        </AddButton>
      </form>

      <EmptyStateWrapper className={isTodosListEmpty ? "block" : "hidden"}>
        {isFetching ? (
          <p>Loading your todos...</p>
        ) : (
          <p>Your todo list is empty. Add your first todo &#x2191;</p>
        )}
      </EmptyStateWrapper>

      <TodosList className="text-6xl m-8">
        {todos.map((todo) => (
          <li key={todo.id} className="m-4 flex gap-5 items-center">
            <input
              type="checkbox"
              id={`todo-${todo.id}`}
              checked={todo.completed}
              onChange={() => handleCompleteTodo(todo)}
              className="mt-2"
            />
            <label htmlFor={`todo-${todo.id}`} className="truncate">
              {todo.title}
            </label>
            <button
              aria-label={`delete ${todo.title}`}
              onClick={() => handleDeleteTodo(todo.id)}
              className="mt-1"
            >
              <svg width="40" height="40">
                <use href="#bin-icon"></use>
              </svg>
            </button>
          </li>
        ))}
      </TodosList>

      <div role="status" aria-live="polite" className="sr-only">
        {/* add content to hear it spoken; add notification here */}
      </div>
    </Wrapper>
  );
}

const TodosList = styled.ul`
  &:empty {
    display: none;
  }
`;

const EmptyStateWrapper = styled.div`
  border: 2px solid #000;
  padding: 10px;
  width: fit-content;
  font-size: 1.75rem;
  margin-left: 2rem;
`;

const AddButton = styled.button`
  background: #000;
  color: #fff;

  &:disabled {
    opacity: 0.33;
  }
`;

const Wrapper = styled.section`
  max-width: 1000px;
  margin: 0 auto;
`;
