import type { PortableTextBlock } from "@portabletext/types";
import type { ImageAsset, Slug } from "@sanity/types";
import groq from "groq";

export const eventQuery = groq`*[_type == "event" && _id == $id][0]`;

export const eventsQuery = groq`*[_type == "event" && defined(_id) && (!defined($category) || category == $category)] | order(start desc)`;

export interface Event {
  _id: string;
  _type: "event";
  _createdAt: string;
  title?: string;
  subtitle?: string;
  summary?: string;
  image?: ImageAsset;
  body?: PortableTextBlock[];
  start: string;
  end: string;
  place: string;
  allergy: boolean;
  category: string;
}

export const postQuery = groq`*[_type == "post" && slug.current == $slug][0]`;
export const postsQuery = groq`*[_type == "post"]`;

export interface Post {
  _type: "post";
  _createdAt: string;
  title?: string;
  subtitle?: string;
  slug: Slug;
  image?: ImageAsset;
  body: PortableTextBlock[];
}
