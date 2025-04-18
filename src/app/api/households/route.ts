import { NextResponse } from 'next/server';

interface Household {
  id: string;
  name: string;
}

// In-memory store for households (for demonstration purposes)
let households: Household[] = [
  { id: '1', name: 'Initial Household' }, // Add an initial household
];

export async function GET(request: Request) {
  return NextResponse.json(households);
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return new NextResponse(JSON.stringify({ message: 'Household name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newHousehold: Household = {
      id: Math.random().toString(36).substring(7),
      name: name,
    };

    households.push(newHousehold);

    return new NextResponse(JSON.stringify(newHousehold), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating household:', error);
    return new NextResponse(JSON.stringify({ message: 'Failed to create household' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
