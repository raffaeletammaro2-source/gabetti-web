import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface LeadAdminProps {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  propertyType?: string
  sqm?: string
  condition?: string
  zone?: string
  address?: string
  timeline?: string
  experience?: string
  pageUrl?: string
  submittedAt?: string
  eventId?: string
}

const LeadAdminEmail = (p: LeadAdminProps) => (
  <Html lang="it" dir="ltr">
    <Head />
    <Preview>Nuovo lead: {p.firstName} {p.lastName} — {p.zone}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🏠 Nuovo lead valutazione</Heading>
        <Text style={text}>
          È arrivata una nuova richiesta di valutazione dal sito.
        </Text>

        <Section style={box}>
          <Text style={sectionTitle}>Contatto</Text>
          <Text style={row}><strong>Nome:</strong> {p.firstName} {p.lastName}</Text>
          <Text style={row}><strong>Email:</strong> {p.email}</Text>
          <Text style={row}><strong>Telefono:</strong> {p.phone}</Text>
        </Section>

        <Section style={box}>
          <Text style={sectionTitle}>Immobile</Text>
          <Text style={row}><strong>Tipologia:</strong> {p.propertyType}</Text>
          <Text style={row}><strong>Metri quadri:</strong> {p.sqm} mq</Text>
          <Text style={row}><strong>Stato:</strong> {p.condition}</Text>
          <Text style={row}><strong>Zona:</strong> {p.zone}</Text>
          <Text style={row}><strong>Indirizzo:</strong> {p.address}</Text>
        </Section>

        <Section style={box}>
          <Text style={sectionTitle}>Intenzione</Text>
          <Text style={row}><strong>Tempistica vendita:</strong> {p.timeline}</Text>
          <Text style={row}><strong>Esperienza precedente:</strong> {p.experience}</Text>
        </Section>

        <Hr style={hr} />
        <Text style={meta}>
          <strong>Event ID:</strong> {p.eventId}<br />
          <strong>Inviato:</strong> {p.submittedAt}<br />
          <strong>Pagina:</strong> {p.pageUrl}
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: LeadAdminEmail,
  subject: (d: Record<string, any>) =>
    `Nuovo lead valutazione: ${d.firstName ?? ''} ${d.lastName ?? ''} — ${d.zone ?? ''}`.trim(),
  displayName: 'Notifica nuovo lead (admin)',
  previewData: {
    firstName: 'Mario',
    lastName: 'Rossi',
    email: 'mario@example.com',
    phone: '333 1234567',
    propertyType: 'appartamento',
    sqm: '85',
    condition: 'Buono',
    zone: 'Marano di Napoli',
    address: 'Via Roma 1',
    timeline: 'Entro 6 mesi',
    experience: 'No, è la prima volta',
    pageUrl: 'https://valutazioni.gabetti-adg.it',
    submittedAt: new Date().toISOString(),
    eventId: 'lead_demo_123',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '20px 25px', maxWidth: '600px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0a2540', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#3c4257', lineHeight: '1.6', margin: '0 0 16px' }
const box = { backgroundColor: '#f6f9fc', padding: '14px 18px', borderRadius: '8px', margin: '12px 0' }
const sectionTitle = { fontSize: '12px', fontWeight: 'bold', color: '#0a2540', textTransform: 'uppercase' as const, margin: '0 0 8px', letterSpacing: '0.5px' }
const row = { fontSize: '13px', color: '#3c4257', margin: '4px 0' }
const hr = { borderColor: '#e6ebf1', margin: '20px 0' }
const meta = { fontSize: '11px', color: '#8898aa', lineHeight: '1.6' }
