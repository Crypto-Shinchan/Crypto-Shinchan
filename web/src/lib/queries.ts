import { groq } from 'next-sanity'

// Get all posts
export const postsQuery = groq`*[_type == "post" && defined(slug.current) && state == 'published'] | order(publishedAt desc){
  _id,
  title,
  slug,
  "coverImage": coverImage{
    "alt": alt,
    "asset": asset->{
      url,
      "metadata": metadata{
        lqip
      }
    }
  },
  excerpt,
  publishedAt
}`

// Get posts for a specific page (pagination)
export const postsPageQuery = groq`*[_type == "post" && defined(slug.current) && state == 'published']
  | order(publishedAt desc)[$start...$end]{
    _id,
    title,
    slug,
    "coverImage": coverImage{
      "alt": alt,
      "asset": asset->{
        url,
        "metadata": metadata{ lqip }
      }
    },
    excerpt,
    publishedAt
  }`

// Get total count of published posts
export const postsCountQuery = groq`count(*[_type == "post" && defined(slug.current) && state == 'published'])`

// Get a single post by slug
export const postQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  title, 
  slug, 
  coverImage, 
  body, 
  publishedAt, 
  updatedAt,
  excerpt,
  author->{name, avatar, bio}, 
  categories[]->{title, slug}, 
  tags[]->{title, slug}
}`

// Get all posts by category
export const postsByCategoryQuery = groq`*[_type == "post" && $category in categories[]->slug.current]{
  _id, title, slug, coverImage, excerpt, publishedAt
}`

// Get all posts by tag
export const postsByTagQuery = groq`*[_type == "post" && $tag in tags[]->slug.current]{
  _id, title, slug, coverImage, excerpt, publishedAt
}`

// Get all post slugs
export const postPathsQuery = groq`*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**")) && state == 'published'][]{
  "params": { "slug": slug.current }
}`

// Get all category slugs
export const categoryPathsQuery = groq`*[_type == "category" && defined(slug.current)][]{
    "params": { "category": slug.current }
}`

// Get all tag slugs
export const tagPathsQuery = groq`*[_type == "tag" && defined(slug.current)][]{
    "params": { "tag": slug.current }
}`

// Get related posts by category
export const relatedPostsQuery = groq`*[_type == "post" && slug.current != $slug && count((categories[]->slug.current)[@ in $categorySlugs]) > 0] | order(publishedAt desc) [0...3] {
  _id,
  title,
  slug,
  publishedAt
}`

// Get global settings
export const globalSettingsQuery = groq`*[_type == "globalSettings"][0]`

// Get category by slug
export const categoryQuery = groq`*[_type == "category" && slug.current == $slug][0]`

// Get tag by slug
export const tagQuery = groq`*[_type == "tag" && slug.current == $slug][0]`
