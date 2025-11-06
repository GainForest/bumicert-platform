export const STEPS = [
  {
    title: "Project Details",
    description: "Tell us about your project.",
    isRequiredToMoveForward: false,
  },
  {
    title: "Impact Details",
    description: "Tell us about the impact of your project.",
    isRequiredToMoveForward: false,
  },
  {
    title: "Site Details",
    description: "Tell us about the site of your project.",
    isRequiredToMoveForward: false,
  },
  {
    title: "Review",
    description: "Review your project details.",
    isRequiredToMoveForward: true,
  },
  {
    title: "Submit",
    description: "Submit your project details.",
    isRequiredToMoveForward: true,
  },
] as const;
