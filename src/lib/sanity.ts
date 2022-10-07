import sanityClient from "@sanity/client";

const SanityClient = sanityClient({
  projectId: "pgq2pd26",
  dataset: "production",
  apiVersion: "2021-04-10",
  useCdn: true,
});

export default SanityClient;
