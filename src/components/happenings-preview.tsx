import { useNavigation, List, ActionPanel, Action } from "@raycast/api";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { HappeningType, HappeningOverview } from "../lib/sanity/happening";
import { HappeningBySlug } from "./happening-slug";

export function HappeningPreview({
  type,
  happening,
}: {
  type: HappeningType;
  happening: HappeningOverview;
}) {
  const { push } = useNavigation();

  return (
    <List.Item
      title={happening.title}
      subtitle={format(new Date(happening.date!), "d. MMMM yyyy", {
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
}
