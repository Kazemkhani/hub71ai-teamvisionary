// FROZEN CONTRACT between the client (pack B uses it), the API (pack C implements it) and the mocks. Zod schemas are the single source of truth.
import { z } from 'zod';

export const ExtractRequest = z.object({
  files: z.array(z.object({ name: z.string(), mimeType: z.string(), base64: z.string() })).min(1).max(5),
});
export const ExtractResult = z.object({
  company: z.object({
    name: z.string().nullable(),
    zone: z.enum(['ADGM', 'MAINLAND', 'KEZAD', 'MASDAR', 'TWOFOUR54']).nullable(),
    activity: z.string().nullable(),
    headcount: z.number().int().nullable(),
    startDate: z.string().nullable(), // ISO date or null
    parentJurisdiction: z.enum(['UAE', 'LOW_RISK', 'HIGH_RISK']).nullable(),
    ownershipLayers: z.number().int().min(1).max(3).nullable(),
  }),
  people: z.array(z.object({
    name: z.string(), role: z.string(), skilled: z.boolean(),
    kids: z.array(z.object({ yearGroup: z.string(), curriculum: z.enum(['UK', 'IB', 'US', 'Indian']) })),
  })),
  evidence: z.array(z.string()), // short quotes from the documents that justify each field
  confidence: z.number().min(0).max(1),
});

export const ExplainRequest = z.object({
  nodeId: z.string(), label: z.string(), owner: z.string(), startDay: z.number(), finishDay: z.number(), expectedDays: z.number(),
  onCriticalPath: z.boolean(), unlocks: z.number(), companyName: z.string(), zone: z.string(), source: z.string(),
});
export const ExplainResult = z.object({ en: z.string().max(400), ar: z.string().max(400), actionToday: z.string().max(160) });

export const DraftRequest = z.object({
  template: z.enum(['bank_cover_letter', 'employer_rent_guarantee', 'school_application', 'landlord_direct_debit']),
  tone: z.enum(['formal', 'friendly']),
  context: z.record(z.string()),
});
export const DraftResult = z.object({ subject: z.string(), en: z.string(), ar: z.string() });

export const WhatIfRequest = z.object({
  question: z.string().min(3).max(400),
  current: z.object({
    zone: z.string(), headcount: z.number(),
    toggles: z.object({ kycEarly: z.boolean(), chequeFree: z.boolean(), flexiDesk: z.boolean() }),
    bankable: z.record(z.union([z.string(), z.number(), z.boolean()])),
  }),
});
export const WhatIfResult = z.object({
  toggles: z.object({ kycEarly: z.boolean().optional(), chequeFree: z.boolean().optional(), flexiDesk: z.boolean().optional() }).optional(),
  bankable: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
  zone: z.enum(['ADGM', 'MAINLAND', 'KEZAD', 'MASDAR', 'TWOFOUR54']).optional(),
  headcount: z.number().int().optional(),
  events: z.array(z.enum(['bank_rejected', 'landlord_delayed', 'school_waitlisted'])).optional(),
  rationale: z.string().max(300),
});

export type ExtractRequest = z.infer<typeof ExtractRequest>;
export type ExtractResult = z.infer<typeof ExtractResult>;
export type ExplainRequest = z.infer<typeof ExplainRequest>;
export type ExplainResult = z.infer<typeof ExplainResult>;
export type DraftRequest = z.infer<typeof DraftRequest>;
export type DraftResult = z.infer<typeof DraftResult>;
export type WhatIfRequest = z.infer<typeof WhatIfRequest>;
export type WhatIfResult = z.infer<typeof WhatIfResult>;
