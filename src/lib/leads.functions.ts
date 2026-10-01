import { createClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import type { Database } from "@/integrations/supabase/types";

export const getLeads = createServerFn({
  method: "GET",
}).handler(async () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "As variáveis SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY não foram configuradas."
    );
  }

  const client = createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      storage: undefined,
    },
  });

  const {
    data,
    error,
  } = await client
    .from("leads")
    .select(
      "id,nome,telefone,origem_do_lead,status,data_de_criacao,imovel_de_interesse,mensagem_ia,mensagem_ia_gerada_em"
    )
    .order("data_de_criacao", {
      ascending: false,
    });

  if (error) {
    console.error("Erro ao consultar Supabase:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Erro ao consultar os leads: ${error.message}`
    );
  }

  return data ?? [];
});