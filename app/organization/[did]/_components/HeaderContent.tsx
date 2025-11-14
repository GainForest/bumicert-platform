"use client";

import { useHeaderContext } from "@/components/providers/HeaderProvider";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { Check, Pencil, X } from "lucide-react";
import { useOrganizationPageStore } from "../store";
import { useModal } from "@/components/ui/modal/context";
import { SaveInfoModal, SaveInfoModalId } from "./SaveInfoModal";
import { useAtprotoStore } from "@/components/stores/atproto";

const LeftContent = () => {
  return null;
};

const RightContent = () => {
  const auth = useAtprotoStore((state) => state.auth);
  const isEditing = useOrganizationPageStore((state) => state.isEditing);
  const setIsEditing = useOrganizationPageStore((state) => state.setIsEditing);
  const did = useOrganizationPageStore((state) => state.did);
  const { show, pushModal } = useModal();

  if (auth.status !== "AUTHENTICATED" || auth.user.did !== did) {
    return null;
  }
  return (
    <div className="flex items-center gap-1">
      {isEditing ?
        <>
          <Button
            size={"sm"}
            variant={"outline"}
            onClick={() => setIsEditing(!isEditing)}
          >
            <X />
          </Button>
          <Button
            size={"sm"}
            onClick={() => {
              pushModal(
                {
                  id: SaveInfoModalId,
                  content: <SaveInfoModal />,
                },
                true
              );
              show();
            }}
          >
            <Check />
            Save
          </Button>
        </>
      : <Button
          size={"sm"}
          variant={"outline"}
          onClick={() => setIsEditing(!isEditing)}
        >
          <Pencil />
          Edit
        </Button>
      }
    </div>
  );
};

const SubHeaderContent = () => {
  return null;
};
const HeaderContent = () => {
  const { setLeftContent, setRightContent, setSubHeaderContent } =
    useHeaderContext();

  useEffect(() => {
    setLeftContent(<LeftContent />);
    setRightContent(<RightContent />);
    setSubHeaderContent(<SubHeaderContent />);
  }, []);

  return null;
};

export default HeaderContent;
