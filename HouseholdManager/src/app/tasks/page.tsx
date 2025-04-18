"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  name: string;
  assignees: string[];
  householdId: string;
}

interface Household {
  id: string;
  name: string;
}

const TaskPage = () => {
  const router = useRouter();
    const { toast } = useToast();
  const [taskName, setTaskName] = useState("");
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string | null>(null);
  const [householdMembers, setHouseholdMembers] = useState<string[]>([]);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }

    const storedHouseholds = localStorage.getItem("households");
    if (storedHouseholds) {
      const parsedHouseholds = JSON.parse(storedHouseholds);
      setHouseholds(parsedHouseholds);
      if (parsedHouseholds.length > 0) {
        setSelectedHouseholdId(parsedHouseholds[0].id);
      }
    }

    const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
      }
  }, []);

  useEffect(() => {
      localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (selectedHouseholdId) {
      // Fetch household members (dummy data, replace with actual logic)
      setHouseholdMembers([userName || 'You', "Spouse", "Child"]);
    } else {
      setHouseholdMembers([]);
    }
  }, [selectedHouseholdId, userName]);

  const handleAddTask = () => {
    if (!selectedHouseholdId) {
      toast({
        title: "Error",
        description: "Please select a household.",
      });
      return;
    }

    if (taskName && selectedAssignees.length > 0) {
      const newTask: Task = {
        id: Math.random().toString(36).substring(7), // Unique ID
        name: taskName,
        assignees: selectedAssignees,
        householdId: selectedHouseholdId,
      };
      setTasks([...tasks, newTask]);
      setTaskName("");
      setSelectedAssignees([]);
        toast({
            title: "Task Created",
            description: `Task "${taskName}" created successfully!`,
        });
    }
  };

  const toggleAssignee = (member: string) => {
    if (selectedAssignees.includes(member)) {
      setSelectedAssignees(selectedAssignees.filter((assignee) => assignee !== member));
    } else {
      setSelectedAssignees([...selectedAssignees, member]);
    }
  };

  if (!userName) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to access task management.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>You need to log in to create or manage tasks.</p>
            <Button onClick={() => router.push("/login")}>Log In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

    const userTasks = tasks.filter(task => task.householdId === selectedHouseholdId && task.assignees.includes(userName || 'You'));
    const otherTasks = tasks.filter(task => task.householdId === selectedHouseholdId && !task.assignees.includes(userName || 'You'));


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
          {households.length === 0 ? (
            <p>
              You must create or join a household first. Go to the{" "}
              <Button variant="link" onClick={() => router.push("/household")}>
                Household
              </Button>{" "}
              tab to manage households.
            </p>
          ) : (
            <>
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
                  <Label htmlFor="household">Household:</Label>
                  <Select value={selectedHouseholdId || ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a household" />
                    </SelectTrigger>
                    <SelectContent>
                      {households.map((household) => (
                        <SelectItem
                          key={household.id}
                          value={household.id}
                          onSelect={() => setSelectedHouseholdId(household.id)}
                        >
                          {household.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedHouseholdId && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              )}
              <Button onClick={handleAddTask} disabled={!taskName || selectedAssignees.length === 0 || !selectedHouseholdId}>
                Add Task
              </Button>
            </>
          )}
        </CardContent>
      </Card>

        {selectedHouseholdId && (
            <>
                {userTasks.length > 0 && (
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Tasks Assigned to You</CardTitle>
                            <CardDescription>These tasks are assigned to you.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul>
                                {userTasks.map((task) => (
                                    <li key={task.id} className="py-2 border-b">
                                        {task.name} (Assigned to: {task.assignees.join(", ")})
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {otherTasks.length > 0 && (
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Tasks Assigned to Others</CardTitle>
                            <CardDescription>These tasks are assigned to other household members.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul>
                                {otherTasks.map((task) => (
                                    <li key={task.id} className="py-2 border-b">
                                        {task.name} (Assigned to: {task.assignees.join(", ")})
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {userTasks.length === 0 && otherTasks.length === 0 && (
                    <Card className="mt-6">
                        <CardContent>
                            No tasks created for this household yet.
                        </CardContent>
                    </Card>
                )}
            </>
        )}
    </div>
  );
};

export default TaskPage;
