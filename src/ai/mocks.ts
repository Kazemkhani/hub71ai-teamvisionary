// Deterministic mock responses, used when the API is unreachable or OPENAI_API_KEY is absent. The UI shows a "Demo mode" pill when these are served.
import type { ExtractResult, ExplainRequest, ExplainResult, DraftRequest, DraftResult, WhatIfResult } from './schemas';

export const mockExtract: ExtractResult = {
  company: { name: 'Northline Payments', zone: 'ADGM', activity: 'Payments software', headcount: 12, startDate: '2027-01-04', parentJurisdiction: 'LOW_RISK', ownershipLayers: 2 },
  people: [
    { name: 'A. Rahman', role: 'CEO', skilled: true, kids: [{ yearGroup: 'Year 3', curriculum: 'UK' }] },
    { name: 'J. Okafor', role: 'CTO', skilled: true, kids: [{ yearGroup: 'Year 7', curriculum: 'UK' }] },
  ],
  evidence: ['"Northline Payments Ltd, registered in England and Wales"', '"Commencement date: 4 January 2027"', '"Headcount at launch: 12"'],
  confidence: 0.82,
};

export function mockExplain(req: ExplainRequest): ExplainResult {
  const where = req.onCriticalPath ? 'This step sits on your critical path, so every day it slips moves your go-live date.' : 'This step is not on the critical path today, but it unlocks ' + req.unlocks + ' later steps.';
  return {
    en: `${req.label} takes about ${Math.round(req.expectedDays)} days for ${req.companyName} in ${req.zone}. ${where}`,
    ar: `تستغرق خطوة "${req.label}" نحو ${Math.round(req.expectedDays)} يومًا لشركة ${req.companyName} في ${req.zone}. ${req.onCriticalPath ? 'هذه الخطوة على المسار الحرج، وأي تأخير فيها يؤخر موعد التشغيل.' : 'هذه الخطوة ليست على المسار الحرج اليوم.'}`,
    actionToday: req.startDay === 0 ? `Start ${req.label.toLowerCase()} today.` : `Prepare the documents for ${req.label.toLowerCase()} now so it starts the day its dependencies finish.`,
  };
}

export function mockDraft(req: DraftRequest): DraftResult {
  const c = req.context;
  switch (req.template) {
    case 'bank_cover_letter':
      return { subject: `Account opening request: ${c.companyName ?? 'our company'}`,
        en: `Dear Relationship Manager,\n\n${c.companyName ?? 'Our company'} is a newly licensed ${c.activity ?? 'business'} in ${c.zone ?? 'Abu Dhabi'} with ${c.headcount ?? 'a small'} staff relocating from ${c.origin ?? 'abroad'}. Enclosed: trade licence, MOA, UBO chart, audited parent accounts, source-of-funds evidence and signed client contracts. Expected monthly inflows: ${c.inflows ?? 'AED 100k to 1m'}.\n\nWe would value a decision within ten business days.\n\nKind regards,\n${c.signatory ?? 'Authorised signatory'}`,
        ar: `السادة مدير العلاقات،\n\nشركة ${c.companyName ?? 'شركتنا'} مرخّصة حديثًا في ${c.zone ?? 'أبوظبي'} وتعمل في مجال ${c.activity ?? 'الأعمال'} مع ${c.headcount ?? 'عدد من'} موظفًا ينتقلون من ${c.origin ?? 'الخارج'}. مرفق: الرخصة التجارية، عقد التأسيس، مخطط المستفيدين الحقيقيين، الحسابات المدققة للشركة الأم، إثبات مصدر الأموال، وعقود العملاء الموقعة.\n\nنقدّر الحصول على قرار خلال عشرة أيام عمل.\n\nمع التحية،\n${c.signatory ?? 'المفوّض بالتوقيع'}` };
    case 'employer_rent_guarantee':
      return { subject: `Rent guarantee for ${c.employeeName ?? 'our employee'}`,
        en: `To whom it may concern,\n\n${c.companyName ?? 'The company'} confirms that ${c.employeeName ?? 'the employee'} is employed as ${c.role ?? 'a staff member'} with a basic monthly salary of AED ${c.salary ?? '25,000'}. The company guarantees the rent of AED ${c.rent ?? '120,000'} per year for the tenancy at ${c.address ?? 'the stated address'} and will settle it by bank transfer or direct debit in place of post-dated cheques.\n\nSincerely,\n${c.signatory ?? 'Authorised signatory'}`,
        ar: `إلى من يهمه الأمر،\n\nتؤكد شركة ${c.companyName ?? 'الشركة'} أن ${c.employeeName ?? 'الموظف'} يعمل بوظيفة ${c.role ?? 'موظف'} براتب أساسي شهري ${c.salary ?? '25,000'} درهم. وتضمن الشركة سداد الإيجار البالغ ${c.rent ?? '120,000'} درهم سنويًا للعقار في ${c.address ?? 'العنوان المذكور'} عبر التحويل البنكي أو الخصم المباشر بدلًا من الشيكات المؤجلة.\n\nمع التقدير،\n${c.signatory ?? 'المفوّض بالتوقيع'}` };
    case 'school_application':
      return { subject: `Admission enquiry: ${c.yearGroup ?? 'Year 3'} for ${c.intake ?? 'January 2027'}`,
        en: `Dear Admissions Team,\n\nOur family is relocating to Abu Dhabi on ${c.arrival ?? '4 January 2027'} with ${c.companyName ?? 'our employer'}. We would like to apply for a ${c.yearGroup ?? 'Year 3'} place for the ${c.intake ?? 'January'} intake and ask to join the waiting list if the year group is full. Reports and passports are attached.\n\nKind regards,\n${c.parentName ?? 'Parent'}`,
        ar: `السادة قسم القبول،\n\nتنتقل عائلتنا إلى أبوظبي بتاريخ ${c.arrival ?? '4 يناير 2027'} مع ${c.companyName ?? 'جهة العمل'}. نرغب في التقديم لمقعد في ${c.yearGroup ?? 'السنة الثالثة'} لدخول ${c.intake ?? 'يناير'}، ونطلب الانضمام إلى قائمة الانتظار إن كانت المرحلة مكتملة. التقارير وجوازات السفر مرفقة.\n\nمع التحية،\n${c.parentName ?? 'ولي الأمر'}` };
    case 'landlord_direct_debit':
      return { subject: `Tenancy at ${c.address ?? 'the property'}: payment by direct debit`,
        en: `Dear ${c.landlordName ?? 'Landlord'},\n\nWe would like to proceed with the tenancy at ${c.address ?? 'the property'} at AED ${c.rent ?? '120,000'} per year. As our chequebook will take several weeks to issue, we propose payment through the UAE Direct Debit System in ${c.instalments ?? '4'} instalments, backed by an employer guarantee letter, so we can sign and register the Tawtheeq this week.\n\nKind regards,\n${c.tenantName ?? 'Tenant'}`,
        ar: `السيد/ة ${c.landlordName ?? 'المالك'}،\n\nنرغب في المضي في عقد إيجار ${c.address ?? 'العقار'} بقيمة ${c.rent ?? '120,000'} درهم سنويًا. ولأن دفتر الشيكات سيستغرق عدة أسابيع، نقترح الدفع عبر نظام الخصم المباشر الإماراتي على ${c.instalments ?? '4'} أقساط مع خطاب ضمان من جهة العمل، لنوقّع ونسجّل التوثيق هذا الأسبوع.\n\nمع التحية،\n${c.tenantName ?? 'المستأجر'}` };
  }
}

export function mockWhatIf(question: string): WhatIfResult {
  const q = question.toLowerCase();
  const r: WhatIfResult = { rationale: 'Demo mode: matched by keywords.' };
  if (q.includes('kyc') || q.includes('bank') && q.includes('early')) r.toggles = { ...r.toggles, kycEarly: true };
  if (q.includes('cheque') || q.includes('direct debit')) r.toggles = { ...r.toggles, chequeFree: true };
  if (q.includes('flexi')) r.toggles = { ...r.toggles, flexiDesk: true };
  if (q.includes('mainland')) r.zone = 'MAINLAND';
  if (q.includes('adgm')) r.zone = 'ADGM';
  if (q.includes('reject')) r.events = ['bank_rejected'];
  const m = q.match(/(\d{1,3})\s*(people|staff|employees)/);
  if (m) r.headcount = Number(m[1]);
  return r;
}
