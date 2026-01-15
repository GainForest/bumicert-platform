export const links = {
  ecocert: {
    create: "/ecocert/create",
    createWithDraftId: (draftId: string) => `/ecocert/create/${draftId}`,
    view: (ecocertId: string) => `/ecocert/${ecocertId}`,
  },
};
