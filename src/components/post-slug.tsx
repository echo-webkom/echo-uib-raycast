import { Detail } from "@raycast/api";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { useState, useEffect } from "react";
import { isErrorMessage } from "../lib/error";
import { Post, getPostBySlug } from "../lib/sanity/post";
import { capitalize } from "../lib/utils";

export function PostBySlug({ slug }: { slug: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState<Post | null>();

  useEffect(() => {
    const fetchPost = async () => {
      const post = await getPostBySlug(slug);

      if (isErrorMessage(post)) {
        setPost(null);
      } else {
        setPost(post);
      }

      setIsLoading(false);
    };

    void fetchPost();
  }, []);

  if (!post) {
    return null;
  }

  const markdown = `
# ${post.title}

${post.body}
`.trim();

  return (
    <Detail
      isLoading={isLoading}
      markdown={markdown}
      navigationTitle={post.title}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label
            title="Publisert av"
            text={capitalize(post.author)}
          />
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
  );
}
