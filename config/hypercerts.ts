const config = {
  dev: {
    graphql: "https://staging-api.hypercerts.org/v2/graphql",
    rest: "https://staging-api.hypercerts.org/v2",
    hyperboardId: "3e42687a-ceeb-48f7-b8ab-99533ff0a81c",
    collectionId: "0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941",
  },
  prod: {
    graphql: "https://api.hypercerts.org/v2/graphql",
    rest: "https://api.hypercerts.org/v2",
    hyperboardId: "3b781a5b-0783-4632-8f8f-8fdf67ed4454",
    collectionId: "0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941",
  },
};

const env =
  process.env.NEXT_PUBLIC_DEPLOY_ENV === "production" ? "prod" : "dev";

export const hypercertsGraphqlEndpoint = config[env].graphql;
export const hypercertsRestEndpoint = config[env].rest;
export const hypercertsHyperboardId = config[env].hyperboardId;
export const hypercertsCollectionId = config[env].collectionId;
