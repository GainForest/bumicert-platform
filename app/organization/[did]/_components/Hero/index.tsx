"use client";

import type { AppGainforestOrganizationInfo } from "@/lexicon-api";
import getBlobUrl from "@/lib/atproto/getBlobUrl";
import { BadgeCheck, Pencil } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";
import { useOrganizationPageStore } from "../../store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useModal } from "@/components/ui/modal/context";
import {
  ImageEditorModal,
  ImageEditorModalId,
} from "../../_modals/image-editor";
import { BlobRef } from "@atproto/api";
import useHydratedData from "@/hooks/use-hydration";
import { toBlobRef, type BlobRefJSON } from "@/server/routers/atproto/utils";

const getImageUrl = (image: File | BlobRef | undefined, did: string) => {
  if (image instanceof File) {
    return URL.createObjectURL(image);
  }
  if (image === undefined) {
    return undefined;
  }
  return getBlobUrl(did, image);
};

const Hero = ({
  initialData,
  initialDid,
}: {
  initialData: AppGainforestOrganizationInfo.Record;
  initialDid: string;
}) => {
  const reactiveData = useOrganizationPageStore((state) => state.data);
  const data = useHydratedData(initialData, reactiveData);

  const reactiveDid = useOrganizationPageStore((state) => state.did);
  const did = useHydratedData(initialDid, reactiveDid);

  const isEditing = useOrganizationPageStore((state) => state.isEditing);
  const editingData = useOrganizationPageStore(
    (state) => state.heroEditingData
  );
  const setEditingData = useOrganizationPageStore(
    (actions) => actions.setHeroEditingData
  );
  const { show, pushModal } = useModal();

  useEffect(() => {
    setEditingData({
      displayName: data.displayName,
      shortDescription: data.shortDescription,
      coverImage: data.coverImage ? data.coverImage.image.toJSON() : undefined,
      logoImage: data.logo ? data.logo.image.toJSON() : undefined,
    });
  }, [isEditing, data]);

  const coverImageUrl =
    data.coverImage ? getBlobUrl(did, data.coverImage.image) : null;
  const editingCoverImageUrl =
    editingData.coverImage ?
      editingData.coverImage instanceof File ?
        getImageUrl(editingData.coverImage, did)
      : getBlobUrl(did, editingData.coverImage)
    : null;
  const logoImageUrl = data.logo ? getBlobUrl(did, data.logo.image) : null;
  const editingLogoImageUrl =
    editingData.logoImage ?
      editingData.logoImage instanceof File ?
        getImageUrl(editingData.logoImage, did)
      : getBlobUrl(did, editingData.logoImage)
    : null;

  return (
    <div className="w-full h-60 rounded-t-2xl overflow-hidden relative">
      {isEditing ?
        editingCoverImageUrl ?
          <Image
            src={editingCoverImageUrl}
            alt="Cover Image"
            fill
            className="object-cover"
          />
        : <div className="absolute inset-0 bg-muted" />
      : coverImageUrl ?
        <Image
          src={coverImageUrl}
          alt="Cover Image"
          fill
          className="object-cover"
        />
      : <div className="absolute inset-0 bg-muted" />}
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-background">
        {isEditing ?
          <Button
            variant={"outline"}
            className="absolute top-2 left-2 rounded-full flex items-center gap-1.5 h-auto px-1 pr-2 py-1"
            onClick={() => {
              pushModal(
                {
                  id: ImageEditorModalId + `/${did}/logo-image`,
                  content: (
                    <ImageEditorModal
                      title="Edit Organization Logo"
                      description="Choose an image to update the organization logo."
                      initialImage={
                        editingData.logoImage instanceof File ?
                          editingData.logoImage
                        : editingData.logoImage ?
                          toBlobRef(editingData.logoImage)
                        : undefined
                      }
                      did={did}
                      onImageChange={(image) => {
                        setEditingData({
                          ...editingData,
                          logoImage:
                            image instanceof File ? image
                            : image ? (image.toJSON() as BlobRefJSON)
                            : undefined,
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
              {editingLogoImageUrl && (
                <Image
                  src={editingLogoImageUrl}
                  alt="Logo Image"
                  fill
                  className={cn("object-cover", isEditing && "blur-xs")}
                />
              )}
              <div className="absolute inset-0 bg-foreground/30 rounded-full flex items-center justify-center">
                <Pencil className="size-4 text-background" />
              </div>
            </div>
            Logo
          </Button>
        : <div className="absolute top-2 left-2 h-8 w-8 rounded-full bg-muted overflow-hidden">
            {logoImageUrl && (
              <Image
                src={logoImageUrl}
                alt="Logo Image"
                fill
                className={cn("object-cover", isEditing && "blur-xs")}
              />
            )}
          </div>
        }

        <div className="absolute bottom-6 left-0 right-0 p-4">
          <div className="flex items-center gap-2">
            <BadgeCheck className="size-8" />

            {isEditing ?
              <Input
                value={editingData.displayName}
                className="bg-background max-w-md"
                placeholder="Organization name"
                onChange={(e) =>
                  setEditingData({
                    ...editingData,
                    displayName: e.target.value,
                  })
                }
              />
            : <h1 className="text-3xl font-bold font-serif">
                {data.displayName === "" ? "Untitled" : data.displayName}
              </h1>
            }
          </div>

          {isEditing ?
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
          : <p className="text-sm text-muted-foreground">
              {data.shortDescription === "" ?
                "No short description provided."
              : data.shortDescription}
            </p>
          }
        </div>
      </div>
      {isEditing && (
        <div className="absolute top-2 right-2 flex items-center gap-2">
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
                      initialImage={
                        editingData.coverImage instanceof File ?
                          editingData.coverImage
                        : editingData.coverImage ?
                          toBlobRef(editingData.coverImage)
                        : undefined
                      }
                      did={did}
                      onImageChange={(image) => {
                        setEditingData({
                          ...editingData,
                          coverImage:
                            image instanceof File ? image
                            : image ? (image.toJSON() as BlobRefJSON)
                            : undefined,
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
        </div>
      )}
    </div>
  );
};

export default Hero;
