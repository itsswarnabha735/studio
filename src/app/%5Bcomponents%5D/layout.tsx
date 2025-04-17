import type { Metadata } from 'next'
import { GeistSans } from 'geist/font'
import Page from '../components/page'

export const metadata: Metadata = {
  title: 'Components',
  description: 'Reusable components built using Radix UI and Tailwind CSS.',
}

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Page>
      {children}
    </Page>
  )
}
