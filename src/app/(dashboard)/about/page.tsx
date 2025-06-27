
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Globe } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const developers = [
    {
      name: "Chamindu Kavishka",
      avatar: "/chamindu.jpeg",
      hint: "person male developer",
      portfolio: "https://chamindu1.vercel.app",
    },
    {
      name: "Maheshika Devindya",
      avatar: "/me.png",
      hint: "person female developer",
      portfolio: "https://maheshika1.vercel.app",
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">About EduMate</h1>
        <p className="text-muted-foreground mt-2">
          Your all-in-one solution for managing your tuition center.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What is EduMate?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            EduMate is a modern, intuitive application designed to streamline the management of tuition centers. From student registration and payment tracking to class scheduling and attendance, EduMate provides all the tools you need to stay organized and efficient.
          </p>
          <p>
            Our goal is to empower educators and administrators by reducing administrative overhead, allowing them to focus on what truly matters: providing quality education. The application is built with a clean, user-friendly interface and leverages powerful technologies to deliver a seamless experience.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Meet the Developers</CardTitle>
          <CardDescription>
            This application was brought to life by a dedicated team of developers.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          {developers.map((dev) => (
            <div key={dev.name} className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 p-4 border rounded-lg bg-background">
              <Avatar className="h-20 w-20">
                <AvatarImage src={dev.avatar} data-ai-hint={dev.hint} alt={dev.name} />
                <AvatarFallback>{dev.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="font-bold text-lg">{dev.name}</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <Link href={dev.portfolio} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                    View Portfolio
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
