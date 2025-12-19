"use client";
import React, { useEffect } from "react";
import FormField from "../../../../../../../components/ui/FormField";
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
  ChevronRight,
} from "lucide-react";
import { useFormStore } from "../../form-store";
import { Checkbox } from "@/components/ui/checkbox";
import useNewEcocertStore from "../../store";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { useAtprotoStore } from "@/components/stores/atproto";
import { trpcApi } from "@/components/providers/TrpcProvider";
import { useModal } from "@/components/ui/modal/context";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  SiteEditorModal,
  SiteEditorModalId,
} from "@/components/global/modals/upload/site/editor";

const formatCoordinate = (coordinate: string) => {
  const num = parseFloat(coordinate);
  if (isNaN(num)) return coordinate;
  return num.toFixed(2);
};

const Step3 = () => {
  const { maxStepIndexReached, currentStepIndex } = useNewEcocertStore();
  const shouldShowValidationErrors = currentStepIndex < maxStepIndexReached;

  const formValues = useFormStore((state) => state.formValues[2]);
  const errors = useFormStore((state) => state.formErrors[2]);
  const setFormValue = useFormStore((state) => state.setFormValue[2]);
  const updateErrorsAndCompletion = useFormStore(
    (state) => state.updateErrorsAndCompletion
  );
  const { contributors, confirmPermissions, agreeTnc, siteBoundaries } =
    formValues;

  const addContributor = (name: string) => {
    setFormValue("contributors", [...contributors, name]);
  };
  const updateContributor = (index: number, name: string) => {
    const newContributors = [...contributors];
    newContributors[index] = name;
    setFormValue("contributors", newContributors);
  };
  const removeContributor = (index: number) => {
    setFormValue(
      "contributors",
      contributors.filter((_, i) => i !== index)
    );
  };

  useEffect(() => {
    updateErrorsAndCompletion();
  }, [shouldShowValidationErrors]);

  const auth = useAtprotoStore((state) => state.auth);
  const { pushModal, show } = useModal();
  const onAddSite = () => {
    pushModal(
      {
        id: SiteEditorModalId,
        content: <SiteEditorModal initialData={null} />,
      },
      true
    );
    show();
  };
  const {
    data: sitesResponse,
    isPending: isSitesPending,
    isPlaceholderData: isOlderSites,
    error: sitesFetchError,
  } = trpcApi.gainforest.organization.site.getAll.useQuery(
    {
      did: auth.user?.did ?? "",
      pdsDomain: allowedPDSDomains[0],
    },
    {
      enabled: !!auth.user?.did,
    }
  );
  const sites = sitesResponse?.sites;
  console.log("==============");
  console.log(JSON.stringify(sites, null, 2));
  console.log("==============");
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
          error={errors.siteBoundaries}
          showError={shouldShowValidationErrors}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Select a site for this ecocert, or add a new one.
            </span>
            {auth.user?.did && (
              <span className="text-sm text-muted-foreground">
                <Link
                  href={`/organization/${auth.user.did}`}
                  className="flex items-center text-primary hover:underline"
                >
                  Manage sites <ChevronRight className="size-4" />
                </Link>
              </span>
            )}
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
                {!sites || sites.length === 0 ? (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <span className="text-sm text-muted-foreground">
                      {sitesFetchError
                        ? "Unable to load sites."
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
                ) : (
                  <div className="grid grid-cols-2 gap-1 p-2">
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
                          onClick={() => {
                            if (siteBoundaries === site.uri) {
                              setFormValue("siteBoundaries", "");
                            } else {
                              setFormValue("siteBoundaries", site.uri);
                            }
                          }}
                        >
                          {siteBoundaries === site.uri ? (
                            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                              <Check className="size-3 text-white" />
                            </div>
                          ) : (
                            <CircleDashed className="size-5 text-muted-foreground" />
                          )}
                          <div className="flex flex-col items-start justify-start">
                            <span className="text-base font-medium">
                              {siteData.name}
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-muted-foreground mr-1">
                                {siteData.area} ha
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {"("}
                                {formatCoordinate(siteData.lat)}°,{" "}
                                {formatCoordinate(siteData.lon)}°{")"}
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
                )}
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
                setFormValue(
                  "confirmPermissions",
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
                setFormValue(
                  "agreeTnc",
                  checked === "indeterminate" ? false : checked
                )
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
