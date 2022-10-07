import { string, record, decodeType, literal, union, array, nil } from "typescript-json-decoder";
import ErrorMessage from "./error";
import SanityClient from "./sanity";

const happeningOverviewDecoder = record({
  _createdAt: string,
  author: string,
  title: string,
  slug: string,
  date: string,
});
type HappeningOverview = decodeType<typeof happeningOverviewDecoder>;

const happeningDecoder = record({
  _createdAt: string,
  author: string,
  title: string,
  body: string,
  slug: string,
  logoUrl: union(string, nil),
  location: union(string, nil),
  date: string,
});
type Happening = decodeType<typeof happeningDecoder>;

const happeningTypeDecoder = union(literal("BEDPRES"), literal("EVENT"));
type HappeningType = decodeType<typeof happeningTypeDecoder>;

const HappeningAPI = {
  getAllByType: async (type: HappeningType): Promise<Array<HappeningOverview> | ErrorMessage> => {
    try {
      const query = `
        *[_type == "happening" && happeningType == "${type}" && !(_id in path('drafts.**'))] | order(date desc) {
          _createdAt,
          "author": author -> name,
          title,
          "slug": slug.current,
          date,
        }
      `;

      const resp = await SanityClient.fetch(query);

      return array(happeningOverviewDecoder)(resp);
    } catch (error) {
      return {
        message: `Failed to get happening of type: ${type}.`,
      };
    }
  },
  getHappeningBySlug: async (type: string, slug: string): Promise<Happening | ErrorMessage> => {
    try {
      const query = `
        *[_type == "happening" && happeningType == "${type}" && slug.current == "${slug}" && !(_id in path('drafts.**'))] | order(date asc) {
          _createdAt,
          "author": author -> name,
          title,
          "body": body.no,
          "slug": slug.current,
          "logoUrl": logo.asset -> url,
          location,
          date,
        }
      `;

      const resp = await SanityClient.fetch(query);

      return happeningDecoder(resp[0]);
    } catch (error) {
      return {
        message: `Failed to get happening of type: ${type} with slug: ${slug}.`,
      };
    }
  },
};

export default HappeningAPI;
export type { Happening, HappeningOverview, HappeningType };
