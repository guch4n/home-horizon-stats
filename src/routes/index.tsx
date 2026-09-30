import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  CircleDot,
  Clock3,
  Globe2,
  Lightbulb,
  MessageCircle,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import { getLeads } from "@/lib/leads.functions";
import {
  calculateLeadMetrics,
  isLeadOrigin,
  isLeadStatus,
  originLabels,
  origins,
  statusLabels,
  statuses,
  type Lead,
  type LeadStatus,
} from "@/lib/lead-metrics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const leadsQuery = queryOptions({ queryKey: ["leads"], queryFn: () => getLeads() });

type LeadSearch = { status?: LeadStatus; busca?: string };

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): LeadSearch => ({
    status:
      typeof search.status === "string" && isLeadStatus(search.status) ? search.status : undefined,
    busca: typeof search.busca === "string" && search.busca ? search.busca : undefined,
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(leadsQuery),
  component: Dashboard,
  errorComponent: DashboardError,
  notFoundComponent: () => <p className="p-8 text-center">Página não encontrada.</p>,
  head: () => ({
    meta: [
      { title: "Dashboard de Leads | CRI Soluções Imobiliárias" },
      { name: "description", content: "Painel de gestão e análise dos leads imobiliários da CRI." },
      { property: "og:title", content: "Dashboard de Leads | CRI Soluções Imobiliárias" },
      { property: "og:description", content: "Painel de gestão e análise dos leads imobiliários da CRI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Dashboard() {
  const { data: leads, isFetching, refetch } = useSuspenseQuery(leadsQuery);
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const metrics = calculateLeadMetrics(leads);
  const query = searchParams.busca?.toLocaleLowerCase("pt-BR").trim() ?? "";
  const filtered = leads.filter((lead) => {
    const matchesStatus = !searchParams.status || lead.status === searchParams.status;
    const matchesSearch =
      !query ||
      lead.nome.toLocaleLowerCase("pt-BR").includes(query) ||
      lead.telefone.toLocaleLowerCase("pt-BR").includes(query);
    return matchesStatus && matchesSearch;
  });

  const updateSearch = (next: Partial<LeadSearch>) => {
    void navigate({ search: (previous) => ({ ...previous, ...next }), replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex min-h-24 max-w-[1440px] items-center justify-between gap-4 px-5 py-4 lg:px-10">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-primary text-lg font-bold text-primary-foreground shadow-sm">CRI</div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-foreground sm:text-base">CRI Soluções Imobiliárias</p>
              <p className="mt-1 text-xs font-medium text-muted-foreground">Dashboard de Leads</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => void refetch()} disabled={isFetching} aria-label="Atualizar dados" className="h-10 bg-card">
            <RefreshCw className={cn(isFetching && "animate-spin")} />
            <span className="hidden sm:inline">{isFetching ? "Atualizando" : "Atualizar"}</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 py-8 lg:px-10 lg:py-10">
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase text-primary">Visão geral</p>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Dashboard de Leads</h1>
          <p className="mt-2 text-sm text-muted-foreground">Acompanhe a jornada comercial e identifique as melhores oportunidades.</p>
        </div>

        <section aria-label="Indicadores principais" className="grid grid-cols-2 gap-3 lg:grid-cols-5 lg:gap-4">
          <MetricCard label="Total de Leads" value={metrics.total} icon={Users} featured />
          <MetricCard label="Novos" value={metrics.byStatus.novo} icon={CircleDot} />
          <MetricCard label="Em Contato" value={metrics.byStatus["em contato"]} icon={Clock3} />
          <MetricCard label="Qualificados" value={metrics.byStatus.qualificado} icon={CheckCircle2} />
          <MetricCard label="Perdidos" value={metrics.byStatus.perdido} icon={AlertCircle} />
        </section>

        <section className="mt-8 border-y border-border py-6" aria-labelledby="filters-title">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase text-primary">Base comercial</p>
              <h2 id="filters-title" className="mt-1 text-lg font-bold">Filtrar Leads</h2>
            </div>
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative md:w-72">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchParams.busca ?? ""}
                  onChange={(event) => updateSearch({ busca: event.target.value || undefined })}
                  className="h-10 bg-card pl-9 shadow-none"
                  placeholder="Buscar por nome ou telefone"
                  aria-label="Buscar por nome ou telefone"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filtrar por status">
                <FilterButton active={!searchParams.status} onClick={() => updateSearch({ status: undefined })}>Todos</FilterButton>
                {statuses.map((status) => (
                  <FilterButton key={status} active={searchParams.status === status} onClick={() => updateSearch({ status })}>
                    {statusLabels[status]}
                  </FilterButton>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8" aria-labelledby="leads-title">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 id="leads-title" className="text-lg font-bold">Leads recentes</h2>
              <p className="mt-1 text-xs text-muted-foreground">{filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}</p>
            </div>
            {isFetching && <span className="text-xs font-medium text-primary">Sincronizando…</span>}
          </div>
          <LeadTable leads={filtered} />
        </section>

        <section className="mt-12" aria-labelledby="summary-title">
          <p className="text-xs font-bold uppercase text-primary">Análise comercial</p>
          <h2 id="summary-title" className="mt-1 text-xl font-bold">Resumo dos Leads</h2>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <Distribution title="Leads por origem" items={origins.map((origin, index) => ({ label: originLabels[origin], value: metrics.byOrigin[origin], tone: index }))} total={metrics.total} />
            <Distribution title="Leads por status" items={statuses.map((status, index) => ({ label: statusLabels[status], value: metrics.byStatus[status], tone: index }))} total={metrics.total} />
          </div>
        </section>

        <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Insights">
          <Insight label="Taxa de qualificação" value={`${metrics.qualificationRate}%`} icon={ArrowUpRight} />
          <Insight label="Taxa de perda" value={`${metrics.lossRate}%`} icon={AlertCircle} />
          <Insight label="Maior origem" value={metrics.topOrigin ? originLabels[metrics.topOrigin] : "—"} icon={Globe2} />
          <Insight label="Mais qualificados" value={metrics.topQualifiedOrigin ? originLabels[metrics.topQualifiedOrigin] : "—"} icon={Lightbulb} />
        </section>
      </main>
      <footer className="mx-auto max-w-[1440px] px-5 pb-8 pt-4 text-xs text-muted-foreground lg:px-10">CRI Soluções Imobiliárias · Inteligência comercial</footer>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, featured = false }: { label: string; value: number; icon: typeof Users; featured?: boolean }) {
  return (
    <article className={cn("min-h-32 rounded-lg border border-border bg-card p-4 shadow-sm sm:p-5", featured && "border-primary/25 bg-brand-soft")}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold text-muted-foreground sm:text-sm">{label}</p>
        <Icon className={cn("size-4 text-muted-foreground", featured && "text-primary")} />
      </div>
      <p className="mt-5 text-3xl font-bold tabular-nums text-foreground">{value}</p>
    </article>
  );
}

function FilterButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return <Button variant={active ? "default" : "outline"} size="sm" onClick={onClick} className="shrink-0 shadow-none">{children}</Button>;
}

function LeadTable({ leads }: { leads: Lead[] }) {
  if (!leads.length) {
    return <div className="flex min-h-52 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 text-center"><Search className="mb-3 size-6 text-muted-foreground" /><p className="font-semibold">Nenhum lead encontrado</p><p className="mt-1 text-sm text-muted-foreground">Ajuste os filtros ou aguarde novos registros.</p></div>;
  }
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead><tr className="border-b border-border bg-muted/60 text-xs text-muted-foreground"><Th>Nome</Th><Th>Telefone</Th><Th>Origem</Th><Th>Status</Th><Th>Data de criação</Th><Th>Imóvel de interesse</Th></tr></thead>
          <tbody>{leads.map((lead) => <tr key={lead.id} className="border-b border-border/70 last:border-0 hover:bg-muted/35"><Td><span className="font-semibold text-foreground">{lead.nome}</span></Td><Td>{lead.telefone}</Td><Td><OriginBadge value={lead.origem_do_lead} /></Td><Td><StatusBadge value={lead.status} /></Td><Td>{formatDate(lead.data_de_criacao)}</Td><Td><span className="line-clamp-2 max-w-xs">{lead.imovel_de_interesse}</span></Td></tr>)}</tbody>
        </table>
      </div>
      <div className="divide-y divide-border md:hidden">{leads.map((lead) => <article key={lead.id} className="p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{lead.nome}</p><p className="mt-1 text-sm text-muted-foreground">{lead.telefone}</p></div><StatusBadge value={lead.status} /></div><div className="mt-4 flex flex-wrap items-center gap-2"><OriginBadge value={lead.origem_do_lead} /><span className="text-xs text-muted-foreground">{formatDate(lead.data_de_criacao)}</span></div><div className="mt-4 flex gap-2 border-t border-border pt-3 text-sm"><Building2 className="mt-0.5 size-4 shrink-0 text-primary" /><span>{lead.imovel_de_interesse}</span></div></article>)}</div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) { return <th className="px-5 py-3 font-semibold">{children}</th>; }
function Td({ children }: { children: React.ReactNode }) { return <td className="px-5 py-4 text-sm text-muted-foreground">{children}</td>; }

function StatusBadge({ value }: { value: string }) {
  const styles: Record<LeadStatus, string> = { novo: "bg-brand-soft text-primary", "em contato": "bg-muted text-muted-foreground", qualificado: "bg-success-soft text-success", perdido: "bg-warning-soft text-destructive" };
  return <span className={cn("inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold", isLeadStatus(value) ? styles[value] : "bg-muted text-muted-foreground")}>{isLeadStatus(value) ? statusLabels[value] : value}</span>;
}

function OriginBadge({ value }: { value: string }) {
  const Icon = value === "whatsapp" ? MessageCircle : value === "site" ? Globe2 : Users;
  return <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-foreground"><Icon className="size-3.5 text-primary" />{isLeadOrigin(value) ? originLabels[value] : value}</span>;
}

function Distribution({ title, items, total }: { title: string; items: { label: string; value: number; tone: number }[]; total: number }) {
  const tones = ["bg-primary", "bg-chart-2", "bg-success", "bg-chart-4"];
  return <article className="rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6"><h3 className="font-bold">{title}</h3><div className="mt-6 space-y-5">{items.map((item) => { const percentage = total ? Math.round((item.value / total) * 100) : 0; return <div key={item.label}><div className="mb-2 flex items-center justify-between text-xs"><span className="font-medium text-muted-foreground">{item.label}</span><span className="font-bold text-foreground">{item.value} <span className="font-normal text-muted-foreground">({percentage}%)</span></span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className={cn("h-full rounded-full transition-[width] duration-500", tones[item.tone])} style={{ width: `${percentage}%` }} /></div></div>; })}</div></article>;
}

function Insight({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Users }) {
  return <article className="flex min-h-28 items-center gap-4 border-l-2 border-primary bg-card px-5 py-4 shadow-sm"><div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-brand-soft text-primary"><Icon className="size-4" /></div><div><p className="text-xs font-medium text-muted-foreground">{label}</p><p className="mt-1 text-lg font-bold">{value}</p></div></article>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return <main className="flex min-h-screen items-center justify-center bg-background p-6"><div className="max-w-md rounded-lg border border-border bg-card p-8 text-center shadow-sm"><AlertCircle className="mx-auto size-8 text-destructive" /><h1 className="mt-4 text-xl font-bold">Não foi possível carregar os leads</h1><p className="mt-2 text-sm text-muted-foreground">{error.message}</p><Button className="mt-6" onClick={() => { void router.invalidate(); reset(); }}><RefreshCw />Tentar novamente</Button></div></main>;
}
