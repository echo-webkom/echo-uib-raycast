import ErrorMessage from "../error";
import { sanityClient } from "./sanity";
import groq from "groq";

export type Post = {
  title: string;
  slug: string;
  body: string;
  author: string;
  _createdAt: string;
};

export type PostOverview = {
  title: string;
  slug: string;
  author: string;
  _createdAt: string;
};

export const getPosts = async (): Promise<
  Array<PostOverview> | ErrorMessage
> => {
  try {
    const query = groq`
        *[_type == "post" && !(_id in path('drafts.**'))] | order(_createdAt desc) {
          title,
          "slug": slug.current,
          "author": authors[0]->name,
          _createdAt,
        }
      `;

    return await sanityClient.fetch<Array<PostOverview>>(query);
  } catch (error) {
    return {
      message: "Failed to get posts.",
    };
  }
};

export const getPostBySlug = async (
  slug: string,
): Promise<Post | ErrorMessage> => {
  try {
    const query = groq`
        *[_type == "post" && slug.current == $slug && !(_id in path('drafts.**'))] | order(_createdAt desc) {
          title,
          "slug": slug.current,
          body,
          "author": authors[0]->name,
          _createdAt,
        }
      `;

    const params = {
      slug,
    };

    return (await sanityClient.fetch<Array<Post>>(query, params))[0];
  } catch (error) {
    return {
      message: `Failed to get post with slug: ${slug}.`,
    };
  }
};
