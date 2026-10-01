import OpenAI from "npm:openai";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const openrouter = new OpenAI({
  apiKey: Deno.env.get("OPENROUTER_API_KEY"),
  baseURL: "https://openrouter.ai/api/v1",
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const { lead_id, action = "generate", mensagem } = await req.json();

    if (!lead_id) {
      return new Response(
        JSON.stringify({
          error: "lead_id é obrigatório",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("DB_SERVICE_ROLE_KEY")!
    );

    /*
     * ==========================================
     * AÇÃO: SALVAR
     * ==========================================
     */

    if (action === "save") {
      if (!mensagem || !mensagem.trim()) {
        return new Response(
          JSON.stringify({
            error: "A mensagem é obrigatória para salvar.",
          }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const { data: updatedLead, error: updateError } = await supabase
        .from("leads")
        .update({
          mensagem_ia: mensagem.trim(),
          mensagem_ia_gerada_em: new Date().toISOString(),
        })
        .eq("id", lead_id)
        .select("id, mensagem_ia, mensagem_ia_gerada_em")
        .single();

      if (updateError) {
        throw updateError;
      }

      return new Response(
        JSON.stringify({
          success: true,
          mensagem: updatedLead.mensagem_ia,
          mensagem_ia_gerada_em: updatedLead.mensagem_ia_gerada_em,
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    /*
     * ==========================================
     * BUSCAR LEAD
     * ==========================================
     */

    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("id, nome, imovel_de_interesse")
      .eq("id", lead_id)
      .single();

    if (leadError || !lead) {
      return new Response(
        JSON.stringify({
          error: "Lead não encontrado",
        }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    /*
     * ==========================================
     * GERAR MENSAGEM
     * ==========================================
     */

    const prompt = `
Você é um assistente de atendimento de uma imobiliária
de alto padrão.

Crie uma sugestão de primeira mensagem para um novo lead.

Dados do lead:

Nome: ${lead.nome}

Imóvel de interesse:
${lead.imovel_de_interesse}

Regras obrigatórias:

- Seja cordial e profissional.
- Personalize a mensagem usando o nome do lead.
- Mencione o imóvel de interesse.
- Não invente características do imóvel.
- Não invente preço.
- Não invente metragem.
- Não invente disponibilidade.
- Não faça promessas.
- Não mencione informações que não foram fornecidas.
- A mensagem deve parecer escrita por um corretor humano.
- Faça no máximo uma pergunta.
- Seja objetiva.
- Retorne somente a mensagem final.
- Crie uma abordagem natural e diferente de mensagens genéricas.
`;

    const response = await openrouter.responses.create({
      model: "openrouter/free",
      input: prompt,
    });

    const mensagemGerada = response.output_text?.trim();

    if (!mensagemGerada) {
      throw new Error("A IA não retornou uma mensagem.");
    }

    /*
     * IMPORTANTE:
     * A geração NÃO salva mais automaticamente.
     * O frontend decide quando salvar.
     */

    return new Response(
      JSON.stringify({
        success: true,
        mensagem: mensagemGerada,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Erro ao gerar mensagem:", error);

    return new Response(
      JSON.stringify({
        error: "Erro ao gerar mensagem",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});