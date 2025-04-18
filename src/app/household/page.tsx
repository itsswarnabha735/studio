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

const HouseholdPage = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [householdName, setHouseholdName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [currentHousehold, setCurrentHousehold] = useState<string | null>(null);

  useEffect(() => {
    const storedHouseholdName = localStorage.getItem("householdName");
    if (storedHouseholdName) {
      setCurrentHousehold(storedHouseholdName);
    }
  }, []);

  const handleCreateHousehold = () => {
    localStorage.setItem("householdName", householdName);
    setCurrentHousehold(householdName);
    toast({
      title: "Household Created",
      description: `Household "${householdName}" created successfully!`,
    });
    setOpen(false);
  };

  const handleJoinHousehold = () => {
    // In a real app, you'd verify the join code with a server
    toast({
      title: "Household Joined",
      description: `Joined household with code "${joinCode}"! (This is a simulation)`,
    });
    setOpen(false);
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Household Management</CardTitle>
          <CardDescription>
            Manage your household group and shared settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {currentHousehold ? (
            <div>
              <p>Current Household: {currentHousehold}</p>
              <Button onClick={() => {
                localStorage.removeItem("householdName");
                setCurrentHousehold(null);
              }}>Leave Household</Button>
            </div>
          ) : (
            <>
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HouseholdPage;
