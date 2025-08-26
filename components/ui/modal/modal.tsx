"use client";

import React, { useContext } from "react";
import { DialogClose, DialogFooter } from "./dialog";
import { DrawerFooter } from "./drawer";
import { ModalModeContext } from "./context";
import { XIcon } from "lucide-react";

type ModalDivProps = React.ComponentProps<"div">;

export const ModalHeader = ({ ...props }: ModalDivProps) => {
  return <div className="mb-2" {...props} />;
};

export const ModalTitle = ({ ...props }: ModalDivProps) => {
  return (
    <h1
      className="font-serif text-lg font-semibold"
      {...props}
      data-modal-title
    />
  );
};

export const ModalDescription = ({ ...props }: ModalDivProps) => {
  return (
    <p
      className="text-sm text-muted-foreground"
      {...props}
      data-modal-description
    />
  );
};

export const ModalFooter = ({ ...props }: ModalDivProps) => {
  const mode = useContext(ModalModeContext);
  if (mode === "dialog") {
    return <DialogFooter {...props} />;
  }
  return <DrawerFooter {...props} />;
};

export const ModalContent = ({
  dismissible = true,
  ...props
}: ModalDivProps & {
  dismissible?: boolean;
}) => {
  const mode = useContext(ModalModeContext);
  if (mode === "drawer") {
    return (
      <>
        {dismissible && (
          <div className="bg-muted mx-auto hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
        )}
        <div
          data-modal-dismissible={dismissible ? "true" : "false"}
          {...props}
        />
      </>
    );
  }
  return (
    <>
      {dismissible && (
        <DialogClose className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-0 right-0 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogClose>
      )}
      <div data-modal-dismissible={dismissible ? "true" : "false"} {...props} />
    </>
  );
};
