"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lightbulb, X } from "lucide-react";
import React, { useEffect, useEffectEvent, useMemo, useState } from "react";
import useNewBumicertStore from "../store";
import { STEPS } from "../_data/steps";
import { useFormStore } from "../form-store";
import { useNavbarContext } from "@/components/global/Navbar/context";
import { AnimatePresence, motion } from "framer-motion";

const StepFooter = () => {
  const { currentStepIndex, setCurrentStepIndex } = useNewBumicertStore();
  const { viewport } = useNavbarContext();
  const showTipButton = viewport === "mobile";
  const [showTips, setShowTips] = useState(false);

  // Hide the tips each time the viewport changes to mobile.
  const hideTipsOnViewportChangeToMobile = useEffectEvent(
    (v: typeof viewport) => {
      if (v === "mobile") {
        setShowTips(false);
      }
    }
  );
  useEffect(() => {
    hideTipsOnViewportChangeToMobile(viewport);
  }, [viewport]);

  const completionPercentages = useFormStore(
    (state) => state.formCompletionPercentages
  );
  const step1Progress = completionPercentages[0];
  const step2Progress = completionPercentages[1];
  const step3Progress = completionPercentages[2];

  const allowUserToMoveForward = useMemo(() => {
    // For steps 1, 2 and 3.
    if (currentStepIndex < 3) return true;
    // For step 4.
    if (currentStepIndex === 3) {
      return (
        step1Progress === 100 && step2Progress === 100 && step3Progress === 100
      );
    }
    // For step 5.
    return false;
  }, [currentStepIndex, step1Progress, step2Progress, step3Progress]);

  return (
    <AnimatePresence>
      {showTipButton && showTips && (
        <TipsPopup onClose={() => setShowTips(false)} key={"tips-popup"} />
      )}
      <div className="w-full sticky bottom-0 z-7">
        {/* Subtle gradient fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none" />
        
        <div className="relative flex items-center justify-between px-4 py-3 z-8">
          <div className="flex items-center flex-1 gap-2">
            <AnimatePresence>
              {showTipButton && !showTips && (
                <Button
                  variant="ghost"
                  size="sm"
                  component={motion.button}
                  componentProps={{
                    initial: { opacity: 0, scale: 0.95 },
                    animate: { opacity: 1, scale: 1 },
                    exit: { opacity: 0, scale: 0.95 },
                    layoutId: "tips-popup",
                    layoutRoot: true,
                  }}
                  onClick={() => setShowTips(true)}
                  className="gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <motion.span layoutId="tips-icon">
                    <Lightbulb className="size-4" strokeWidth={1.5} />
                  </motion.span>
                  <motion.span layoutId="tips-text" className="text-sm">Tips</motion.span>
                </Button>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-2">
            {currentStepIndex < 4 && (
              <Button
                onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
                disabled={!allowUserToMoveForward}
                size="sm"
                className="gap-1.5 disabled:opacity-40"
              >
                <span>Continue</span>
                <ArrowRight className="size-4" strokeWidth={1.5} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

const TipsPopup = ({ onClose }: { onClose: () => void }) => {
  const { currentStepIndex } = useNewBumicertStore();
  return (
    <>
      <div className="fixed z-100 inset-0 bg-black/40 backdrop-blur-sm" />
      <motion.div
        layoutId="tips-popup"
        className="fixed bottom-4 left-4 right-4 z-110 bg-background border border-border/50 rounded-xl p-5 shadow-xl"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.span layoutId="tips-icon">
              <Lightbulb className="size-4 text-foreground/70" strokeWidth={1.5} />
            </motion.span>
            <motion.span layoutId="tips-text" className="font-medium">
              Tips
            </motion.span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-foreground/5 transition-colors"
          >
            <X className="size-4 text-muted-foreground" strokeWidth={1.5} />
          </button>
        </div>
        <div className="text-sm text-foreground/80">
          {STEPS[currentStepIndex].tips.pre && (
            <p className="mb-2">{STEPS[currentStepIndex].tips.pre}</p>
          )}
          <ul className="space-y-1.5 text-muted-foreground">
            {STEPS[currentStepIndex].tips.bullets.map((tip, index) => (
              <li key={index} className="flex gap-2">
                <span className="text-foreground/30">-</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
          {STEPS[currentStepIndex].tips.post && (
            <p className="mt-2 text-foreground/80">{STEPS[currentStepIndex].tips.post}</p>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default StepFooter;
