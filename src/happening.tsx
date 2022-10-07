import { Action, ActionPanel, Detail, List, useNavigation } from "@raycast/api";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { useState, useEffect } from "react";
import ErrorDetail from "./components/error-detail";
import { isErrorMessage } from "./lib/error";
import HappeningAPI, {
  Happening,
  HappeningOverview,
  HappeningType,
} from "./lib/happening";

interface Props {
  type: HappeningType;
}

const Happening = ({ type }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [upcoming, setUpcoming] = useState<Array<HappeningOverview>>();
  const [previous, setPrevious] = useState<Array<HappeningOverview>>();
  const [error, setError] = useState<string>();
  const [filter, setFilter] = useState<"all" | "upcoming" | "previous">("all");

  useEffect(() => {
    const fetchHappenings = async () => {
      const happenings = await HappeningAPI.getAllByType(type);

      if (isErrorMessage(happenings)) {
        setError(happenings.message);
      } else {
        const upcoming = happenings.filter((h) => {
          const date = new Date(h.date);
          return date.getTime() > new Date().getTime();
        });

        const previous = happenings.filter((h) => {
          const date = new Date(h.date);
          return date.getTime() < new Date().getTime();
        });

        setUpcoming(upcoming.reverse());
        setPrevious(previous);
      }

      setIsLoading(false);
    };

    void fetchHappenings();
  }, [filter]);

  return (
    <>
      {error && <ErrorDetail message={error} />}
      {!error && (
        <List
          isLoading={isLoading}
          searchBarAccessory={
            <List.Dropdown
              tooltip="Filtrer bedpresser og arrangementer."
              onChange={(value) =>
                setFilter(value as "all" | "upcoming" | "previous")
              }
            >
              <List.Dropdown.Item title="Alle" value="all" />
              <List.Dropdown.Item title="Tidligere" value="previous" />
              <List.Dropdown.Item title="Kommende" value="upcoming" />
            </List.Dropdown>
          }
          enableFiltering
        >
          {filter === "upcoming" && (
            <List.Section title="Kommende">
              {upcoming?.map((happening, i) => (
                <HappeningPreview key={i} type={type} happening={happening} />
              ))}
            </List.Section>
          )}
          {filter === "previous" && (
            <List.Section title="Tidligere">
              {previous?.map((happening, i) => (
                <HappeningPreview key={i} type={type} happening={happening} />
              ))}
            </List.Section>
          )}
          {filter === "all" && (
            <>
              <List.Section title="Kommende">
                {upcoming?.map((happening, i) => (
                  <HappeningPreview key={i} type={type} happening={happening} />
                ))}
              </List.Section>
              <List.Section title="Tidligere">
                {previous?.map((happening, i) => (
                  <HappeningPreview key={i} type={type} happening={happening} />
                ))}
              </List.Section>
            </>
          )}
        </List>
      )}
    </>
  );
};

const HappeningPreview = ({
  type,
  happening,
}: {
  type: HappeningType;
  happening: HappeningOverview;
}) => {
  const { push } = useNavigation();

  return (
    <List.Item
      title={happening.title}
      subtitle={format(new Date(happening.date), "d. MMMM yyyy", {
        locale: nb,
      })}
      actions={
        <ActionPanel>
          <Action
            title="Vis arrangement"
            onAction={() =>
              push(<HappeningBySlug type={type} slug={happening.slug} />)
            }
          />
        </ActionPanel>
      }
    />
  );
};

const HappeningBySlug = ({
  type,
  slug,
}: {
  type: HappeningType;
  slug: string;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [happening, setHappening] = useState<Happening | null>();

  useEffect(() => {
    const fetchPost = async () => {
      const post = await HappeningAPI.getHappeningBySlug(type, slug);

      if (isErrorMessage(post)) {
        setHappening(null);
      } else {
        setHappening(post);
      }

      setIsLoading(false);
    };

    void fetchPost();
  }, []);

  const markdown = `
  # ${happening?.title}

  ${happening?.body}
  `;

  return (
    <>
      {happening && (
        <Detail
          isLoading={isLoading}
          markdown={markdown}
          navigationTitle={happening.title}
          metadata={
            <Detail.Metadata>
              <Detail.Metadata.Label
                title="Publisert av"
                text={happening.author}
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
      )}
    </>
  );
};

export default Happening;
