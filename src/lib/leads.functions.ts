import { createClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import type { Database } from "@/integrations/supabase/types";

export const getLeads = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];

  if (!url || !key) throw new Error("A conexão com a base de dados não está disponível.");

  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
  });

  const { data, error } = await client
    .from("leads")
    .select("id,nome,telefone,origem_do_lead,status,data_de_criacao,imovel_de_interesse")
    .order("data_de_criacao", { ascending: false });

  if (error) throw new Error("Não foi possível consultar os leads. Tente novamente.");
  return data;
});
