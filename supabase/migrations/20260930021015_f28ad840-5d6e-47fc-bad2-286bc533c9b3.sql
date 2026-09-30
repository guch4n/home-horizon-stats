CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  telefone text NOT NULL,
  origem_do_lead text NOT NULL CHECK (origem_do_lead IN ('site', 'whatsapp', 'indicação')),
  status text NOT NULL CHECK (status IN ('novo', 'em contato', 'qualificado', 'perdido')),
  data_de_criacao date NOT NULL DEFAULT CURRENT_DATE,
  imovel_de_interesse text NOT NULL
);

GRANT SELECT ON public.leads TO anon, authenticated;
GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dashboard pode visualizar leads"
ON public.leads
FOR SELECT
TO anon, authenticated
USING (true);

CREATE INDEX leads_data_de_criacao_idx ON public.leads (data_de_criacao DESC);