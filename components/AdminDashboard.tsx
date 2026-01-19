
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storage';
import { FormSubmission, ProjectStatus } from '../types';
import { REQUIREMENT_FORM_FIELDS } from '../constants';

const AdminDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setSubmissions(storageService.getSubmissions());
  }, []);

  const selectedSubmission = submissions.find(s => s.id === selectedId);

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este requisito?')) {
      storageService.deleteSubmission(id);
      setSubmissions(storageService.getSubmissions());
      if (selectedId === id) setSelectedId(null);
    }
  };

  const handleStatusChange = (id: string, newStatus: ProjectStatus) => {
    storageService.updateSubmissionStatus(id, newStatus);
    setSubmissions(storageService.getSubmissions());
  };

  const copyToClipboard = () => {
    if (!selectedSubmission) return;

    let text = `# Relatório Técnico de Requisitos\n\n`;
    text += `## Informações Gerais\n`;
    text += `**Projeto:** ${selectedSubmission.answers.projectName || 'Sem Nome'}\n`;
    text += `**Status Atual:** ${selectedSubmission.status || ProjectStatus.NOT_STARTED}\n`;
    text += `**Solicitante:** ${selectedSubmission.userName} (${selectedSubmission.userEmail})\n`;
    text += `**Telefone de Contato:** ${selectedSubmission.userPhone} ${selectedSubmission.isWhatsApp ? '(WhatsApp)' : ''}\n`;
    text += `**Data do Envio:** ${new Date(selectedSubmission.timestamp).toLocaleString('pt-BR')}\n\n`;
    text += `--- \n\n`;
    text += `## Detalhes do Escopo e Design\n\n`;

    REQUIREMENT_FORM_FIELDS.forEach(field => {
      const answer = selectedSubmission.answers[field.id];
      
      // Verifica se o campo deve ser exibido com base em dependências
      const isVisible = !field.dependsOn || selectedSubmission.answers[field.dependsOn.fieldId] === field.dependsOn.value;

      if (answer && isVisible) {
        // Converte o valor interno (inglês) para o rótulo (português) se for um SELECT
        const displayAnswer = typeof answer === 'string' && field.options 
          ? field.options.find(o => o.value === answer)?.label || answer
          : answer;

        text += `### ${field.label}\n${displayAnswer}\n\n`;
      }
    });

    navigator.clipboard.writeText(text).then(() => {
      alert('Copiado para a área de transferência em Português!');
    });
  };

  const printReport = () => {
    window.print();
  };

  const getStatusColor = (status: ProjectStatus | undefined) => {
    switch (status) {
      case ProjectStatus.STARTED: return 'bg-blue-100 text-blue-700 border-blue-200';
      case ProjectStatus.NEEDS_ADJUSTMENTS: return 'bg-amber-100 text-amber-700 border-amber-200';
      case ProjectStatus.FINISHED: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
      {/* List Section */}
      <div className="w-full lg:w-1/3 no-print">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h2 className="font-bold text-slate-800">Requisitos Recebidos</h2>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">{submissions.length}</span>
          </div>
          <div className="divide-y divide-slate-100 max-h-[70vh] overflow-y-auto">
            {submissions.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <i className="fas fa-inbox text-3xl mb-3"></i>
                <p>Nenhum requisito ainda.</p>
              </div>
            ) : (
              submissions.map(sub => (
                <div 
                  key={sub.id}
                  onClick={() => setSelectedId(sub.id)}
                  className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors group ${selectedId === sub.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-slate-900 truncate pr-2">
                      {sub.answers.projectName || 'Sem Título'}
                    </h3>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(sub.id); }}
                      className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xs text-slate-500 truncate">{sub.userName}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusColor(sub.status)} font-bold`}>
                      {sub.status || ProjectStatus.NOT_STARTED}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(sub.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Detail Section */}
      <div className="flex-grow">
        {selectedSubmission ? (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 no-print">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-slate-900">{selectedSubmission.answers.projectName}</h1>
                  <div className="relative inline-block">
                    <select 
                      value={selectedSubmission.status || ProjectStatus.NOT_STARTED}
                      onChange={(e) => handleStatusChange(selectedSubmission.id, e.target.value as ProjectStatus)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border outline-none appearance-none pr-8 cursor-pointer transition-all ${getStatusColor(selectedSubmission.status)}`}
                    >
                      {Object.values(ProjectStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[10px]">
                      <i className="fas fa-chevron-down"></i>
                    </div>
                  </div>
                </div>
                <p className="text-slate-500 text-sm">Enviado por {selectedSubmission.userName} em {new Date(selectedSubmission.timestamp).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-sm transition-colors"
                >
                  <i className="fas fa-copy"></i> Copiar MD
                </button>
                <button 
                  onClick={printReport}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-lg"
                >
                  <i className="fas fa-file-pdf"></i> Gerar PDF
                </button>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Print Only Header */}
              <div className="hidden print:block mb-8 border-b-2 border-slate-900 pb-4">
                <h1 className="text-3xl font-bold">Relatório Técnico de Requisitos</h1>
                <div className="flex justify-between mt-2 text-slate-600">
                  <span>Projeto: {selectedSubmission.answers.projectName}</span>
                  <span>Status: {selectedSubmission.status || ProjectStatus.NOT_STARTED}</span>
                  <span>Data: {new Date(selectedSubmission.timestamp).toLocaleDateString()}</span>
                </div>
              </div>

              {REQUIREMENT_FORM_FIELDS.map(field => {
                const answer = selectedSubmission.answers[field.id];
                if (!answer) return null;
                
                // If the field was dynamic and its dependency is not met, we don't show it
                if (field.dependsOn && selectedSubmission.answers[field.dependsOn.fieldId] !== field.dependsOn.value) {
                  return null;
                }

                return (
                  <section key={field.id} className="border-l-4 border-slate-200 pl-6 py-2">
                    <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">{field.label}</h3>
                    <div className="text-slate-800 leading-relaxed whitespace-pre-wrap text-lg">
                      {typeof answer === 'string' && field.options 
                        ? field.options.find(o => o.value === answer)?.label || answer
                        : answer}
                    </div>
                  </section>
                );
              })}
              
              <div className="mt-12 pt-8 border-t border-slate-100 no-print">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">Metadados do Contato</h4>
                <div className="flex flex-wrap gap-8">
                  <div>
                    <span className="block text-xs text-slate-400">Nome</span>
                    <span className="font-medium">{selectedSubmission.userName}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400">Email</span>
                    <span className="font-medium text-indigo-600">{selectedSubmission.userEmail}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400">Telefone</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{selectedSubmission.userPhone}</span>
                      {selectedSubmission.isWhatsApp && (
                        <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                          <i className="fab fa-whatsapp"></i> Zap
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-3xl h-full min-h-[400px] flex items-center justify-center text-slate-400 no-print">
            <div className="text-center">
              <i className="fas fa-mouse-pointer text-4xl mb-4"></i>
              <p className="font-medium">Selecione um projeto para visualizar os detalhes.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
