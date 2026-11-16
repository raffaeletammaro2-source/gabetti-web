import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props { name?: string }

const JobApplicationConfirmation = ({ name }: Props) => (
  <Html lang="it" dir="ltr">
    <Head />
    <Preview>Abbiamo ricevuto la tua candidatura</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>{name ? `Grazie ${name}!` : 'Grazie!'}</Heading>
        <Text style={text}>
          Abbiamo ricevuto la tua candidatura per entrare nel team Gabetti Franchising — Gruppo ADG.
        </Text>
        <Text style={text}>
          Il nostro team la valuterà con attenzione e, se il tuo profilo è in linea con le posizioni aperte,
          ti contatteremo al più presto per un colloquio conoscitivo.
        </Text>
        <Text style={text}>A presto,<br />Il team Gabetti Franchising — Gruppo ADG</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: JobApplicationConfirmation,
  subject: 'Abbiamo ricevuto la tua candidatura — Gabetti Franchising',
  displayName: 'Conferma candidatura (candidato)',
  previewData: { name: 'Mario' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '20px 25px', maxWidth: '600px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#B20933', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#4C565C', lineHeight: '1.6', margin: '0 0 16px' }
