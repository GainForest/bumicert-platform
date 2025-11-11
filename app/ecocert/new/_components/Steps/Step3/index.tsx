"use client";
import React, { useEffect, useState } from "react";
import FormField from "../components/FormField";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import {
  Users,
  ShieldCheck,
  Map,
  PlusCircle,
  Globe2,
  Trash2,
} from "lucide-react";
import { useStep3Store } from "./store";
import { Checkbox } from "@/components/ui/checkbox";
import FileInput from "../components/FileInput";
import useNewEcocertStore from "../../../store";

const Step3 = () => {
  const [geoJsonFile, setGeoJsonFile] = useState<File | null>(null);

  const { maxStepIndexReached, currentStepIndex } = useNewEcocertStore();
  const shouldShowValidationErrors = currentStepIndex < maxStepIndexReached;

  const {
    formValues: {
      contributors,
      siteBoundaryGeoJson,
      confirmPermissions,
      agreeTnc,
    },
    addContributor,
    updateContributor,
    removeContributor,
    setSiteBoundaryGeoJson,
    setConfirmPermissions,
    setAgreeTnc,
    errors,
    updateValidationsAndCompletionPercentage,
  } = useStep3Store();

  useEffect(() => {
    updateValidationsAndCompletionPercentage();
  }, [shouldShowValidationErrors]);

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
          label="Upload Site Boundaries"
          description="Please upload your site boundary in GeoJSON format so we can visualize your project on the map."
        >
          <InputGroup className="h-8 bg-background">
            <InputGroupAddon>
              <Globe2 />
            </InputGroupAddon>
            <InputGroupInput placeholder="Paste URL to a GeoJSON file" />
          </InputGroup>
          <div className="flex items-center justify-center text-muted-foreground text-sm uppercase">
            <span>or</span>
          </div>
          <FileInput
            placeholder="Upload or drag and drop a GeoJSON file"
            supportedFileTypes={[
              "application/geo+json",
              "application/json",
              ".geojson",
            ]}
            onFileChange={(file) => {
              setGeoJsonFile(file);
              if (file) {
                // Convert File to Blob URL for storage
                const url = URL.createObjectURL(file);
                setSiteBoundaryGeoJson(url);
              } else {
                if (
                  siteBoundaryGeoJson &&
                  siteBoundaryGeoJson.startsWith("blob:")
                ) {
                  URL.revokeObjectURL(siteBoundaryGeoJson);
                }
                setSiteBoundaryGeoJson(null);
              }
            }}
            value={geoJsonFile}
          />
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
