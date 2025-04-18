"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface Task {
  id: string;
  name: string;
  assignees: string[];
}

const TaskPage = () => {
  const [taskName, setTaskName] = useState("");
  const [householdMembers, setHouseholdMembers] = useState<string[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Load household members from localStorage
    const storedHouseholdName = localStorage.getItem("householdName");
    if (storedHouseholdName) {
      setHouseholdMembers([storedHouseholdName, "Spouse"]); // Dummy data
    }
  }, []);

  const handleAddTask = () => {
    if (taskName && selectedAssignees.length > 0) {
      const newTask: Task = {
        id: Math.random().toString(36).substring(7), // Unique ID
        name: taskName,
        assignees: selectedAssignees,
      };
      setTasks([...tasks, newTask]);
      setTaskName("");
      setSelectedAssignees([]);
    }
  };

  const toggleAssignee = (member: string) => {
    if (selectedAssignees.includes(member)) {
      setSelectedAssignees(selectedAssignees.filter((assignee) => assignee !== member));
    } else {
      setSelectedAssignees([...selectedAssignees, member]);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Task Management</CardTitle>
          <CardDescription>
            Create and manage your household tasks.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="taskName">Task Name:</Label>
              <Input
                type="text"
                id="taskName"
                placeholder="Enter task name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            </div>
            <div>
              <Label>Assign to:</Label>
              <div className="flex flex-col space-y-2">
                {householdMembers.map((member) => (
                  <div key={member} className="flex items-center space-x-2">
                    <Checkbox
                      id={member}
                      checked={selectedAssignees.includes(member)}
                      onCheckedChange={() => toggleAssignee(member)}
                    />
                    <Label htmlFor={member}>{member}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Button onClick={handleAddTask} disabled={!taskName || selectedAssignees.length === 0}>
            Add Task
          </Button>
        </CardContent>
      </Card>

      {tasks.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Current Tasks</CardTitle>
            <CardDescription>Tasks created</CardDescription>
          </CardHeader>
          <CardContent>
            <ul>
              {tasks.map((task) => (
                <li key={task.id} className="py-2 border-b">
                  {task.name} (Assigned to: {task.assignees.join(", ")})
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaskPage;
