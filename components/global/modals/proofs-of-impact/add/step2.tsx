import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useModal } from "@/components/ui/modal/context";
import { ModalFooter } from "@/components/ui/modal/modal";
import { ArrowRight, PlusCircle, Trash2 } from "lucide-react";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAddPoiStore from "./store";
import ModalErrorBody from "@/components/modal-error-body";
import QuickModal from "@/components/ui/quick-modal";
import AddProofsOfImpactStep3, { AddProofsOfImpactStep3ModalId } from "./step3";

const sourceSchema = z.object({
  key: z.string(),
  url: z
    .string()
    .trim()
    .url({ message: "Enter a valid URL" })
    .max(300, { message: "URL too long" }),
  description: z
    .string()
    .trim()
    .min(1, { message: "Description is required" })
    .max(200, { message: "Description must be at most 200 characters" }),
});

const formSchema = z
  .object({
    sources: z
      .array(sourceSchema)
      .min(1, { message: "Add at least one source" })
      .max(5, { message: "You can add up to 5 sources" }),
  })
  .refine((data) => data.sources.length <= 5, {
    message: "You can add up to 5 sources",
    path: ["sources"],
  });

type FormValues = z.infer<typeof formSchema>;

export const AddProofsOfImpactStep2ModalId = "proofs-of-impact-add-step-2";
const AddProofsOfImpactStep2 = () => {
  const { stack, hide, popModal, pushModal } = useModal();
  const { step1State, setStep2State } = useAddPoiStore();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      sources: [{ key: String(Date.now()), url: "", description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sources",
  });

  const onAddSource = () => {
    if (fields.length >= 5) return;
    append({
      key: String(Date.now() + Math.random()),
      url: "",
      description: "",
    });
  };

  const onRemoveSource = (index: number) => {
    remove(index);
  };

  const onSubmit = handleSubmit(() => {
    setStep2State({
      sources: fields.map((field) => ({
        url: field.url,
        description: field.description,
      })),
    });
    pushModal({
      id: AddProofsOfImpactStep3ModalId,
      content: <AddProofsOfImpactStep3 />,
    });
  });

  if (!step1State)
    return (
      <QuickModal
        title="Add Proofs of Impact"
        description="Something is wrong."
        dismissible={stack.length === 1}
      >
        <ModalErrorBody
          ctaText={stack.length > 1 ? "Go back" : "Close"}
          ctaAction={() => {
            if (stack.length === 1) hide();
            popModal();
          }}
        />
      </QuickModal>
    );

  return (
    <QuickModal
      title="Add Proofs of Impact"
      description="Add sources to back the impacts."
      dismissible={stack.length === 1}
    >
      <form className="flex flex-col gap-2 text-sm mt-4" onSubmit={onSubmit}>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-bold">Sources</span>
            <span className="text-muted-foreground">{fields.length}/5</span>
          </div>
          <Button
            variant={"outline"}
            onClick={onAddSource}
            disabled={fields.length >= 5}
          >
            <PlusCircle /> Add Source
          </Button>
        </div>
        {fields.map((field, index) => (
          <div className="flex flex-col gap-0" key={field.key}>
            <div className="flex items-center gap-1 w-full">
              <div className="flex flex-1 flex-col gap-0">
                <Input
                  placeholder="Enter URL of the source"
                  className="rounded-b-none"
                  aria-invalid={!!errors.sources?.[index]?.url}
                  {...register(`sources.${index}.url`)}
                />
                <Input
                  placeholder="Describe the source"
                  className="rounded-t-none"
                  aria-invalid={!!errors.sources?.[index]?.description}
                  {...register(`sources.${index}.description`)}
                />
              </div>
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => onRemoveSource(index)}
                disabled={fields.length === 1}
              >
                <Trash2 />
              </Button>
            </div>
            <div>
              {errors.sources?.[index] && (
                <span className="text-destructive text-xs px-3 py-1">
                  {[
                    errors.sources[index]?.url?.message as string | undefined,
                    errors.sources[index]?.description?.message as
                      | string
                      | undefined,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                </span>
              )}
            </div>
          </div>
        ))}
        {errors.sources && typeof errors.sources.message === "string" && (
          <span className="text-destructive text-xs">
            {errors.sources.message}
          </span>
        )}
        <ModalFooter>
          <Button type="submit" disabled={!isValid || isSubmitting}>
            Continue <ArrowRight />
          </Button>
        </ModalFooter>
      </form>
    </QuickModal>
  );
};

export default AddProofsOfImpactStep2;
