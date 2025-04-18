"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const userName = localStorage.getItem('userName');
    if (!userName) {
      router.push('/login');
    }
  }, [router]);

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
          <Button onClick={() => router.push("/household")}>
              Manage Households
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
