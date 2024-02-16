import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "pgq2pd26",
  dataset: "production",
  apiVersion: "2021-04-10",
  useCdn: true,
});
