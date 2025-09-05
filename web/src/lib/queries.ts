import { groq } from 'next-sanity'

// Get all posts
export const postsQuery = groq`*[_type == "post" && defined(slug.current) && state == 'published'] | order(publishedAt desc){
  _id,
  title,
  slug,
  "coverImage": coverImage{
    "alt": alt,
    "asset": asset->{
      _ref,
      url,
      "metadata": metadata{ lqip }
    }
  },
  excerpt,
  publishedAt,
  categories[]->{title, slug},
  tags[]->{title, slug}
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
      _ref,
      url,
      "metadata": metadata{ lqip }
    }
  },
    excerpt,
    publishedAt,
    categories[]->{title, slug},
    tags[]->{title, slug}
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

export const postsByCategoryPageQuery = groq`*[_type == "post" && $category in categories[]->slug.current && defined(slug.current) && state == 'published']
  | order(publishedAt desc)[$start...$end]{
    _id, title, slug, coverImage, excerpt, publishedAt
  }`

export const postsByCategoryCountQuery = groq`count(*[_type == "post" && $category in categories[]->slug.current && defined(slug.current) && state == 'published'])`

// Get all posts by tag
export const postsByTagQuery = groq`*[_type == "post" && $tag in tags[]->slug.current]{
  _id, title, slug, coverImage, excerpt, publishedAt
}`

export const postsByTagPageQuery = groq`*[_type == "post" && $tag in tags[]->slug.current && defined(slug.current) && state == 'published']
  | order(publishedAt desc)[$start...$end]{
    _id, title, slug, coverImage, excerpt, publishedAt
  }`

export const postsByTagCountQuery = groq`count(*[_type == "post" && $tag in tags[]->slug.current && defined(slug.current) && state == 'published'])`

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
export const relatedPostsQuery = groq`*[_type == "post" && slug.current != $slug]{
  _id,
  title,
  slug,
  publishedAt,
  "cMatch": count((categories[]->slug.current)[@ in $categorySlugs]),
  "tMatch": count((tags[]->slug.current)[@ in $tagSlugs])
} | order((cMatch + tMatch) desc, publishedAt desc) [0...3]`

// Get global settings
export const globalSettingsQuery = groq`*[_type == "globalSettings"][0]`

// Get category by slug
export const categoryQuery = groq`*[_type == "category" && slug.current == $slug][0]`

// Get tag by slug
export const tagQuery = groq`*[_type == "tag" && slug.current == $slug][0]`

// All categories/tags (for filters)
export const categoriesAllQuery = groq`*[_type == "category" && defined(slug.current)]|order(title asc){ title, slug }`
export const tagsAllQuery = groq`*[_type == "tag" && defined(slug.current)]|order(title asc){ title, slug }`

// Get adjacent posts by publishedAt
export const newerPostQuery = groq`*[_type == "post" && defined(slug.current) && state == 'published' && publishedAt > $publishedAt]
  | order(publishedAt asc)[0]{ _id, title, slug, publishedAt }`

export const olderPostQuery = groq`*[_type == "post" && defined(slug.current) && state == 'published' && publishedAt < $publishedAt]
  | order(publishedAt desc)[0]{ _id, title, slug, publishedAt }`

// Filtered posts (optional category and/or tag)
export const postsFilteredPageQuery = groq`*[_type == "post" && defined(slug.current) && state == 'published'
  && ($category == null || $category in categories[]->slug.current)
  && ($tag == null || $tag in tags[]->slug.current)
] | order(publishedAt desc)[$start...$end]{
  _id,
  title,
  slug,
  "coverImage": coverImage{
    "alt": alt,
    "asset": asset->{
      _ref,
      url,
      "metadata": metadata{ lqip }
    }
  },
  excerpt,
  publishedAt,
  categories[]->{title, slug},
  tags[]->{title, slug}
}`

export const postsFilteredCountQuery = groq`count(*[_type == "post" && defined(slug.current) && state == 'published'
  && ($category == null || $category in categories[]->slug.current)
  && ($tag == null || $tag in tags[]->slug.current)
])`
