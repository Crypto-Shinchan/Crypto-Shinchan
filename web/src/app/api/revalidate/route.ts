import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

// Sanity からの Webhook リクエストの型定義
interface SanityWebhookPayload {
  _type: string;
  slug?: {
    current?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<SanityWebhookPayload>(
      request,
      process.env.SANITY_REVALIDATE_SECRET
    )

    if (!isValidSignature) {
      return new Response('Invalid signature', { status: 401 })
    }

    if (!body?._type) {
      return new Response('Bad Request', { status: 400 })
    }

    // revalidate するタグを決定
    const tagsToRevalidate: string[] = []
    switch (body._type) {
      case 'post':
        tagsToRevalidate.push('posts') // 記事一覧
        if (body.slug?.current) {
          tagsToRevalidate.push(`post:${body.slug.current}`) // 個別記事
        }
        break
      case 'category':
      case 'tag':
        tagsToRevalidate.push('posts') // カテゴリやタグが変わったら記事一覧も更新
        // 必要に応じて、カテゴリ/タグごとの一覧ページのタグも追加
        break
      case 'globalSettings':
        tagsToRevalidate.push('layout') // ヘッダーやフッターなど
        break
      // 他の type のケースを追加
    }
    
    // タグの revalidate を実行
    for (const tag of tagsToRevalidate) {
      revalidateTag(tag)
    }

    return NextResponse.json({
      status: 200,
      revalidated: true,
      now: Date.now(),
      revalidatedTags: tagsToRevalidate,
    })
  } catch (err: any) {
    console.error(err)
    return new Response(err.message, { status: 500 })
  }
}