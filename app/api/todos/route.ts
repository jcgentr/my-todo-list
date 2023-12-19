import { Todo } from "../../lib/types";

// In-memory array of todos
let todos: Todo[] = [
  {
    id: 0,
    title: "buy milk",
    completed: false,
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const todo = todos.find((todo) => todo.id === parseInt(id));
    if (todo) {
      return Response.json(todo);
    } else {
      return Response.json({ message: "Todo not found" }, { status: 404 });
    }
  }

  return Response.json(todos);
}

export async function POST(request: Request) {
  const payload = await request.json();

  if (payload.title) {
    const newTodo: Todo = {
      id: todos.length + 1,
      title: payload.title,
      completed: false,
    };
    todos.push(newTodo);
    return Response.json(newTodo, { status: 201 });
  }

  return Response.json({ message: "Provided todo not valid" }, { status: 400 });
}

export async function PUT(request: Request) {
  const payload = await request.json();

  if (payload.title) {
    const updatedTodo: Todo = {
      id: parseInt(payload.id),
      title: payload.title,
      completed: payload.completed,
    };
    todos = todos.map((todo) =>
      todo.id === updatedTodo.id ? { ...updatedTodo } : todo
    );
    return Response.json(updatedTodo, { status: 200 });
  }
  return Response.json({ message: "Invalid payload" }, { status: 400 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    todos = todos.filter((todo) => todo.id !== parseInt(id));
    return Response.json({ message: "Todo deleted" }, { status: 200 });
  }

  return Response.json({ message: "No id provided." }, { status: 400 });
}
