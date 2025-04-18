import { NextResponse } from 'next/server';

interface Task {
  id: string;
  name: string;
  assignees: string[];
  householdId: string;
  deadline: Date | null;
  createdBy: string;
}

let tasks: Task[] = [];

export async function GET(request: Request) {
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  try {
    const { name, assignees, householdId, deadline, createdBy } = await request.json();

    if (!name || !assignees || !householdId || !createdBy) {
      return new NextResponse(JSON.stringify({ message: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newTask: Task = {
      id: Math.random().toString(36).substring(7),
      name: name,
      assignees: assignees,
      householdId: householdId,
      deadline: deadline ? new Date(deadline) : null,
      createdBy: createdBy,
    };

    tasks.push(newTask);

    return new NextResponse(JSON.stringify(newTask), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return new NextResponse(JSON.stringify({ message: 'Failed to create task' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { name, assignees, deadline } = await request.json();

    if (!name || !assignees) {
      return new NextResponse(JSON.stringify({ message: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    tasks = tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          name: name,
          assignees: assignees,
          deadline: deadline ? new Date(deadline) : null,
        };
      }
      return task;
    });

    return new NextResponse(JSON.stringify({ message: 'Task updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return new NextResponse(JSON.stringify({ message: 'Failed to update task' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    tasks = tasks.filter(task => task.id !== id);

    return new NextResponse(JSON.stringify({ message: 'Task deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return new NextResponse(JSON.stringify({ message: 'Failed to delete task' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

