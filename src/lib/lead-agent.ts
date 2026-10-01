import { supabase } from "@/integrations/supabase/client";

export async function gerarMensagemLead(leadId: string) {
  const { data, error } = await supabase.functions.invoke(
    "generate-lead-message",
    {
      body: {
        lead_id: leadId,
        action: "generate",
      },
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.success || !data?.mensagem) {
    throw new Error(
      data?.error || "Não foi possível gerar a mensagem."
    );
  }

  return data.mensagem as string;
}

export async function salvarMensagemLead(
  leadId: string,
  mensagem: string
) {
  const { data, error } = await supabase.functions.invoke(
    "generate-lead-message",
    {
      body: {
        lead_id: leadId,
        action: "save",
        mensagem,
      },
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.success) {
    throw new Error(
      data?.error || "Não foi possível salvar a mensagem."
    );
  }

  return data;
}