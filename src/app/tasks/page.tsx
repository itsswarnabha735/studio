
"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TaskPage = () => {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Task Management</CardTitle>
          <CardDescription>
            Create and manage your household tasks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="taskName">Task Name:</label>
              <Input id="taskName" placeholder="Enter task name" />
            </div>
            <Button>Add Task</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskPage;
