import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'globalSettings',
  title: 'Global Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
    }),
    defineField({
        name: 'nav',
        title: 'Navigation',
        type: 'array',
        of: [{
            type: 'object',
            fields: [
                {name: 'title', type: 'string', title: 'Title'},
                {name: 'url', type: 'string', title: 'URL'}
            ]
        }]
    }),
    defineField({
        name: 'footer',
        title: 'Footer Text',
        type: 'text',
    }),
    defineField({
        name: 'socialLinks',
        title: 'Social Links',
        type: 'array',
        of: [{
            type: 'object',
            fields: [
                {name: 'platform', type: 'string', title: 'Platform (e.g., Twitter, GitHub)'},
                {name: 'url', type: 'url', title: 'URL'}
            ]
        }]
    }),
    defineField({
        name: 'defaultOG',
        title: 'Default OG Image',
        type: 'image',
    }),
  ],
})
