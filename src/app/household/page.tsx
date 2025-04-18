"use client";
import React, { useState } from 'react';
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

const HouseholdPage = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [householdName, setHouseholdName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const handleCreateHousehold = () => {
    toast({
      title: "Household Created",
      description: `Household "${householdName}" created successfully!`,
    });
    setOpen(false);
  };

  const handleJoinHousehold = () => {
    toast({
      title: "Household Joined",
      description: `Joined household with code "${joinCode}"!`,
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
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="householdName">Household Name:</label>
              <Input
                id="householdName"
                placeholder="Enter household name"
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
              />
            </div>
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <Button>Create/Join Household</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Create or Join a Household?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Choose to create a new household or join an existing one.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-2">
                  <div>
                    <label htmlFor="newHouseholdName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">New Household Name:</label>
                    <Input
                      type="text"
                      id="newHouseholdName"
                      placeholder="Enter new household name"
                      value={householdName}
                      onChange={(e) => setHouseholdName(e.target.value)}
                    />
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCreateHousehold}>Create</AlertDialogAction>
                    </AlertDialogFooter>
                  </div>
                  <div className="border-t" />
                  <div>
                    <label htmlFor="joinHouseholdCode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Join Code:</label>
                    <Input
                      type="text"
                      id="joinHouseholdCode"
                      placeholder="Enter join code"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                    />
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleJoinHousehold}>Join</AlertDialogAction>
                    </AlertDialogFooter>
                  </div>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HouseholdPage;
