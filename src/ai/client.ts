// OWNED BY PACK C. Base version: POST to /api/*, validate with zod, fall back to mocks on any failure. Exposes `lastMode` so the UI can show "Demo mode".
import { ExtractRequest, ExtractResult, ExplainRequest, ExplainResult, DraftRequest, DraftResult, WhatIfRequest, WhatIfResult } from './schemas';
import type { z } from 'zod';
import { mockDraft, mockExplain, mockExtract, mockWhatIf } from './mocks';

export type AiMode = 'live' | 'mock';
export const aiState: { lastMode: AiMode } = { lastMode: 'mock' };

async function post<TReq, TRes>(path: string, reqSchema: z.ZodType<TReq>, resSchema: z.ZodType<TRes>, body: TReq, fallback: () => TRes, timeoutMs = 20000): Promise<TRes> {
  reqSchema.parse(body);
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const parsed = resSchema.parse(json);
    aiState.lastMode = 'live';
    return parsed;
  } catch {
    aiState.lastMode = 'mock';
    await new Promise((r) => setTimeout(r, 600));
    return fallback();
  }
}

export const aiClient = {
  extract: (req: ExtractRequest) => post('/api/extract', ExtractRequest, ExtractResult, req, () => mockExtract, 45000),
  explain: (req: ExplainRequest) => post('/api/explain', ExplainRequest, ExplainResult, req, () => mockExplain(req)),
  draft: (req: DraftRequest) => post('/api/draft', DraftRequest, DraftResult, req, () => mockDraft(req)),
  whatIf: (req: WhatIfRequest) => post('/api/whatif', WhatIfRequest, WhatIfResult, req, () => mockWhatIf(req.question)),
};
