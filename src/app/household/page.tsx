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

interface Household {
  id: string;
  name: string;
}

const HouseholdPage = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [householdName, setHouseholdName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [households, setHouseholds] = useState<Household[]>([]);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }

    const storedHouseholds = localStorage.getItem("households");
    if (storedHouseholds) {
      setHouseholds(JSON.parse(storedHouseholds));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("households", JSON.stringify(households));
  }, [households]);

  const handleCreateHousehold = () => {
    const newHousehold: Household = {
      id: Math.random().toString(36).substring(7),
      name: householdName,
    };
    setHouseholds([...households, newHousehold]);
    toast({
      title: "Household Created",
      description: `Household "${householdName}" created successfully!`,
    });
    setOpen(false);
    setHouseholdName("");
  };

  const handleJoinHousehold = () => {
    // In a real app, you'd verify the join code with a server
    const newHousehold: Household = {
      id: Math.random().toString(36).substring(7),
      name: `Household ${joinCode}`, // Placeholder name
    };
    setHouseholds([...households, newHousehold]);
    toast({
      title: "Household Joined",
      description: `Joined household with code "${joinCode}"! (This is a simulation)`,
    });
    setOpen(false);
    setJoinCode("");
  };

  const handleLeaveHousehold = (householdId: string) => {
    setHouseholds(households.filter((household) => household.id !== householdId));
    toast({
      title: "Household Left",
      description: "You have left the household.",
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
          {households.length > 0 ? (
            <div>
              <p>Your Households:</p>
              <ul>
                {households.map((household) => (
                  <li key={household.id} className="py-2">
                    {household.name}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="ml-2"
                      onClick={() => handleLeaveHousehold(household.id)}
                    >
                      Leave
                    </Button>
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
