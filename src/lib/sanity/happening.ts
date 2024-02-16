import ErrorMessage from "../error";
import { sanityClient } from "./sanity";
import groq from "groq";

export type HappeningOverview = {
  _createdAt: string;
  author: string;
  title: string;
  slug: string;
  date: string | null;
};

export type Happening = {
  _createdAt: string;
  author: string;
  title: string;
  body: string | null;
  slug: string;
  logoUrl: string | null;
  location: string | null;
  date: string | null;
};

export type HappeningType = "event" | "bedpres";

export const getAllByType = async (
  type: HappeningType,
): Promise<Array<HappeningOverview> | ErrorMessage> => {
  try {
    const query = groq`
        *[_type == "happening" && happeningType == $type && !(_id in path('drafts.**'))] | order(date desc) {
          _createdAt,
          "author": organizers[0]->name,
          title,
          "slug": slug.current,
          date,
        }
      `;

    const params = {
      type,
    };

    return await sanityClient.fetch<Array<HappeningOverview>>(query, params);
  } catch (error) {
    return {
      message: `Failed to get happening of type: ${type}. Error: ${error}`,
    };
  }
};

export const getHappeningBySlug = async (
  type: string,
  slug: string,
): Promise<Happening | ErrorMessage> => {
  try {
    const query = groq`
        *[_type == "happening" && happeningType == $type && slug.current == $slug && !(_id in path('drafts.**'))] | order(date asc) {
          _createdAt,
          "author": organizers[0]->name,
          title,
          body,
          "slug": slug.current,
          "logoUrl": company->image.asset->url,
          location,
          date,
        }
      `;

    const params = {
      type,
      slug,
    };

    return (await sanityClient.fetch<Array<Happening>>(query, params))[0];
  } catch (error) {
    return {
      message: `Failed to get happening of type: ${type} with slug: ${slug}. Error: ${error}`,
    };
  }
};
