import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Gabetti Valutazioni'

interface LeadConfirmationProps {
  firstName?: string
  propertyType?: string
  sqm?: string
  zone?: string
  address?: string
}

const LeadConfirmationEmail = ({
  firstName,
  propertyType,
  sqm,
  zone,
  address,
}: LeadConfirmationProps) => (
  <Html lang="it" dir="ltr">
    <Head />
    <Preview>Abbiamo ricevuto la tua richiesta di valutazione</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {firstName ? `Ciao ${firstName},` : 'Ciao,'}
        </Heading>
        <Text style={text}>
          grazie per averci contattato! Abbiamo ricevuto la tua richiesta di
          valutazione gratuita per il tuo immobile.
        </Text>
        <Text style={text}>
          Un nostro consulente esperto della tua zona ti contatterà entro 24 ore
          lavorative per fissare un sopralluogo gratuito e fornirti una stima
          accurata e personalizzata.
        </Text>
        {(propertyType || sqm || zone || address) && (
          <Section style={summaryBox}>
            <Text style={summaryTitle}>Riepilogo richiesta</Text>
            {propertyType && (
              <Text style={summaryRow}><strong>Tipologia:</strong> {propertyType}</Text>
            )}
            {sqm && (
              <Text style={summaryRow}><strong>Metri quadri:</strong> {sqm} mq</Text>
            )}
            {zone && (
              <Text style={summaryRow}><strong>Zona:</strong> {zone}</Text>
            )}
            {address && (
              <Text style={summaryRow}><strong>Indirizzo:</strong> {address}</Text>
            )}
          </Section>
        )}
        <Hr style={hr} />
        <Text style={text}>
          Nel frattempo, se hai domande urgenti puoi contattarci direttamente
          via WhatsApp al <strong>+39 376 283 7626</strong>.
        </Text>
        <Text style={footer}>
          A presto,<br />
          Il Team {SITE_NAME}<br />
          Gabetti Franchising — Agenzia di Marano di Napoli
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: LeadConfirmationEmail,
  subject: 'Abbiamo ricevuto la tua richiesta di valutazione',
  displayName: 'Conferma richiesta valutazione (utente)',
  previewData: {
    firstName: 'Mario',
    propertyType: 'appartamento',
    sqm: '85',
    zone: 'Marano di Napoli',
    address: 'Via Roma 1',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '20px 25px', maxWidth: '600px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0a2540', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#3c4257', lineHeight: '1.6', margin: '0 0 16px' }
const summaryBox = { backgroundColor: '#f6f9fc', padding: '16px 20px', borderRadius: '8px', margin: '20px 0' }
const summaryTitle = { fontSize: '13px', fontWeight: 'bold', color: '#0a2540', textTransform: 'uppercase' as const, margin: '0 0 10px' }
const summaryRow = { fontSize: '13px', color: '#3c4257', margin: '4px 0' }
const hr = { borderColor: '#e6ebf1', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#8898aa', margin: '20px 0 0', lineHeight: '1.5' }
