
"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CarePage = () => {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Pet and Plant Care</CardTitle>
          <CardDescription>
            Manage care schedules for pets and plants.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="careTask">Care Task:</label>
              <Input id="careTask" placeholder="Enter task name" />
            </div>
            <Button>Add Care Task</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarePage;
