"use client";
import React, { useEffect } from "react";
import FormField from "../components/FormField";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import {
  Users,
  ShieldCheck,
  Map,
  PlusCircle,
  Trash2,
  Loader2,
  Loader2Icon,
  CircleDashed,
  Check,
} from "lucide-react";
import { useStep3Store } from "./store";
import { Checkbox } from "@/components/ui/checkbox";
import useNewEcocertStore from "../../../store";
import { useQuery } from "@tanstack/react-query";
import { trpcClient } from "@/lib/trpc/client";
import { useAtprotoStore } from "@/components/stores/atproto";
import { useModal } from "@/components/ui/modal/context";
import { AddSiteModalId } from "./AddSiteModal";
import { AddSiteModal } from "./AddSiteModal";
import { cn } from "@/lib/utils";

const Step3 = () => {
  const { maxStepIndexReached, currentStepIndex } = useNewEcocertStore();
  const shouldShowValidationErrors = currentStepIndex < maxStepIndexReached;

  const {
    formValues: { contributors, confirmPermissions, agreeTnc, siteBoundaries },
    addContributor,
    updateContributor,
    removeContributor,
    setSiteBoundaries,
    setConfirmPermissions,
    setAgreeTnc,
    errors,
    updateValidationsAndCompletionPercentage,
  } = useStep3Store();

  useEffect(() => {
    updateValidationsAndCompletionPercentage();
  }, [shouldShowValidationErrors]);

  const auth = useAtprotoStore((state) => state.auth);
  const { pushModal, show } = useModal();
  const onAddSite = () => {
    pushModal(
      {
        id: AddSiteModalId,
        content: <AddSiteModal />,
      },
      true
    );
    show();
  };
  const {
    data: sites,
    isPending: isSitesPending,
    isPlaceholderData: isOlderSites,
    error: sitesFetchError,
  } = useQuery({
    queryKey: ["getAllSites", auth.user?.did],
    queryFn: async () => {
      if (!auth.user?.did) throw new Error("User is not authenticated");
      const response = await trpcClient.gainforest.site.getAll.query({
        did: auth.user?.did,
      });
      return response;
    },
    enabled: !!auth.user?.did,
  });
  const isSitesLoading = isSitesPending || isOlderSites;

  return (
    <div>
      <h1 className="text-3xl font-bold font-serif">
        Contributors, Sites, and Permissions
      </h1>
      <div className="flex flex-col gap-2 mt-4">
        <FormField
          Icon={Users}
          label="List of Contributors"
          description="Add everyone involved in this project — including your own community or organization and any collaborators. Tip: Start by adding your own group first before listing your partners or supporters."
          error={errors.contributors}
          showError={shouldShowValidationErrors}
        >
          {contributors.length === 0 && (
            <button
              className="border border-dashed bg-background/50 p-4 rounded-lg flex flex-col items-center justify-center gap-2"
              onClick={() => addContributor("")}
            >
              <PlusCircle className="size-5 opacity-50" />
              <span className="text-sm text-center">
                Tap anywhere to add a contributor.
              </span>
            </button>
          )}
          {contributors.length > 0 && (
            <>
              <div className="flex flex-col gap-2">
                {contributors.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <InputGroup className="bg-background flex-1">
                      <InputGroupInput
                        placeholder="Community / Organization name"
                        value={c}
                        onChange={(e) => updateContributor(i, e.target.value)}
                      />
                    </InputGroup>
                    <Button
                      variant="outline"
                      onClick={() => removeContributor(i)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center">
                <Button variant="outline" onClick={() => addContributor("")}>
                  <PlusCircle /> Add another contributor
                </Button>
              </div>
            </>
          )}
        </FormField>

        <FormField
          Icon={Map}
          label="Site Boundaries"
          description="Please upload your site boundary in GeoJSON format so we can visualize your project on the map."
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Select the sites for this ecocert, or upload a new site.
            </span>
            <span className="text-sm text-muted-foreground">
              {isSitesLoading ?
                <Loader2Icon className="animate-spin size-3" />
              : sites?.length ?
                `${sites.length} site${sites.length > 1 ? "s" : ""} found.`
              : "No sites found."}
            </span>
          </div>

          <div className="h-40 w-full border border-dashed border-border rounded-lg bg-background/50">
            {isSitesLoading && (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-muted-foreground size-4" />
                <span className="text-sm text-muted-foreground">
                  Loading your sites...
                </span>
              </div>
            )}
            {!isSitesLoading && (
              <>
                {!sites || sites.length === 0 ?
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <span className="text-sm text-muted-foreground">
                      {sitesFetchError ?
                        "Unable to load sites."
                      : "No site found."}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={onAddSite}
                    >
                      <PlusCircle /> Add a site
                    </Button>
                  </div>
                : <div className="grid grid-cols-2 gap-1 p-2">
                    {sites.map((site) => {
                      const siteData = site.value;
                      return (
                        <Button
                          key={site.cid}
                          variant={"outline"}
                          size="sm"
                          className={cn(
                            "h-auto flex items-center justify-start px-4 pl-6 py-2 gap-3",
                            siteBoundaries === site.uri && "border-primary"
                          )}
                          onClick={() => setSiteBoundaries(site.uri)}
                        >
                          {siteBoundaries === site.uri ?
                            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                              <Check className="size-3 text-white" />
                            </div>
                          : <CircleDashed className="size-5 text-muted-foreground" />
                          }
                          <div className="flex flex-col items-start justify-start">
                            <span className="text-base font-medium">
                              {siteData.name}
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-muted-foreground mr-1">
                                {siteData.area} hectares
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {"("}
                                {siteData.lat}°, {siteData.lon}°{")"}
                              </span>
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      className="h-auto"
                      onClick={onAddSite}
                    >
                      <PlusCircle /> Add a site
                    </Button>
                  </div>
                }
              </>
            )}
          </div>
        </FormField>

        <FormField
          Icon={ShieldCheck}
          label="Permissions"
          className="text-sm"
          error={errors.confirmPermissions || errors.agreeTnc}
          showError={shouldShowValidationErrors}
        >
          <div className="flex items-start gap-2 mt-2">
            <Checkbox
              id="confirm-permissions"
              className="bg-background size-5"
              checked={confirmPermissions}
              onCheckedChange={(checked) =>
                setConfirmPermissions(
                  checked === "indeterminate" ? false : checked
                )
              }
            />
            <label
              className="inline-flex items-center gap-2"
              htmlFor="confirm-permissions"
            >
              I confirm that all listed contributors gave their permission to
              include their work in this Ecocert.
            </label>
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="agree-tnc"
              className="bg-background size-5"
              checked={agreeTnc}
              onCheckedChange={(checked) =>
                setAgreeTnc(checked === "indeterminate" ? false : checked)
              }
            />
            <label
              className="inline-flex items-center gap-2"
              htmlFor="agree-tnc"
            >
              I agree to the Terms & Conditions.
            </label>
          </div>
        </FormField>
      </div>
    </div>
  );
};

export default Step3;
