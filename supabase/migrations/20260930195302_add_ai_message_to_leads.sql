ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS mensagem_ia TEXT;

ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS mensagem_ia_gerada_em TIMESTAMPTZ;