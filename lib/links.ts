type DidDynamicLink = (did?: string) => string;
const didCatcher = (callback: (did: string) => string): DidDynamicLink => {
  return (did) => (did === undefined ? "#" : callback(did));
};

export const links = {
  organization: didCatcher((did) => `/organization/${did}`),
  upload: {
    organization: didCatcher((did) => `/upload/organization/${did}`),
    projects: didCatcher((did) => `/upload/organization/${did}/projects`),
    sites: didCatcher((did) => `/upload/organization/${did}/sites`),
    layers: didCatcher((did) => `/upload/organization/${did}/layers`),
    bumicerts: didCatcher((did) => `/upload/organization/${did}/bumicerts`),
  },
  user: didCatcher((did) => `/user/${did}`),
  explore: "/explore",
  bumicert: {
    create: "/bumicert/create",
    createWithDraftId: (draftId: string) => `/bumicert/create/${draftId}`,
    view: (bumicertId: string) => `/bumicert/${bumicertId}`,
  },
};
