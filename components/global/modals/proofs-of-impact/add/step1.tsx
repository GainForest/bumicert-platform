import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useModal } from "@/components/ui/modal/context";
import { ModalFooter } from "@/components/ui/modal/modal";
import { ArrowRight } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AddProofsOfImpactStep2, { AddProofsOfImpactStep2ModalId } from "./step2";
import useAddPoiStore from "./store";
import QuickModal from "@/components/ui/quick-modal";

const MAX_TITLE_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 450;

export const AddProofsOfImpactStep1ModalId = "proofs-of-impact/add/step1";
const AddProofsOfImpactStep1 = ({ bumicertId }: { bumicertId: string }) => {
  const { stack, pushModal } = useModal();
  const { setStep1State } = useAddPoiStore();
  const formSchema = z.object({
    title: z
      .string()
      .trim()
      .min(5, { message: "Title must be at least 5 characters" })
      .max(MAX_TITLE_LENGTH, {
        message: `Title must be at most ${MAX_TITLE_LENGTH} characters`,
      }),
    description: z
      .string()
      .trim()
      .min(20, { message: "Description must be at least 20 characters" })
      .max(MAX_DESCRIPTION_LENGTH, {
        message: `Description must be at most ${MAX_DESCRIPTION_LENGTH} characters`,
      }),
  });

  type FormValues = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: { title: "", description: "" },
  });

  const titleValue = watch("title");
  const descriptionValue = watch("description");

  const onFormSubmit = handleSubmit(() => {
    setStep1State({
      bumicertId: bumicertId,
      title: titleValue,
      description: descriptionValue,
    });
    pushModal({
      id: AddProofsOfImpactStep2ModalId,
      content: <AddProofsOfImpactStep2 />,
    });
  });

  return (
    <QuickModal
      title="Add Proofs of Impact"
      description="Enter title and description."
      footer={
        <Button type="submit" disabled={!isValid || isSubmitting}>
          Continue
          <ArrowRight />
        </Button>
      }
      dismissible={stack.length === 1}
    >
      <form
        className="flex flex-col gap-2 text-sm text-muted-foreground mt-4"
        onSubmit={onFormSubmit}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="font-bold">Title</span>
            <span>
              {titleValue?.length ?? 0}/{MAX_TITLE_LENGTH}
            </span>
          </div>
          <Input
            className="text-foreground"
            placeholder="E.g. Impact Report"
            aria-invalid={!!errors.title}
            {...register("title")}
          />
          {errors.title && (
            <span className="text-destructive text-xs">
              {errors.title.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="font-bold">Description</span>
            <span>
              {descriptionValue?.length ?? 0}/{MAX_DESCRIPTION_LENGTH}
            </span>
          </div>
          <Textarea
            className="text-foreground max-h-60"
            placeholder="Description"
            aria-invalid={!!errors.description}
            {...register("description")}
          />
          {errors.description && (
            <span className="text-destructive text-xs">
              {errors.description.message}
            </span>
          )}
        </div>
        <ModalFooter>
          <Button type="submit" disabled={!isValid || isSubmitting}>
            Continue
            <ArrowRight />
          </Button>
        </ModalFooter>
      </form>
    </QuickModal>
  );
};

export default AddProofsOfImpactStep1;
