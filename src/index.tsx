import { ActionPanel, Action, useNavigation, List } from "@raycast/api";
import { Happenings } from "./happening";
import { Posts } from "./post";

export default function Command() {
  const { push } = useNavigation();

  return (
    <List>
      <List.Item
        title="🎉 Arrangementer"
        actions={
          <ActionPanel>
            <Action
              title="Vis alle arrangementer"
              onAction={() => push(<Happenings type="event" />)}
            />
          </ActionPanel>
        }
      />
      <List.Item
        title="📈 Bedriftspresentasjoner"
        actions={
          <ActionPanel>
            <Action
              title="Vis alle bedriftspresentasjoner"
              onAction={() => push(<Happenings type="bedpres" />)}
            />
          </ActionPanel>
        }
      />
      <List.Item
        title="📝 Innlegg"
        actions={
          <ActionPanel>
            <Action title="Vis alle innlegg" onAction={() => push(<Posts />)} />
          </ActionPanel>
        }
      />
    </List>
  );
}
