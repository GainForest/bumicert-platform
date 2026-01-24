import React from "react";
import Link from "next/link";
import {
    TrendingUp,
    Ticket,
    Wrench,
    ShieldAlert,
    ChevronRight,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface InternalTool {
    title: string;
    description: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
    badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

const tools: InternalTool[] = [
    // Analytics not yet merged to main
    // {
    //   title: "Platform Analytics",
    //   description:
    //     "View detailed metrics, conversion funnels, and usage statistics for the Bumicert creation flow.",
    //   href: "/internal/analytics",
    //   icon: TrendingUp,
    //   badge: "Live",
    //   badgeVariant: "default",
    // },
    {
        title: "Invite Codes",
        description:
            "Generate and manage one-time invite codes for new organization onboarding.",
        href: "/internal/invite-code",
        icon: Ticket,
        badge: "Admin",
        badgeVariant: "secondary",
    },
];

const InternalDirectoryPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                        <Wrench className="h-8 w-8 text-primary" />
                        Internal Tools
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Authorized access only. Tools for platform administration and
                        monitoring.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool) => (
                        <Link key={tool.href} href={tool.href} className="group block">
                            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/50 cursor-pointer">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                            <tool.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        {tool.badge && (
                                            <Badge variant={tool.badgeVariant}>{tool.badge}</Badge>
                                        )}
                                    </div>
                                    <CardTitle className="mt-4 text-xl group-hover:text-primary transition-colors">
                                        {tool.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">
                                        {tool.description}
                                    </CardDescription>
                                </CardContent>
                                <CardFooter className="mt-auto pt-0 text-sm font-medium text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Open Tool <ChevronRight className="h-4 w-4" />
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}

                    {/* Placeholder for future tools */}
                    <Card className="h-full border-dashed border-2 bg-transparent opacity-60 hover:opacity-100 transition-opacity">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                    <ShieldAlert className="h-6 w-6 text-gray-400" />
                                </div>
                            </div>
                            <CardTitle className="mt-4 text-xl text-gray-500">
                                Coming Soon
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                More internal administration tools are under development.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default InternalDirectoryPage;
