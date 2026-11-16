/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as leadConfirmation } from './lead-confirmation.tsx'
import { template as leadAdminNotification } from './lead-admin-notification.tsx'
import { template as jobApplicationAdmin } from './job-application-admin.tsx'
import { template as jobApplicationConfirmation } from './job-application-confirmation.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'lead-confirmation': leadConfirmation,
  'lead-admin-notification': leadAdminNotification,
  'job-application-admin': jobApplicationAdmin,
  'job-application-confirmation': jobApplicationConfirmation,
}
