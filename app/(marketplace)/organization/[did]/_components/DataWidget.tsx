"use client";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const DataWidget = ({title, icon: Icon, items, viewAllHref, showManageCTA = false} : {
    title: string;
    icon: React.ElementType;
    items: {
        text: string;
        href: string;
    }[] | undefined;
    viewAllHref: string;
    showManageCTA?: boolean;
}) => {
    const first10Items = items ? items.slice(0, 10) : [];
    const isLoading = items === undefined;

  return (
    <div className='rounded-xl overflow-hidden'>
        <div className="bg-background flex items-center justify-between gap-2 p-2">
            <div className="flex items-center gap-2">
            <Icon className="size-4" />
            <span className="font-semibold">{title}</span>
            </div>
            <Link href={viewAllHref}>
            <Button variant="ghost" size={"sm"}>View all <ChevronRight /></Button>
            </Link>
        </div>
        <div className="min-h-40 relative rounded-xl bg-muted">
            {
                isLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Loader2 className="size-4 animate-spin text-primary" />
                    </div>
                ) :
                first10Items.length > 0 ? (
                    <div className="flex flex-col p-1">
                        {first10Items.map((item, index) => (
                            <Link key={`${item.text}-${index}`} href={item.href} className='w-full'>
                                <Button variant="outline" size={"sm"} className={cn('w-full justify-between rounded-none border-t-0'
                                    , index === 0 && 'rounded-t-md border-t'
                                    , index === first10Items.length - 1 && 'rounded-b-md'
                                )}>{item.text}
                                <ChevronRight className="size-4" />
                                </Button>
                            </Link>
                        ))}
                        <div className='flex items-center justify-center'>

                        {
                            first10Items.length < items?.length && (
                                <Link href={viewAllHref}>

                                    <Button variant="ghost" size={"sm"}>View remaining {items?.length - first10Items.length} <ChevronRight /></Button>
                                </Link>
                            )
                        }
                        </div>
                    </div>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center my-auto">
                        Nothing here yet.
                        {showManageCTA && (
                        <Link href={viewAllHref}>
                            <Button variant="outline" className='mt-2'>Manage <ChevronRight /></Button>
                            </Link>
                        )}
                    </div>
                )
            }
        </div>
    </div>
  )
  
}

export default DataWidget