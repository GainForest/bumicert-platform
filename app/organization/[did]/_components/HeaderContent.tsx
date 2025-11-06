"use client";

import { useHeaderContext } from "@/components/providers/HeaderProvider";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { Check, Pencil, X } from "lucide-react";
import { useOrganizationPageStore } from "../store";

const LeftContent = () => {
  return null;
};

const RightContent = () => {
  const { isEditing, setIsEditing } = useOrganizationPageStore();
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
          <Button size={"sm"} onClick={() => setIsEditing(!isEditing)}>
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
