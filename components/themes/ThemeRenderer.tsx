'use client'

import { ResumeData, Theme } from '@/lib/schema'
import T3TerminalOxide from './T3TerminalOxide'
import M1Cormorant from './M1Cormorant'
import M3Fraunces from './M3Fraunces'

interface Props {
  data: ResumeData
  theme: Theme
}

export default function ThemeRenderer({ data, theme }: Props) {
  switch (theme) {
    case 't3': return <T3TerminalOxide data={data} />
    case 'm1': return <M1Cormorant data={data} />
    case 'm3': return <M3Fraunces data={data} />
  }
}
