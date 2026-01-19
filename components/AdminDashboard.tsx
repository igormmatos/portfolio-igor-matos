
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storage';
import { FormSubmission, ProjectStatus, PortfolioProject, SiteContent, SiteService } from '../types';
import { REQUIREMENT_FORM_FIELDS } from '../constants';

type AdminTab = 'submissions' | 'portfolio' | 'content';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('submissions');
  
  // State for Submissions
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);

  // State for Portfolio
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);

  // State for Content
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);

  // State for Notifications (Toast)
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setSubmissions(storageService.getSubmissions());
    setProjects(storageService.getProjects());
    setSiteContent(storageService.getSiteContent());
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // --- SUBMISSION HANDLERS ---
  const selectedSubmission = submissions.find(s => s.id === selectedSubId);
  
  const handleDeleteSubmission = (id: string) => {
    if (window.confirm('Excluir requisito?')) {
      storageService.deleteSubmission(id);
      refreshData();
      if (selectedSubId === id) setSelectedSubId(null);
      showNotification('Requisito excluído com sucesso.');
    }
  };

  const handleStatusChange = (id: string, newStatus: ProjectStatus) => {
    storageService.updateSubmissionStatus(id, newStatus);
    refreshData();
    showNotification('Status atualizado.');
  };

  const getStatusColor = (status: ProjectStatus | undefined) => {
    switch (status) {
      case ProjectStatus.STARTED: return 'bg-blue-100 text-blue-700 border-blue-200';
      case ProjectStatus.NEEDS_ADJUSTMENTS: return 'bg-amber-100 text-amber-700 border-amber-200';
      case ProjectStatus.FINISHED: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // --- PORTFOLIO HANDLERS ---
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    
    const projectToSave = {
      ...editingProject,
      id: editingProject.id || Math.random().toString(36).substr(2, 9)
    };
    
    storageService.saveProject(projectToSave);
    setEditingProject(null);
    refreshData();
    showNotification('Projeto salvo com sucesso!', 'success');
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Excluir projeto do portfólio?')) {
      storageService.deleteProject(id);
      refreshData();
      showNotification('Projeto removido.', 'success');
    }
  };

  // --- CONTENT HANDLERS ---
  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (siteContent) {
      storageService.saveSiteContent(siteContent);
      showNotification('Conteúdo do site e serviços atualizados com sucesso!', 'success');
    }
  };

  const handleAddService = () => {
    if (!siteContent) return;
    const newService: SiteService = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Novo Serviço',
      description: 'Descrição do serviço.',
      icon: 'fas fa-star'
    };
    setSiteContent({
      ...siteContent,
      services: [...siteContent.services, newService]
    });
  };

  const handleDeleteService = (index: number) => {
    if (!siteContent) return;
    if (window.confirm('Remover este serviço?')) {
      const newServices = [...siteContent.services];
      newServices.splice(index, 1);
      setSiteContent({ ...siteContent, services: newServices });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      {/* HEADER & TABS */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Painel Administrativo</h1>
        <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('submissions')}
            className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'submissions' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <i className="fas fa-list-alt mr-2"></i> Requisitos ({submissions.length})
          </button>
          <button 
            onClick={() => setActiveTab('portfolio')}
            className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'portfolio' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <i className="fas fa-briefcase mr-2"></i> Portfólio ({projects.length})
          </button>
          <button 
            onClick={() => setActiveTab('content')}
            className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'content' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <i className="fas fa-pen-fancy mr-2"></i> Conteúdo do Site
          </button>
        </div>
      </div>

      {/* --- TAB: SUBMISSIONS --- */}
      {activeTab === 'submissions' && (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* List */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="divide-y divide-slate-100 max-h-[70vh] overflow-y-auto">
                {submissions.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">Nenhum requisito recebido.</div>
                ) : (
                  submissions.map(sub => (
                    <div 
                      key={sub.id}
                      onClick={() => setSelectedSubId(sub.id)}
                      className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${selectedSubId === sub.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''}`}
                    >
                      <h3 className="font-semibold text-slate-900 truncate">{sub.answers.projectName || 'Sem Título'}</h3>
                      <div className="flex justify-between items-center mt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusColor(sub.status)} font-bold`}>
                          {sub.status || ProjectStatus.NOT_STARTED}
                        </span>
                        <span className="text-[10px] text-slate-400">{new Date(sub.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex-grow">
            {selectedSubmission ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                 <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-100">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{selectedSubmission.answers.projectName}</h2>
                      <p className="text-slate-500 text-sm mt-1">{selectedSubmission.userName} • {selectedSubmission.userEmail}</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <select 
                        value={selectedSubmission.status || ProjectStatus.NOT_STARTED}
                        onChange={(e) => handleStatusChange(selectedSubmission.id, e.target.value as ProjectStatus)}
                        className="text-sm border rounded-lg px-3 py-2 bg-white text-slate-900"
                      >
                        {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button onClick={() => handleDeleteSubmission(selectedSubmission.id)} className="text-red-500 p-2 hover:bg-red-50 rounded"><i className="fas fa-trash"></i></button>
                    </div>
                 </div>
                 
                 <div className="space-y-6">
                    {REQUIREMENT_FORM_FIELDS.map(field => {
                      const ans = selectedSubmission.answers[field.id];
                      if (!ans) return null;
                      if (field.dependsOn && selectedSubmission.answers[field.dependsOn.fieldId] !== field.dependsOn.value) return null;
                      return (
                        <div key={field.id}>
                          <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">{field.label}</h4>
                          <p className="text-slate-800 whitespace-pre-wrap">
                             {typeof ans === 'string' && field.options ? field.options.find(o => o.value === ans)?.label || ans : ans}
                          </p>
                        </div>
                      )
                    })}
                 </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl p-12">
                Selecione um item para ver detalhes
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB: PORTFOLIO --- */}
      {activeTab === 'portfolio' && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-lg">Projetos Ativos</h3>
               <button 
                onClick={() => setEditingProject({ id: '', title: '', description: '', technologies: '' })}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700"
               >
                 <i className="fas fa-plus mr-2"></i> Novo Projeto
               </button>
            </div>
            
            <div className="grid gap-4">
              {projects.map(p => (
                <div key={p.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-start group">
                  <div>
                    <h4 className="font-bold text-lg text-slate-900">{p.title}</h4>
                    <p className="text-slate-500 text-sm mb-2">{p.description}</p>
                    <span className="inline-block bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded">{p.technologies}</span>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingProject(p)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"><i className="fas fa-edit"></i></button>
                    <button onClick={() => handleDeleteProject(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><i className="fas fa-trash"></i></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
             {editingProject && (
               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xl sticky top-24">
                 <h3 className="font-bold text-lg mb-4">{editingProject.id ? 'Editar Projeto' : 'Novo Projeto'}</h3>
                 <form onSubmit={handleSaveProject} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Título</label>
                      <input 
                        type="text" 
                        required
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                        value={editingProject.title}
                        onChange={e => setEditingProject({...editingProject, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Descrição</label>
                      <textarea 
                        required
                        rows={3}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                        value={editingProject.description}
                        onChange={e => setEditingProject({...editingProject, description: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Tecnologias (separadas por vírgula)</label>
                      <input 
                        type="text" 
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                        value={editingProject.technologies}
                        onChange={e => setEditingProject({...editingProject, technologies: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Link GitHub</label>
                        <input 
                          type="text" 
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                          value={editingProject.githubUrl || ''}
                          onChange={e => setEditingProject({...editingProject, githubUrl: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Link Online</label>
                        <input 
                          type="text" 
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                          value={editingProject.liveUrl || ''}
                          onChange={e => setEditingProject({...editingProject, liveUrl: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button type="button" onClick={() => setEditingProject(null)} className="flex-1 py-2 text-slate-500 hover:bg-slate-50 rounded-lg">Cancelar</button>
                      <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">Salvar</button>
                    </div>
                 </form>
               </div>
             )}
          </div>
        </div>
      )}

      {/* --- TAB: CONTENT --- */}
      {activeTab === 'content' && siteContent && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSaveContent} className="space-y-6">
            <h3 className="font-bold text-xl mb-6 pb-2 border-b">Perfil Profissional</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Nome de Exibição</label>
                <input 
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  value={siteContent.profileName}
                  onChange={e => setSiteContent({...siteContent, profileName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">WhatsApp (apenas números)</label>
                <input 
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  value={siteContent.whatsappNumber}
                  onChange={e => setSiteContent({...siteContent, whatsappNumber: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Título Profissional</label>
              <input 
                className="w-full border border-slate-300 rounded-lg px-4 py-2 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                value={siteContent.profileTitle}
                onChange={e => setSiteContent({...siteContent, profileTitle: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Biografia Resumida</label>
              <textarea 
                rows={4}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                value={siteContent.profileBio}
                onChange={e => setSiteContent({...siteContent, profileBio: e.target.value})}
              />
            </div>

            <h3 className="font-bold text-xl mt-8 mb-6 pb-2 border-b flex justify-between items-center">
              Serviços Oferecidos
            </h3>
            <div className="space-y-4">
              {siteContent.services.map((svc, idx) => (
                <div key={svc.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 relative group">
                   <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        type="button" 
                        onClick={() => handleDeleteService(idx)} 
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Remover Serviço"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                   </div>
                   <div className="flex gap-2 mb-2">
                     <div className="w-1/3">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Título</label>
                        <input 
                          className="w-full border border-slate-300 rounded px-2 py-1 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                          value={svc.title}
                          onChange={e => {
                            const newServices = [...siteContent.services];
                            newServices[idx].title = e.target.value;
                            setSiteContent({...siteContent, services: newServices});
                          }}
                        />
                     </div>
                     <div className="w-1/3">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Ícone (FontAwesome)</label>
                        <div className="flex gap-1">
                          <input 
                            className="w-full border border-slate-300 rounded px-2 py-1 text-sm font-mono bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            value={svc.icon}
                            onChange={e => {
                              const newServices = [...siteContent.services];
                              newServices[idx].icon = e.target.value;
                              setSiteContent({...siteContent, services: newServices});
                            }}
                          />
                          <a 
                            href="https://fontawesome.com/search?m=free" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-2 py-1 bg-slate-100 border border-slate-300 rounded hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-colors flex items-center justify-center"
                            title="Buscar ícones no FontAwesome"
                          >
                            <i className="fas fa-external-link-alt text-xs"></i>
                          </a>
                        </div>
                     </div>
                   </div>
                   <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400">Descrição</label>
                      <textarea 
                        rows={2}
                        className="w-full border border-slate-300 rounded px-2 py-1 text-sm bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        value={svc.description}
                        onChange={e => {
                          const newServices = [...siteContent.services];
                          newServices[idx].description = e.target.value;
                          setSiteContent({...siteContent, services: newServices});
                        }}
                      />
                   </div>
                </div>
              ))}
              
              <button 
                type="button" 
                onClick={handleAddService}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-bold hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
              >
                <i className="fas fa-plus-circle"></i> Adicionar Novo Serviço
              </button>
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg"
              >
                Salvar Alterações do Site
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- NOTIFICATION (TOAST) --- */}
      {notification && (
        <div className={`fixed bottom-6 left-6 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-[slideIn_0.3s_ease-out] ${
          notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <i className={`fas ${notification.type === 'success' ? 'fa-check' : 'fa-exclamation'} text-lg`}></i>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider opacity-90 mb-0.5">
              {notification.type === 'success' ? 'Sucesso' : 'Erro'}
            </h4>
            <p className="font-medium text-sm leading-tight">{notification.message}</p>
          </div>
          
          <style>{`
            @keyframes slideIn {
              from { transform: translateY(20px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;