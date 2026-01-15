export const links = {
  organization: (did: string) => `/organization/${did}`,
  upload: {
    organization: (did: string) => `/upload/organization/${did}`,
    projects: (did: string) => `/upload/organization/${did}/projects`,
    sites: (did: string) => `/upload/organization/${did}/sites`,
    layers: (did: string) => `/upload/organization/${did}/layers`,
    bumicerts: (did: string) => `/upload/organization/${did}/bumicerts`,
  },
  explore: "/explore",
  bumicert: {
    create: "/bumicert/create",
    createWithDraftId: (draftId: string) => `/bumicert/create/${draftId}`,
    view: (bumicertId: string) => `/bumicert/${bumicertId}`,
  },
};
