// Interpretador inicial de comandos do WhatsApp para o Minhas Contas.
// Não acessa dados nem envia mensagens. Exige confirmação do usuário antes de gravar.
export function interpretarMensagem(texto, agora = new Date()) {
  const s = String(texto || '').trim();
  if (!s) return { tipo: 'ajuda' };
  const normal = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (/\b(quanto gastei|total do mes|resumo do mes)\b/.test(normal)) return { tipo: 'resumo' };
  const lembra = normal.match(/\b(?:me lembre|me lembra|lembrar|lembrete)\b\s*(?:de\s*)?(.+)/);
  if (lembra) return { tipo: 'lembrete', descricao: s.slice(lembra.index + lembra[0].indexOf(lembra[1])), requerData: true, confirmar: true };
  const dinheiro = s.match(/(?:R\$\s*)?(\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?|\d+(?:[.,]\d{1,2})?)\s*(?:reais?|R\$)?/i);
  if (!dinheiro || !/(?:gastei|comprei|paguei|compra|despesa)/.test(normal)) return { tipo: 'ajuda' };
  const valor = Number(dinheiro[1].replace(/\./g, '').replace(',', '.'));
  if (!Number.isFinite(valor) || valor <= 0 || valor > 1000000) return { tipo: 'erro', mensagem: 'Valor inválido' };
  let descricao = s.replace(dinheiro[0], '').replace(/\b(gastei|comprei|paguei|compra|despesa|de|com|no|na|em|hoje)\b/gi, ' ').replace(/\s+/g,' ').trim();
  if (!descricao) descricao = 'Despesa';
  return { tipo: 'despesa', nome: descricao, valor, data: agora.toISOString().slice(0,10), confirmar: true };
}
