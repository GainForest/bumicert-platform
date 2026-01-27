"use client";
import { useHeaderContext } from "@/components/providers/HeaderProvider";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useFormStore } from "../form-store";
import { useAtprotoStore } from "@/components/stores/atproto";
import StepHeader from "./StepProgress";
import { useModal } from "@/components/ui/modal/context";
import SaveAsDraftModal, { SaveAsDraftModalId } from "./SaveAsDraftModal";
import DeleteDraftModal, { DeleteDraftModalId } from "./DeleteDraftModal";
import { usePathname } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import useNewBumicertStore from "../store";
import { useStep5Store } from "./Steps/Step5/store";

const LeftContent = () => {
  return (
    <Breadcrumbs
      items={[
        { label: "Home", href: "/" },
        { label: "Create", href: "/bumicert/create" },
        { label: "New bumicert" },
      ]}
    />
  );
};

const RightContent = () => {
  const isHydrated = useFormStore((state) => state.isHydrated);
  const auth = useAtprotoStore((state) => state.auth);
  const { pushModal, show } = useModal();
  const pathname = usePathname();
  const { currentStepIndex, setCurrentStepIndex } = useNewBumicertStore();
  const overallStatusForStep5 = useStep5Store((state) => state.overallStatus);

  if (!isHydrated || !auth.authenticated) return null;

  // Extract draftId from URL to determine if delete button should be shown
  const draftIdMatch = pathname.match(/\/create\/(\d+)$/);
  const draftId = draftIdMatch ? parseInt(draftIdMatch[1], 10) : null;
  const showDeleteButton = draftId !== null && draftId !== 0 && !isNaN(draftId);

  const handleSaveDraft = () => {
    pushModal(
      {
        id: SaveAsDraftModalId,
        content: <SaveAsDraftModal />,
      },
      true
    );
    show();
  };

  const handleDeleteDraft = () => {
    pushModal(
      {
        id: DeleteDraftModalId,
        content: <DeleteDraftModal />,
      },
      true
    );
    show();
  };

  const handleBack = () => {
    setCurrentStepIndex(currentStepIndex - 1);
  };

  const canGoBack = currentStepIndex > 0 && !(currentStepIndex === 4 && overallStatusForStep5 === "pending");

  return (
    <div className="flex items-center gap-2">
      {canGoBack && (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4 mr-1" strokeWidth={1.5} />
          Back
        </Button>
      )}
      {showDeleteButton && (
        <Button
          size={"icon-sm"}
          variant="ghost"
          onClick={handleDeleteDraft}
          className="text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
      <Button size={"sm"} onClick={handleSaveDraft}>
        Save as Draft
      </Button>
    </div>
  );
};

const SubHeaderContent = () => {
  const isHydrated = useFormStore((state) => state.isHydrated);
  const auth = useAtprotoStore((state) => state.auth);

  if (!isHydrated || !auth.authenticated) return null;
  return (
    <div className="w-full pt-1">
      <StepHeader />
    </div>
  );
};

const HeaderContent = () => {
  const { setLeftContent, setRightContent, setSubHeaderContent } =
    useHeaderContext();

  useEffect(() => {
    setLeftContent(<LeftContent />);
    setRightContent(<RightContent />);
    setSubHeaderContent(<SubHeaderContent />);
  }, [setLeftContent, setRightContent, setSubHeaderContent]);

  return null;
};

export default HeaderContent;
