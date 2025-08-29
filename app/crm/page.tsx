import LeadForm from '@/LeadForm'
import OpportunityForm from '@/OpportunityForm'
import InteractionForm from '@/InteractionForm'
import ConvertLeadButton from '@/ConvertLeadButton'
import { prisma } from '@/lib/prisma'

async function loadLeads() {
  try {
    return await prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, include: { interactions: true } })
  } catch {
    return []
  }
}

async function loadOpportunities() {
  try {
    return await prisma.opportunity.findMany({ orderBy: { createdAt: 'desc' } })
  } catch {
    return []
  }
}

export default async function Page() {
  const [leads, opportunities] = await Promise.all([loadLeads(), loadOpportunities()])
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">CRM</h1>
      <div className="mb-8">
        <LeadForm />
      </div>
      <h2 className="text-lg font-semibold mb-2">Leads</h2>
      <div className="space-y-4">
        {leads.map((lead: any) => (
          <div key={lead.id} className="border p-3 rounded">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{lead.name}</div>
                <div className="text-sm text-gray-500">{lead.status}</div>
              </div>
              {lead.status !== 'CONVERTED' && <ConvertLeadButton id={lead.id} />}
            </div>
            <div className="mt-2 ml-2">
              <ul className="text-sm list-disc list-inside">
                {lead.interactions.map((i: any) => (
                  <li key={i.id}>{i.type}: {i.note}</li>
                ))}
              </ul>
              <InteractionForm leadId={lead.id} />
            </div>
          </div>
        ))}
      </div>
      <h2 className="text-lg font-semibold mt-8 mb-2">Opportunities</h2>
      <div className="mb-4">
        <OpportunityForm leads={leads} />
      </div>
      <ul className="space-y-1">
        {opportunities.map((op: any) => (
          <li key={op.id} className="border p-2 rounded">{op.title} - {op.stage} - {op.value ?? 0}</li>
        ))}
      </ul>
    </div>
  )
}
