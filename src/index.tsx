import { ActionPanel, Action, useNavigation, List } from "@raycast/api";
import Happening from "./happening";
import Post from "./post";

const Command = () => {
  const { push } = useNavigation();

  return (
    <List>
      <List.Item
        title="🎉 Arrangementer"
        actions={
          <ActionPanel>
            <Action
              title="Vis alle arrangementer"
              onAction={() => push(<Happening type="EVENT" />)}
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
              onAction={() => push(<Happening type="BEDPRES" />)}
            />
          </ActionPanel>
        }
      />
      <List.Item
        title="📝 Innlegg"
        actions={
          <ActionPanel>
            <Action title="Vis alle innlegg" onAction={() => push(<Post />)} />
          </ActionPanel>
        }
      />
    </List>
  );
};

export default Command;
