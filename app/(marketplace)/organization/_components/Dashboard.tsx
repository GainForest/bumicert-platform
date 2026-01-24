"use client";

import Container from "@/components/ui/container";
import {
    AppCertifiedLocation,
    AppGainforestOrganizationDefaultSite,
    AppGainforestOrganizationInfo,
    AppHypercertsClaimActivity
} from "climateai-sdk/lex-api";
import { GetRecordResponse } from "climateai-sdk/types";
import { ArrowRight, BuildingIcon, ClipboardList, MapPin, Pencil } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { links } from "@/lib/links";
import Image from "next/image"; // For potential logo/cover
import { useAtprotoStore } from "@/components/stores/atproto";

interface DashboardProps {
    did: string;
    organizationInfo: AppGainforestOrganizationInfo.Record;
    bumicertsCount: number;
    projectsCount: number;
    sitesCount: number;
}

const StatCard = ({
    title,
    count,
    icon: Icon,
    actionLink,
    actionText,
    createLink
}: {
    title: string;
    count: number;
    icon: React.ElementType;
    actionLink: string;
    actionText: string;
    createLink?: string;
}) => {
    return (
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div className="p-3 bg-muted/50 rounded-lg">
                    <Icon className="size-6 text-primary" />
                </div>
                <span className="text-4xl font-bold text-foreground">{count}</span>
            </div>
            <div className="mt-4">
                <h3 className="text-lg font-semibold text-foreground/80">{title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{count === 0 ? "No active items" : "Active items"}</p>

                <div className="flex flex-col gap-2">
                    <Link href={actionLink} className="w-full">
                        <Button variant="outline" className="w-full justify-between group">
                            {actionText}
                            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    {createLink && (
                        <Link href={createLink} className="w-full">
                            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary">
                                + Create New
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

const Dashboard = ({
    did,
    organizationInfo,
    bumicertsCount,
    projectsCount,
    sitesCount
}: DashboardProps) => {

    return (
        <Container>
            <div className="py-8 space-y-8">
                {/* Top Section: Organization Overview */}
                <div className="w-full bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        {organizationInfo.logo ? (
                            <img
                                src={`https://cdn.bsky.app/img/avatar/plain/${did}/${organizationInfo.logo.ref.toString()}@jpeg`}
                                alt={organizationInfo.displayName}
                                className="size-16 rounded-full object-cover border border-border"
                            />
                        ) : (
                            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                <BuildingIcon className="size-8 text-primary" />
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold font-serif">{organizationInfo.displayName || "My Organization"}</h1>
                            <p className="text-muted-foreground max-w-md line-clamp-1">{organizationInfo.shortDescription || "Manage your organization profile and data."}</p>
                        </div>
                    </div>
                    <Link href={`/upload/organization/${did}`}>
                        <Button className="gap-2">
                            <Pencil className="size-4" />
                            Edit Organization Profile
                        </Button>
                    </Link>
                </div>

                {/* Middle Section: My Data Grid */}
                <div>
                    <h2 className="text-xl font-bold mb-4 font-serif">My Data</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard
                            title="Bumicerts"
                            count={bumicertsCount}
                            icon={ClipboardList} // Using ClipboardList as a proxy for certificate/leaf if specific icon not available
                            actionLink={`/upload/organization/${did}#bumicerts`}
                            actionText="View All"
                            createLink={links.bumicert.create}
                        />
                        <StatCard
                            title="Projects"
                            count={projectsCount}
                            icon={ClipboardList}
                            actionLink={`/upload/organization/${did}/projects`}
                            actionText="Manage Projects"
                        // createLink for projects?
                        />
                        <StatCard
                            title="Sites"
                            count={sitesCount}
                            icon={MapPin}
                            actionLink={`/upload/organization/${did}/sites`}
                            actionText="Manage Sites"
                        />
                    </div>
                </div>

                {/* Bottom Section: Recent Uploads (Placeholder for now as per plan explanation) */}
                {/* 
                 <div className="bg-muted/30 rounded-xl p-8 text-center">
                    <p className="text-muted-foreground">Recent activity list coming soon...</p>
                 </div> 
                 */}
            </div>
        </Container>
    );
};

export default Dashboard;
