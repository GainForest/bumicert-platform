import React from "react";
import AuthWrapper from "./[draftId]/_components/AuthWrapper";
import { FileText, Leaf } from "lucide-react";
import HeaderContent from "./_components/HeaderContent";
import GetStartedButton from "./_components/GetStartedButton";
import Image from "next/image";
import MyBumicerts from "./_components/MyBumicerts";
import DraftBumicerts from "./_components/DraftBumicerts";

const CreateBumicertPage = () => {
  return (
    <AuthWrapper>
      <HeaderContent />
      <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_18rem] gap-8 mt-6 px-4 pb-8">
        <div className="flex-1 flex flex-col gap-6">
          {/* Create New Section with Banner */}
          <section className="rounded-xl border border-border/50 shadow-lg relative overflow-hidden">
            <Image
              src="/assets/media/images/jeremy-bishop-vGjGvtSfys4-unsplash.jpg"
              alt="Create Bumicert"
              fill
              className="object-cover object-[50%_40%]"
            />
            <div className="relative inset-0 flex flex-col p-5 gap-3 bg-gradient-to-b from-black/60 via-black/30 to-black/10">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <Leaf className="size-4 text-white" strokeWidth={1.5} />
                </div>
                <h1 className="text-xl font-serif font-medium text-white">
                  Start a new application
                </h1>
              </div>
              <p className="text-white/80 text-sm max-w-md">
                Create a bumicert to showcase your organization&apos;s commitment to sustainability.
              </p>
              <div className="flex items-center justify-end mt-16">
                <GetStartedButton />
              </div>
            </div>
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
