import type { Tables } from "@/integrations/supabase/types";

export type Lead = Tables<"leads">;
export type LeadStatus = "novo" | "em contato" | "qualificado" | "perdido";
export type LeadOrigin = "site" | "whatsapp" | "indicação";

export const statuses: LeadStatus[] = ["novo", "em contato", "qualificado", "perdido"];
export const origins: LeadOrigin[] = ["site", "whatsapp", "indicação"];

export const statusLabels: Record<LeadStatus, string> = {
  novo: "Novo",
  "em contato": "Em contato",
  qualificado: "Qualificado",
  perdido: "Perdido",
};

export const originLabels: Record<LeadOrigin, string> = {
  site: "Site",
  whatsapp: "WhatsApp",
  indicação: "Indicação",
};

export function isLeadStatus(value: string): value is LeadStatus {
  return statuses.includes(value as LeadStatus);
}

export function isLeadOrigin(value: string): value is LeadOrigin {
  return origins.includes(value as LeadOrigin);
}

export function calculateLeadMetrics(leads: Lead[]) {
  const byStatus = Object.fromEntries(statuses.map((status) => [status, 0])) as Record<LeadStatus, number>;
  const byOrigin = Object.fromEntries(origins.map((origin) => [origin, 0])) as Record<LeadOrigin, number>;
  const qualifiedByOrigin = Object.fromEntries(origins.map((origin) => [origin, 0])) as Record<LeadOrigin, number>;

  for (const lead of leads) {
    if (isLeadStatus(lead.status)) byStatus[lead.status] += 1;
    if (isLeadOrigin(lead.origem_do_lead)) {
      byOrigin[lead.origem_do_lead] += 1;
      if (lead.status === "qualificado") qualifiedByOrigin[lead.origem_do_lead] += 1;
    }
  }

  const topEntry = <T extends string>(entries: Record<T, number>): T | null => {
    const sorted = Object.entries(entries) as [T, number][];
    const [winner, count] = sorted.sort((a, b) => b[1] - a[1])[0] ?? [];
    return count > 0 ? winner : null;
  };

  const total = leads.length;
  return {
    total,
    byStatus,
    byOrigin,
    qualificationRate: total ? Math.round((byStatus.qualificado / total) * 100) : 0,
    lossRate: total ? Math.round((byStatus.perdido / total) * 100) : 0,
    topOrigin: topEntry(byOrigin),
    topQualifiedOrigin: topEntry(qualifiedByOrigin),
  };
}
