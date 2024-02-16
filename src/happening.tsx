import { List } from "@raycast/api";
import { useState, useEffect } from "react";
import { ErrorDetail } from "./components/error-detail";
import { isErrorMessage } from "./lib/error";
import { HappeningPreview } from "./components/happenings-preview";
import {
  HappeningOverview,
  HappeningType,
  getAllByType,
} from "./lib/sanity/happening";

interface Props {
  type: HappeningType;
}

export function Happenings({ type }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [upcoming, setUpcoming] = useState<Array<HappeningOverview>>();
  const [previous, setPrevious] = useState<Array<HappeningOverview>>();
  const [error, setError] = useState<string>();
  const [filter, setFilter] = useState<"all" | "upcoming" | "previous">("all");

  useEffect(() => {
    const fetchHappenings = async () => {
      const happenings = await getAllByType(type);

      if (isErrorMessage(happenings)) {
        setError(happenings.message);
      } else {
        const upcoming = happenings.filter((h) => {
          const date = new Date(h.date || "");
          return date.getTime() > new Date().getTime();
        });

        const previous = happenings.filter((h) => {
          const date = new Date(h.date || "");
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
          filtering
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
}
