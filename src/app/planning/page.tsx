
"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PlanningPage = () => {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Family and Social Planning</CardTitle>
          <CardDescription>
            Plan events, track important dates, and manage gift ideas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="eventPlan">Event Plan:</label>
              <Input id="eventPlan" placeholder="Enter event plan" />
            </div>
            <Button>Add Event Plan</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanningPage;
