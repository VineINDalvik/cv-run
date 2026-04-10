import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getResume } from '@/lib/kv'
import ThemeRenderer from '@/components/themes/ThemeRenderer'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const record = await getResume(slug)
  if (!record) return { title: 'Resume not found' }

  const { data } = record
  return {
    title: `${data.name} — Resume`,
    description: data.summary,
    openGraph: {
      title: `${data.name} — Resume`,
      description: data.summary,
      images: [`/api/og/${slug}`],
    },
  }
}

export default async function ResumePage({ params }: Props) {
  const { slug } = await params
  const record = await getResume(slug)

  if (!record) notFound()

  return <ThemeRenderer data={record.data} theme={record.theme} />
}
