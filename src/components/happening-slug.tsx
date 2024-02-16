import { Detail } from "@raycast/api";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { useState, useEffect } from "react";
import { isErrorMessage } from "../lib/error";
import {
  Happening,
  HappeningType,
  getHappeningBySlug,
} from "../lib/sanity/happening";
import { capitalize } from "../lib/utils";

export function HappeningBySlug({
  type,
  slug,
}: {
  type: HappeningType;
  slug: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [happening, setHappening] = useState<Happening | null>();

  useEffect(() => {
    const fetchPost = async () => {
      const post = await getHappeningBySlug(type, slug);

      if (isErrorMessage(post)) {
        setHappening(null);
      } else {
        setHappening(post);
      }

      setIsLoading(false);
    };

    void fetchPost();
  }, []);

  if (!happening) {
    return null;
  }

  const markdown = `
# ${happening?.title}

${happening?.body ?? "Mer info kommer..."}
    `.trim();

  return (
    <Detail
      isLoading={isLoading}
      markdown={markdown}
      navigationTitle={happening.title}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label
            title="Publisert av"
            text={capitalize(happening.author)}
          />
          {happening.date && (
            <Detail.Metadata.Label
              title="Dato"
              text={format(new Date(happening.date), "dd. MMM yyyy", {
                locale: nb,
              })}
            />
          )}
          {happening.location && (
            <Detail.Metadata.Label title="Sted" text={happening.location} />
          )}
          <Detail.Metadata.Separator />
          <Detail.Metadata.Link
            title="Nettside"
            text="Vis på echo.uib.no"
            target={`https://echo.uib.no/event/${slug}`}
          />
        </Detail.Metadata>
      }
    />
  );
}
