import { useState } from "react";
import { RefreshCw, Save, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  gerarMensagemLead,
  salvarMensagemLead,
} from "@/lib/lead-agent";

type GenerateLeadMessageButtonProps = {
  leadId: string;
  mensagemSalva?: string | null;
};

export function GenerateLeadMessageButton({
  leadId,
  mensagemSalva,
}: GenerateLeadMessageButtonProps) {
  const [mensagem, setMensagem] = useState(mensagemSalva ?? "");
  const [gerando, setGerando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [aberto, setAberto] = useState(Boolean(mensagemSalva));

  const handleGerar = async () => {
    try {
      setGerando(true);
      setAberto(true);

      const novaMensagem = await gerarMensagemLead(leadId);

      setMensagem(novaMensagem);
    } catch (error) {
      console.error("Erro ao gerar mensagem:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Erro ao gerar mensagem."
      );
    } finally {
      setGerando(false);
    }
  };

  const handleSalvar = async () => {
    if (!mensagem.trim()) {
      alert("Digite uma mensagem antes de salvar.");
      return;
    }

    try {
      setSalvando(true);

      await salvarMensagemLead(leadId, mensagem);

      alert("Mensagem salva com sucesso.");
    } catch (error) {
      console.error("Erro ao salvar mensagem:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Erro ao salvar mensagem."
      );
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="space-y-3">
      {!aberto && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleGerar}
          disabled={gerando}
        >
          <Sparkles className="size-4" />
          Gerar mensagem
        </Button>
      )}

      {aberto && (
        <div className="min-w-[280px] space-y-3">
          <Textarea
            value={mensagem}
            onChange={(event) => setMensagem(event.target.value)}
            placeholder="Mensagem gerada pela IA"
            rows={5}
            disabled={gerando || salvando}
          />

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGerar}
              disabled={gerando || salvando}
            >
              <RefreshCw
                className={`size-4 ${
                  gerando ? "animate-spin" : ""
                }`}
              />
              {gerando ? "Gerando..." : "Gerar outra"}
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleSalvar}
              disabled={
                gerando ||
                salvando ||
                !mensagem.trim()
              }
            >
              <Save className="size-4" />
              {salvando ? "Salvando..." : "Salvar mensagem"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}