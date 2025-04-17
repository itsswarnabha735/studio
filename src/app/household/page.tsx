
"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const HouseholdPage = () => {
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
              <Input id="householdName" placeholder="Enter household name" />
            </div>
            <Button>Create/Join Household</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HouseholdPage;
