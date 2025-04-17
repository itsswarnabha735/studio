
"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MaintenancePage = () => {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Home Maintenance and Inventory</CardTitle>
          <CardDescription>
            Schedule maintenance tasks and track household inventory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="maintenanceTask">Maintenance Task:</label>
              <Input id="maintenanceTask" placeholder="Enter task name" />
            </div>
            <Button>Add Maintenance Task</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenancePage;
