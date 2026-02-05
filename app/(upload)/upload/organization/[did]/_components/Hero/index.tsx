"use client";

import type { AppGainforestOrganizationInfo } from "gainforest-sdk/lex-api";
import { getBlobUrl } from "gainforest-sdk/utilities/atproto";
import { BadgeCheck, CircleAlert, Pencil } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useMemo } from "react";
import { useOrganizationPageStore } from "../../store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useModal } from "@/components/ui/modal/context";
import {
  ImageEditorModal,
  ImageEditorModalId,
} from "../../_modals/image-editor";
import useHydratedData from "@/hooks/use-hydration";
import {
  customTransformer,
  deserialize,
  SerializedSuperjson,
} from "gainforest-sdk/utilities/transform";
import { AllowedPDSDomain, allowedPDSDomains } from "@/config/gainforest-sdk";
import EditableText from "@/components/ui/editable-text";
import { AnimatePresence, motion } from "framer-motion";
import QuickTooltip from "@/components/ui/quick-tooltip";

const Hero = ({
  initialData,
  initialDid,
  dynamic = true,
}: {
  initialData: SerializedSuperjson<AppGainforestOrganizationInfo.Record>;
  initialDid: string;
  dynamic?: boolean;
}) => {
  const reactiveData = useOrganizationPageStore((state) => state.data);
  const data = useHydratedData(
    deserialize(initialData),
    dynamic ? reactiveData : null
  );

  const reactiveDid = useOrganizationPageStore((state) => state.did);
  const did = useHydratedData(initialDid, dynamic ? reactiveDid : null);

  const isEditing = useOrganizationPageStore((state) => state.isEditing);
  const editingData = useOrganizationPageStore(
    (state) => state.heroEditingData
  );
  const setEditingData = useOrganizationPageStore(
    (actions) => actions.setHeroEditingData
  );
  const { show, pushModal } = useModal();

  const displayNameError = useMemo(() => {
    if (!isEditing) return null;
    const displayName = editingData.displayName;
    if (displayName.length < 8) return "Display name is too short.";
    if (displayName.length > 255) return "Display name is too long.";
    return null;
  }, [editingData.displayName, isEditing]);

  const shortDescriptionError = useMemo(() => {
    if (!isEditing) return null;
    const shortDescription = editingData.shortDescription;
    if (shortDescription.length < 50) return "Short description is too short.";
    if (shortDescription.length > 2000) return "Short description is too long.";
    return null;
  }, [editingData.shortDescription, isEditing]);

  useEffect(() => {
    setEditingData({
      displayName: data.displayName,
      shortDescription: data?.shortDescription?.text || "",
      coverImage: data.coverImage ? data.coverImage.image : undefined,
      logoImage: data.logo ? data.logo.image : undefined,
    });
  }, [isEditing, data]);

  const coverImageUrl = data.coverImage
    ? getBlobUrl(did, data.coverImage.image, allowedPDSDomains[0])
    : null;
  const editingCoverImageUrl = editingData.coverImage
    ? editingData.coverImage instanceof File
      ? URL.createObjectURL(editingData.coverImage)
      : getBlobUrl(did, editingData.coverImage, allowedPDSDomains[0])
    : null;
  const logoImageUrl = data.logo
    ? getBlobUrl(did, data.logo.image, allowedPDSDomains[0])
    : null;
  const editingLogoImageUrl = editingData.logoImage
    ? editingData.logoImage instanceof File
      ? URL.createObjectURL(editingData.logoImage)
      : getBlobUrl(did, editingData.logoImage, allowedPDSDomains[0])
    : null;

  return (
    <div className="w-full h-60 rounded-t-2xl overflow-hidden relative">
      {isEditing ? (
        editingCoverImageUrl ? (
          <Image
            src={editingCoverImageUrl}
            alt="Cover Image"
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )
      ) : coverImageUrl ? (
        <Image
          src={coverImageUrl}
          alt="Cover Image"
          fill
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-muted" />
      )}
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-background">
        <Button
          component={motion.button}
          componentProps={{
            animate: { padding: isEditing ? "0.25rem" : "1px" },
          }}
          variant={"outline"}
          className={cn(
            "absolute top-2 left-2 rounded-full flex items-center gap-1.5 h-auto p-px transition-all"
          )}
          onClick={() => {
            if (!isEditing) return;
            pushModal(
              {
                id: ImageEditorModalId + `/${did}/logo-image`,
                content: (
                  <ImageEditorModal
                    title="Edit Organization Logo"
                    description="Choose an image to update the organization logo."
                    initialImage={editingData.logoImage}
                    did={did}
                    onImageChange={(image) => {
                      setEditingData({
                        ...editingData,
                        logoImage: image,
                      });
                    }}
                  />
                ),
              },
              true
            );
            show();
          }}
        >
          <div className="h-8 w-8 rounded-full bg-muted relative overflow-hidden">
            <Image
              src={
                (isEditing ? editingLogoImageUrl : logoImageUrl) ??
                "data:image/png;base64,iVBORw0KGgo=" // Empty image
              }
              alt="Logo Image"
              fill
              className={cn("object-cover", isEditing && "blur-xs")}
            />
            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-foreground/30 rounded-full flex items-center justify-center"
                >
                  <Pencil className="size-4 text-background" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {isEditing && (
              <motion.span
                className="mr-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                Logo
              </motion.span>
            )}
          </AnimatePresence>
        </Button>

        <div className="absolute bottom-6 left-0 right-0 p-4">
          <div className="flex items-center gap-2">
            <BadgeCheck className="size-8" />
            <div className="flex items-center relative">
              <EditableText
                component="h1"
                value={isEditing ? editingData.displayName : data.displayName}
                onChange={(text) => {
                  setEditingData({
                    ...editingData,
                    displayName: text,
                  });
                }}
                editable={isEditing}
                placeholder="Unnamed Organization"
                className={cn(
                  "text-3xl font-bold font-serif outline-none focus:outline-none rounded-lg",
                  isEditing &&
                    "px-2 ring-2 ring-black/20 dark:ring-white/20 focus:ring-primary dark:focus:ring-primary",
                  isEditing &&
                    displayNameError &&
                    "ring-destructive/50 dark:ring-destructive/50 focus:ring-destructive dark:focus:ring-destructive pr-8",
                  isEditing &&
                    editingData.displayName === "" &&
                    "text-muted-foreground"
                )}
              />
              {displayNameError && (
                <QuickTooltip
                  asChild
                  content={displayNameError}
                  disabled={!isEditing}
                  contentClassName="text-white"
                  backgroundColor="var(--destructive)"
                >
                  <Button
                    variant={"destructive"}
                    size={"icon-sm"}
                    className="absolute top-1/2 -translate-y-1/2 right-1 h-6 w-6"
                  >
                    <CircleAlert />
                  </Button>
                </QuickTooltip>
              )}
            </div>
          </div>
          <div className="w-full mt-2 relative">
            <EditableText
              component="p"
              className={cn(
                "w-full outline-none focus:outline-none rounded-lg",
                !isEditing && "line-clamp-2 whitespace-pre-wrap",
                isEditing &&
                  "py-1 px-2 ring-2 ring-black/20 dark:ring-white/20 focus:ring-primary dark:focus:ring-primary",
                isEditing &&
                  shortDescriptionError &&
                  "ring-destructive/50 dark:ring-destructive/50 focus:ring-destructive dark:focus:ring-destructive pr-8",
                isEditing &&
                  editingData.shortDescription.replaceAll("\n", "") === "" &&
                  "text-muted-foreground"
              )}
              placeholder="No short description provided."
              editable={isEditing}
              multiline={true}
              value={
                isEditing ? editingData.shortDescription : (data?.shortDescription?.text || "")
              }
              onChange={(value: string) => {
                console.log(value);
                setEditingData({
                  ...editingData,
                  shortDescription: value,
                });
              }}
            />
            {shortDescriptionError && (
              <QuickTooltip
                asChild
                content={shortDescriptionError}
                contentClassName="text-white"
                backgroundColor="var(--destructive)"
              >
                <Button
                  variant={"destructive"}
                  size={"icon-sm"}
                  className="absolute top-1 right-1 h-6 w-6"
                >
                  <CircleAlert />
                </Button>
              </QuickTooltip>
            )}
          </div>
          {/* <EditableText
            component="p"
            value={
              isEditing ? editingData.shortDescription : data.shortDescription
            }
            onChange={(text) => {
              setEditingData({
                ...editingData,
                shortDescription: text,
              });
            }}
            isEditing={isEditing}
            placeholder="No short description provided."
            className={cn(
              "w-full mt-2 outline-none focus:outline-none rounded-lg",
              isEditing && "px-2 ring-2 ring-black/20 focus:ring-ring",
              isEditing &&
                editingData.shortDescription === "" &&
                "text-muted-foreground"
            )}
            allowNewLine={true}
          /> */}

          {/* {isEditing ? (
            <Input
              value={editingData.shortDescription}
              placeholder="Short description"
              className="bg-background h-8 w-full mt-2"
              onChange={(e) =>
                setEditingData({
                  ...editingData,
                  shortDescription: e.target.value,
                })
              }
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              {data.shortDescription === ""
                ? "No short description provided."
                : data.shortDescription}
            </p>
          )} */}
        </div>
      </div>
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{
              opacity: 0,
              filter: "blur(10px)",
              scale: 0.75,
            }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
              scale: 1,
            }}
            exit={{
              opacity: 0,
              filter: "blur(10px)",
              scale: 0.75,
            }}
            className="absolute top-2 right-2 flex items-center gap-2"
          >
            <Button
              variant={"outline"}
              onClick={() => {
                pushModal(
                  {
                    id: ImageEditorModalId + `/${did}/cover-image`,
                    content: (
                      <ImageEditorModal
                        title="Edit Organization Cover Image"
                        description="Choose an image to update the organization cover image."
                        initialImage={editingData.coverImage}
                        did={did}
                        onImageChange={(image) => {
                          setEditingData({
                            ...editingData,
                            coverImage: image,
                          });
                        }}
                      />
                    ),
                  },
                  true
                );
                show();
              }}
            >
              <Pencil />
              Cover Image
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hero;
