import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
    }),
    defineField({
      name: 'url',
      title: 'Author URL',
      type: 'url',
      description: '著者のサイト/プロフィールURL（任意）',
    }),
    defineField({
      name: 'sameAs',
      title: 'Same As (social URLs)',
      type: 'array',
      of: [{ type: 'url' }],
      description: 'SNSや外部プロフィールのURL（任意・複数）',
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'avatar',
    },
  },
})
