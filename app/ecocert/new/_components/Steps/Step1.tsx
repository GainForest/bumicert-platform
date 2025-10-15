"use client";
import React, { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Club, Globe } from "lucide-react";

const Step1 = () => {
  const [projectName, setProjectName] = useState("");
  const [websiteOrSocialLink, setWebsiteOrSocialLink] = useState("");
  return (
    <div>
      <h1 className="text-3xl font-bold font-serif">
        Tell us about your project
      </h1>
      <div className="flex flex-col gap-1 mt-4">
        <div className="flex flex-col gap-1 p-2 hover:bg-muted/75 focus-within:bg-muted/75 rounded-md transition-colors group">
          <label
            htmlFor="project-name"
            className="flex items-center gap-1 text-sm text-muted-foreground group-hover:text-foreground group-focus-within:text-foreground transition-colors"
          >
            <Club className="size-3.5" />
            Project Name
          </label>
          <InputGroup className="bg-background">
            <InputGroupInput
              placeholder="My Awesome Project"
              id="project-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <InputGroupAddon align="inline-end">
              {projectName.length}/50
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className="flex flex-col gap-1 p-2 hover:bg-muted/75 focus-within:bg-muted/75 rounded-md transition-colors group">
          <label
            htmlFor="website-or-social-link"
            className="flex items-center gap-1 text-sm text-muted-foreground group-hover:text-foreground group-focus-within:text-foreground transition-colors"
          >
            <Globe className="size-3.5" />
            Website or Social Link
          </label>
          <InputGroup className="bg-background">
            <InputGroupInput
              placeholder="https://www.example.com"
              id="website-or-social-link"
              value={websiteOrSocialLink}
              onChange={(e) => setWebsiteOrSocialLink(e.target.value)}
            />
          </InputGroup>
        </div>
      </div>
    </div>
  );
};

export default Step1;
