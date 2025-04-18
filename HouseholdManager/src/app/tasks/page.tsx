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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, setHours, setMinutes } from "date-fns";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  name: string;
  assignees: string[];
  householdId: string;
  deadline: Date | null;
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
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<{ hour: number; minute: number }>({ hour: 0, minute: 0 });

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

    if (!taskName) {
      toast({
        title: "Error",
        description: "Please enter the task name.",
      });
      return;
    }

    if (selectedAssignees.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one assignee.",
      });
      return;
    }

    let deadline: Date | null = null;
    if (date) {
      deadline = setHours(setMinutes(date, time.minute), time.hour);
    }

    const newTask: Task = {
      id: Math.random().toString(36).substring(7),
      name: taskName,
      assignees: selectedAssignees,
      householdId: selectedHouseholdId,
      deadline: deadline,
    };
    setTasks([...tasks, newTask]);
    setTaskName("");
    setSelectedAssignees([]);
    setDate(undefined);
    setTime({ hour: 0, minute: 0 });
    toast({
      title: "Task Created",
      description: `Task "${taskName}" created successfully!`,
    });
  };

  const toggleAssignee = (member: string) => {
    if (selectedAssignees.includes(member)) {
      setSelectedAssignees(selectedAssignees.filter((assignee) => assignee !== member));
    } else {
      setSelectedAssignees([...selectedAssignees, member]);
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        options.push({
          hour: h,
          minute: m,
          display: `${h}:${m === 0 ? '00' : m}`
        });
      }
    }
    return options;
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
              You must create or join a household first. Go to the
              <Button variant="link" onClick={() => router.push("/household")}>
                Household
              </Button>
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
                  <div>
                    <Label>Deadline:</Label>
                    <div className="flex flex-col md:flex-row gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={false}
                          />
                        </PopoverContent>
                      </Popover>
                      <Select onValueChange={(value) => {
                        const [hour, minute] = value.split(':').map(Number);
                        setTime({ hour, minute });
                      }} value={`${time.hour}:${time.minute}`}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {generateTimeOptions().map((timeOption) => (
                            <SelectItem key={`${timeOption.hour}:${timeOption.minute}`} value={`${timeOption.hour}:${timeOption.minute}`}>
                              {timeOption.display}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      {task.deadline && (
                        <div className="text-sm text-muted-foreground">
                          Deadline: {format(task.deadline, "PPP h:mm a")}
                        </div>
                      )}
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
                      {task.deadline && (
                        <div className="text-sm text-muted-foreground">
                          Deadline: {format(task.deadline, "PPP h:mm a")}
                        </div>
                      )}
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
