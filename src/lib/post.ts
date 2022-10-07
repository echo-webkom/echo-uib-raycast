import { array, decodeType, record, string } from "typescript-json-decoder";
import ErrorMessage from "./error";
import SanityClient from "./sanity";

const postDecoder = record({
  title: string,
  slug: string,
  body: string,
  author: string,
  _createdAt: string,
});
type Post = decodeType<typeof postDecoder>;

const postOverviewDecoder = record({
  title: string,
  slug: string,
  author: string,
  _createdAt: string,
});
type PostOverview = decodeType<typeof postOverviewDecoder>;

const PostAPI = {
  getPosts: async (): Promise<Array<PostOverview> | ErrorMessage> => {
    try {
      const query = `
        *[_type == "post" && !(_id in path('drafts.**'))] | order(_createdAt desc) {
          "title": title.no,
          "slug": slug.current,
          "author": author -> name,
          _createdAt,
        }
      `;

      const resp = await SanityClient.fetch(query);

      return array(postOverviewDecoder)(resp);
    } catch (error) {
      return {
        message: "Failed to get posts.",
      };
    }
  },
  getPostBySlug: async (slug: string): Promise<Post | ErrorMessage> => {
    try {
      const query = `
        *[_type == "post" && slug.current == "${slug}" && !(_id in path('drafts.**'))] | order(_createdAt desc) {
          "title": title.no,
          "slug": slug.current,
          "body": body.no,
          "author": author -> name,
          _createdAt,
        }
      `;

      const resp = await SanityClient.fetch(query);

      return postDecoder(resp[0]);
    } catch (error) {
      return {
        message: `Failed to get post with slug: ${slug}.`,
      };
    }
  },
};

export default PostAPI;
export type { Post, PostOverview };
