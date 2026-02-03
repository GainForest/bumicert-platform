"use client";

import AtprotoSignInButton from "@/components/global/Header/AtprotoSignInButton";
import Container from "@/components/ui/container";
import { CircleAlert } from "lucide-react";
import React from "react";

const NotSignedIn = () => {
    return (
        <Container>
            <div className="w-full h-40 flex flex-col items-center justify-center gap-1 bg-muted/50 rounded-lg mt-2">
                <CircleAlert className="size-5 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">
                    You are not signed in.
                </span>
                <AtprotoSignInButton />
            </div>
        </Container>
    );
};

export default NotSignedIn;
