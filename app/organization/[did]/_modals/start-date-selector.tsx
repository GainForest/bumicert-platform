import { Calendar } from "@/components/ui/calendar";
import { useModal } from "@/components/ui/modal/context";
import {
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal/modal";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export const StartDateSelectorModalId = "start-date-selector-modal";

export const StartDateSelectorModal = ({
  initialStartDate,
  onStartDateChange,
}: {
  initialStartDate: Date;
  onStartDateChange: (startDate: Date) => void;
}) => {
  const [startDate, setStartDate] = useState(initialStartDate);
  const { popModal, stack, hide } = useModal();
  const handleDone = (startDate: Date) => {
    onStartDateChange(startDate);
    if (stack.length === 1) {
      hide().then(() => {
        popModal();
      });
    } else {
      popModal();
    }
  };
  useEffect(() => {
    setStartDate(initialStartDate);
  }, [initialStartDate]);
  useEffect(() => {
    onStartDateChange(startDate);
  }, [startDate]);
  return (
    <ModalContent>
      <ModalHeader>
        <ModalTitle>Select Start Date</ModalTitle>
        <ModalDescription>
          Select the start date for your organization.
        </ModalDescription>
      </ModalHeader>
      <div className="flex flex-col gap-4 mt-4">
        <Calendar
          required
          mode="single"
          captionLayout="dropdown"
          className="w-full"
          selected={startDate}
          onSelect={setStartDate}
          defaultMonth={startDate}
        />
      </div>
      <ModalFooter>
        <Button onClick={() => handleDone(startDate)}>Done</Button>
      </ModalFooter>
    </ModalContent>
  );
};
