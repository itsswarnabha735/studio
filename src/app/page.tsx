"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to HomeHub Harmony</CardTitle>
          <CardDescription>
            Manage your household tasks and schedules with ease.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Get started by creating a household group and adding your tasks.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


