// import Image from "next/image"; // Removed as unused
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 space-y-4">
      <h1>CFIPros MVP Front-End Ready</h1>
      <div className="flex items-center space-x-2">
        <Bell className="h-5 w-5" />
        <span>Lucide Icon Example</span>
      </div>
      <Button>Shadcn Button Example</Button>
    </main>
  );
}
