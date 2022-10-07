import { Action, ActionPanel, Detail, List, useNavigation } from "@raycast/api";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { useEffect, useState } from "react";
import { isErrorMessage } from "./lib/error";
import PostAPI, { Post, PostOverview } from "./lib/post";

const Post = () => {
  const { push } = useNavigation();

  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Array<PostOverview>>();
  const [filter, setFilter] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    const fetchPosts = async () => {
      const events = await PostAPI.getPosts();

      if (isErrorMessage(events)) {
        setPosts([]);
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
          enableFiltering
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
};

const PostBySlug = ({ slug }: { slug: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState<Post | null>();

  useEffect(() => {
    const fetchPost = async () => {
      const post = await PostAPI.getPostBySlug(slug);

      if (isErrorMessage(post)) {
        setPost(null);
      } else {
        setPost(post);
      }

      setIsLoading(false);
    };

    void fetchPost();
  }, []);

  const markdown = `
  # ${post?.title}

  ${post?.body}
  `;

  return (
    <>
      {post && (
        <Detail
          isLoading={isLoading}
          markdown={markdown}
          navigationTitle={post?.title}
          metadata={
            <Detail.Metadata>
              <Detail.Metadata.Label title="Publisert av" text={post?.author} />
              <Detail.Metadata.Label
                title="Dato"
                text={format(new Date(post._createdAt), "dd. MMM yyyy", {
                  locale: nb,
                })}
              />
              <Detail.Metadata.Separator />
              <Detail.Metadata.Link
                title="Nettside"
                text="Vis på echo.uib.no"
                target={`https://echo.uib.no/posts/${slug}`}
              />
            </Detail.Metadata>
          }
        />
      )}
    </>
  );
};

export default Post;
