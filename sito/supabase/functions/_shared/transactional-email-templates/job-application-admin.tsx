import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  name?: string
  phone?: string
  email?: string
  experience?: string
  letter?: string
  submittedAt?: string
}

const JobApplicationEmail = (p: Props) => (
  <Html lang="it" dir="ltr">
    <Head />
    <Preview>Nuova candidatura: {p.name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Nuova candidatura "Lavora con noi"</Heading>
        <Section style={box}>
          <Text style={row}><strong>Nome:</strong> {p.name}</Text>
          <Text style={row}><strong>Telefono:</strong> {p.phone}</Text>
          <Text style={row}><strong>Email:</strong> {p.email}</Text>
          <Text style={row}><strong>Esperienza nel settore:</strong> {p.experience}</Text>
        </Section>
        <Section style={box}>
          <Text style={row}><strong>Lettera di presentazione:</strong></Text>
          <Text style={{ ...row, whiteSpace: 'pre-wrap' as const }}>{p.letter}</Text>
        </Section>
        <Text style={meta}>Inviato: {p.submittedAt}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: JobApplicationEmail,
  subject: (d: Record<string, any>) => `Nuova candidatura: ${d.name ?? ''}`.trim(),
  displayName: 'Candidatura Lavora con noi (admin)',
  previewData: {
    name: 'Mario Rossi', phone: '333 1234567', email: 'mario@example.com',
    experience: 'Sì - da meno di 2 anni', letter: 'Vorrei entrare nel vostro team.',
    submittedAt: new Date().toISOString(),
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '20px 25px', maxWidth: '600px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#B20933', margin: '0 0 20px' }
const box = { backgroundColor: '#f5f5f5', padding: '14px 18px', borderRadius: '8px', margin: '12px 0' }
const row = { fontSize: '13px', color: '#4C565C', margin: '4px 0' }
const meta = { fontSize: '11px', color: '#8898aa' }
