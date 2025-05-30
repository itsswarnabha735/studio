"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface Household {
  id: string;
  name: string;
  joinCode: string;
}

const HouseholdPage = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [householdName, setHouseholdName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [households, setHouseholds] = useState<Household[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
    fetchHouseholds();
  }, []);

  const fetchHouseholds = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/households'); // Your API endpoint
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHouseholds(data);
    } catch (error) {
      console.error("Could not fetch households:", error);
      toast({
        title: "Error",
        description: "Failed to load households.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateUniqueCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleCreateHousehold = async () => {
    try {
      const uniqueCode = generateUniqueCode();
      const response = await fetch('/api/households', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: householdName, joinCode: uniqueCode }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newHousehold = await response.json();
      setHouseholds((prev) => [...prev, newHousehold]);
      localStorage.setItem("households", JSON.stringify([...households, newHousehold]));

      toast({
        title: "Household Created",
        description: `Household "${householdName}" created successfully!`,
      });
      setOpen(false);
      setHouseholdName("");
      fetchHouseholds();
    } catch (error) {
      console.error("Could not create household:", error);
      toast({
        title: "Error",
        description: "Failed to create household.",
        variant: "destructive",
      });
    }
  };
  

  const handleJoinHousehold = () => {
    // In a real app, you'd verify the join code with a server
    const newHousehold: Household = {
      id: Math.random().toString(36).substring(7),
      name: `Household ${joinCode}`, // Placeholder name
      joinCode: 'N/A',
    };
    setHouseholds([...households, newHousehold]);
     localStorage.setItem("households", JSON.stringify([...households, newHousehold]));
    toast({
      title: "Household Joined",
      description: `Joined household with code "${joinCode}"! (This is a simulation)`,
    });
    setOpen(false);
    setJoinCode("");
  };

  const handleLeaveHousehold = (householdId: string) => {
    setHouseholds(households.filter((household) => household.id !== householdId));
     localStorage.setItem("households", JSON.stringify(households.filter((household) => household.id !== householdId)));
    toast({
      title: "Household Left",
      description: "You have left the household.",
    });
  };

  const copyJoinCode = (code: string, householdName: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Join Code Copied",
      description: `Join code for "${householdName}" copied to clipboard!`,
    });
  };

  if (!userName) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to access household management.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>You need to log in to create or join a household.</p>
            <Button onClick={() => router.push("/login")}>Log In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Household Management</CardTitle>
          <CardDescription>
            Manage your household groups and shared settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {loading ? (
            <p>Loading households...</p>
          ) : households.length > 0 ? (
            <div>
              <p>Your Households:</p>
              <ul>
                {households.map((household) => (
                  <li key={household.id} className="py-2 flex items-center justify-between">
                    <div>
                      {household.name}
                    </div>
                    <div className="flex items-center space-x-2">
                       <Label className="mr-2">Code: {household.joinCode}</Label>
                       <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => copyJoinCode(household.joinCode, household.name)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                           Copy Code
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleLeaveHousehold(household.id)}
                        >
                          Leave
                        </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>You are not a member of any household yet.</p>
          )}

          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Create/Join Household</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Create or Join a Household?</AlertDialogTitle>
                <AlertDialogDescription>
                  Choose to create a new household or join an existing one.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="newHouseholdName">New Household Name:</Label>
                  <Input
                    type="text"
                    id="newHouseholdName"
                    placeholder="Enter new household name"
                    value={householdName}
                    onChange={(e) => setHouseholdName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="joinHouseholdCode">Join Code:</Label>
                  <Input
                    type="text"
                    id="joinHouseholdCode"
                    placeholder="Enter join code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                  />
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                {householdName && <AlertDialogAction onClick={handleCreateHousehold}>Create</AlertDialogAction>}
                {joinCode && <AlertDialogAction onClick={handleJoinHousehold}>Join</AlertDialogAction>}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default HouseholdPage;
