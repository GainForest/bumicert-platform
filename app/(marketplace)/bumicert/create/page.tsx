import React from "react";
import AuthWrapper from "./[draftId]/_components/AuthWrapper";
import { FileText, Plus } from "lucide-react";
import HeaderContent from "./_components/HeaderContent";
import GetStartedButton from "./_components/GetStartedButton";
import MyBumicerts from "./_components/MyBumicerts";
import DraftBumicerts from "./_components/DraftBumicerts";

const CreateBumicertPage = () => {
  return (
    <AuthWrapper>
      <HeaderContent />
      <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_18rem] gap-8 mt-6 px-4 pb-8">
        <div className="flex-1 flex flex-col gap-6">
          {/* Create New Section */}
          <section className="flex items-center justify-between p-4 rounded-lg border border-border/40 bg-secondary/20">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-primary/10 rounded-lg flex items-center justify-center">
                <Plus className="size-4 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-lg font-serif font-medium text-foreground">
                  New application
                </h1>
                <p className="text-sm text-muted-foreground/70">
                  Create a bumicert for your organization
                </p>
              </div>
            </div>
            <GetStartedButton />
          </section>

          {/* My Bumicerts Section */}
          <MyBumicerts />
        </div>
        
        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-muted-foreground/50" strokeWidth={1.5} />
            <h2 className="text-sm font-medium text-muted-foreground">Drafts</h2>
          </div>
          <DraftBumicerts />
        </div>
      </div>
    </AuthWrapper>
  );
};

export default CreateBumicertPage;
