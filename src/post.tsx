import { Action, ActionPanel, Detail, List, useNavigation } from "@raycast/api";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { useEffect, useState } from "react";
import { isErrorMessage } from "./lib/error";
import { PostOverview, getPosts } from "./lib/sanity/post";
import { PostBySlug } from "./components/post-slug";

export function Posts() {
  const { push } = useNavigation();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [posts, setPosts] = useState<Array<PostOverview>>();
  const [filter, setFilter] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    const fetchPosts = async () => {
      const events = await getPosts();

      setError(undefined);

      if (isErrorMessage(events)) {
        setError(events.message);
      } else {
        if (filter === "newest") {
          setPosts(events);
        } else {
          setPosts(events.reverse());
        }
      }

      setIsLoading(false);
    };

    void fetchPosts();
  }, [filter]);

  if (error) {
    <Detail markdown={error} />;
  }

  return (
    <>
      {posts && (
        <List
          isLoading={isLoading}
          searchBarAccessory={
            <List.Dropdown
              tooltip="Filtrer etter nyeste og eldste."
              onChange={(value) => setFilter(value as "newest" | "oldest")}
            >
              <List.Dropdown.Item title="Nyeste" value="newest" />
              <List.Dropdown.Item title="Eldste" value="oldest" />
            </List.Dropdown>
          }
          filtering
        >
          <List.Section title="Innlegg">
            {posts.map((post, i) => (
              <List.Item
                key={i}
                title={post.title}
                subtitle={format(new Date(post._createdAt), "d. MMMM yyyy", {
                  locale: nb,
                })}
                actions={
                  <ActionPanel>
                    <Action
                      title="Vis arrangement"
                      onAction={() => push(<PostBySlug slug={post.slug} />)}
                    />
                  </ActionPanel>
                }
              />
            ))}
          </List.Section>
        </List>
      )}
    </>
  );
}
