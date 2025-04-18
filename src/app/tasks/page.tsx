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
import { format, setHours, setMinutes, intervalToDuration, formatDuration } from "date-fns";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  name: string;
  assignees: string[];
  householdId: string;
  deadline: Date | null;
  createdBy: string;
}

interface CompletedTask {
  taskId: string;
  completedBy: string;
  completionDate: Date;
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
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string | null>(null);
  const [householdMembers, setHouseholdMembers] = useState<string[]>([]);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<{ hour: number; minute: number }>({ hour: 0, minute: 0 });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedUserEmail = localStorage.getItem("userEmail");
    if (storedUserName && storedUserEmail) {
      setUserName(storedUserName);
      setUserEmail(storedUserEmail);
    }

    fetchHouseholds();
    fetchTasks();

  }, []);

  const fetchHouseholds = async () => {
    try {
      const response = await fetch('/api/households');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHouseholds(data);
      if (data.length > 0) {
        setSelectedHouseholdId(data[0].id);
      }
    } catch (error) {
      console.error("Could not fetch households:", error);
      toast({
        title: "Error",
        description: "Failed to load households.",
        variant: "destructive",
      });
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Could not fetch tasks:", error);
      toast({
        title: "Error",
        description: "Failed to load tasks.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (selectedHouseholdId) {
      setHouseholdMembers([userName || 'You', "Spouse", "Child"]);
    } else {
      setHouseholdMembers([]);
    }
  }, [selectedHouseholdId, userName]);

  const handleAddTask = async () => {
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

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: taskName,
          assignees: selectedAssignees,
          householdId: selectedHouseholdId,
          deadline: deadline,
          createdBy: userEmail || 'unknown',
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, newTask]);
      localStorage.setItem("tasks", JSON.stringify([...tasks, newTask]));
  
    setTaskName("");
    setSelectedAssignees([]);
    setDate(undefined);
    setTime({ hour: 0, minute: 0 });
    toast({
      title: "Task Created",
      description: `Task "${taskName}" created successfully!`,
    });
    } catch (error) {
      console.error("Could not create task:", error);
      toast({
        title: "Error",
        description: "Failed to create task.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;

    try {
      const response = await fetch(`/api/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: taskName,
          assignees: selectedAssignees,
          deadline: date ? setHours(setMinutes(date, time.minute), time.hour) : null,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      localStorage.setItem("tasks", JSON.stringify(tasks));
  
      setEditingTask(null);
      setTaskName("");
      setSelectedAssignees([]);
      setDate(undefined);
      setTime({ hour: 0, minute: 0 });
  
      toast({
        title: "Task Updated",
        description: `Task "${taskName}" updated successfully!`,
      });
    } catch (error) {
      console.error("Could not update task:", error);
      toast({
        title: "Error",
        description: "Failed to update task.",
        variant: "destructive",
      });
    }
  };
  

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      setCompletedTasks(completedTasks.filter(ct => ct.taskId !== taskId));
       localStorage.setItem("tasks", JSON.stringify(tasks));
  
      toast({
        title: "Task Deleted",
        description: "Task deleted successfully!",
      });
    } catch (error) {
      console.error("Could not delete task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task.",
        variant: "destructive",
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

  const startEditing = (task: Task) => {
    setEditingTask(task);
    setTaskName(task.name);
    setSelectedAssignees(task.assignees);
    if (task.deadline) {
      setDate(task.deadline);
      setTime({ hour: task.deadline.getHours(), minute: task.deadline.getMinutes() });
    } else {
      setDate(undefined);
      setTime({ hour: 0, minute: 0 });
    }
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setTaskName("");
    setSelectedAssignees([]);
    setDate(undefined);
    setTime({ hour: 0, minute: 0 });
  };

  const getTimeLeftString = (deadline: Date | null): string => {
    if (!deadline) return "No deadline";
    const now = new Date();
    if (deadline <= now) return "Deadline passed";

    const duration = intervalToDuration({ start: now, end: deadline });
    const formattedDuration = formatDuration(duration, {
      format: ['years', 'months', 'days', 'hours', 'minutes'],
      delimiter: ", ",
    });

    return `${formattedDuration} left`;
  };

  const isTaskCompleted = (taskId: string): boolean => {
    return completedTasks.some(task => task.taskId === taskId && task.completedBy === userName);
  };

  const markTaskCompleted = (task: Task) => {
    const newCompletedTask: CompletedTask = {
      taskId: task.id,
      completedBy: userName!,
      completionDate: new Date(),
    };
    setCompletedTasks([...completedTasks, newCompletedTask]);
     localStorage.setItem("completedTasks", JSON.stringify([...completedTasks, newCompletedTask]));
    toast({
      title: "Task Completed",
      description: `Task "${task.name}" marked as completed!`,
    });
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

  const completedUserTasks = userTasks.filter(task => isTaskCompleted(task.id));
  const incompleteUserTasks = userTasks.filter(task => !isTaskCompleted(task.id));

   const completedOtherTasks = otherTasks.filter(task => isTaskCompleted(task.id));
  const incompleteOtherTasks = otherTasks.filter(task => !isTaskCompleted(task.id));


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
              {editingTask ? (
                <div className="flex gap-2">
                  <Button onClick={handleUpdateTask} disabled={!taskName || selectedAssignees.length === 0 || !selectedHouseholdId}>
                    Update Task
                  </Button>
                  <Button variant="secondary" onClick={cancelEditing}>
                    Cancel Edit
                  </Button>
                </div>
              ) : (
                <Button onClick={handleAddTask} disabled={!taskName || selectedAssignees.length === 0 || !selectedHouseholdId}>
                  Add Task
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {selectedHouseholdId && (
        <>
           {loading ? (
            <p>Loading tasks...</p>
          ) : (
            <>
          {userTasks.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Tasks Assigned to You</CardTitle>
                <CardDescription>These tasks are assigned to you.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul>
                  {[...incompleteUserTasks, ...completedUserTasks].sort((a, b) => {
                    const aCompleted = isTaskCompleted(a.id);
                    const bCompleted = isTaskCompleted(b.id);
                    if (aCompleted && !bCompleted) {
                      return 1;
                    }
                    if (!aCompleted && bCompleted) {
                      return -1;
                    }
                    return 0;
                  }).map((task) => (
                    <li key={task.id} className="py-2 border-b flex items-center justify-between">
                      <div>
                        {task.name} {task.assignees.length > 0 && !task.assignees.includes(userName || 'You') && `(Assigned to: ${task.assignees.join(", ")})`}
                        {task.deadline && (
                          <div className="text-sm text-muted-foreground">
                            Deadline: {format(task.deadline, "PPP h:mm a")}
                          </div>
                        )}
                         {task.deadline && (
                          <div className="text-sm text-muted-foreground">
                            Time left: {getTimeLeftString(task.deadline)}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!isTaskCompleted(task.id) ? (
                          <Button size="sm" onClick={() => markTaskCompleted(task)}>
                            Mark Complete
                          </Button>
                        ) : (
                          <span className="text-sm text-green-500">Completed</span>
                        )}
                        {task.createdBy === userEmail && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => startEditing(task)}>
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteTask(task.id)}>
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
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
                 {[...incompleteOtherTasks, ...completedOtherTasks].sort((a, b) => {
                    const aCompleted = isTaskCompleted(a.id);
                    const bCompleted = isTaskCompleted(b.id);
                    if (aCompleted && !bCompleted) {
                      return 1;
                    }
                    if (!aCompleted && bCompleted) {
                      return -1;
                    }
                    return 0;
                  }).map((task) => (
                    <li key={task.id} className="py-2 border-b flex items-center justify-between">
                      <div>
                        {task.name} (Assigned to: {task.assignees.join(", ")})
                        {task.deadline && (
                          <div className="text-sm text-muted-foreground">
                            Deadline: {format(task.deadline, "PPP h:mm a")}
                          </div>
                        )}
                         {task.deadline && (
                          <div className="text-sm text-muted-foreground">
                             Time left: {getTimeLeftString(task.deadline)}
                          </div>
                        )}
                      </div>
                      <div>
                        {task.createdBy === userEmail && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => startEditing(task)}>
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteTask(task.id)}>
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
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
        </>
      )}
    </div>
  );
};

export default TaskPage;
