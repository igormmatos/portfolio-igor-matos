import React, { useState, useEffect, useRef } from 'react';
import { storageService } from '../services/storage';
import { FormSubmission, ProjectStatus, PortfolioProject, ProfileInfo, ServiceItem, CompetencyItem, JourneyItem } from '../types';
import { REQUIREMENT_FORM_FIELDS } from '../constants';

type AdminTab = 'submissions' | 'portfolio' | 'profile' | 'services' | 'competencies' | 'journey';

// --- SUB-COMPONENTS (DEFINIDOS FORA PARA PERFORMANCE) ---

// Botões de Ação (Edição/Exclusão)
const ActionButtons = ({ item, tableName, deleteFn, setListFn, editFn, handleDeleteItem }: any) => (
    <div className="absolute top-3 right-3 flex gap-2 z-20 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        {editFn && (
            <button 
                type="button"
                onClick={(e) => { 
                    e.preventDefault();
                    e.stopPropagation(); 
                    editFn(item); 
                }} 
                className="w-9 h-9 rounded-full bg-white text-indigo-600 shadow-md border border-slate-200 flex items-center justify-center hover:bg-indigo-50 cursor-pointer transition-transform active:scale-95"
                title="Editar"
            >
                <i className="fas fa-pen text-sm pointer-events-none"></i>
            </button>
        )}
        <button 
            type="button"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); 
                // Passamos o tableName para a função de delete
                handleDeleteItem(e, item.id, tableName, deleteFn, setListFn); 
            }} 
            className="w-9 h-9 rounded-full bg-white text-red-500 shadow-md border border-slate-200 flex items-center justify-center hover:bg-red-50 cursor-pointer transition-transform active:scale-95"
            title={`Excluir de ${tableName}`}
        >
            <i className="fas fa-trash text-sm pointer-events-none"></i>
        </button>
    </div>
);

const StatusBadge = ({ status }: { status?: string }) => {
    let color = 'bg-slate-100 text-slate-600';
    switch (status) {
      case ProjectStatus.NOT_STARTED: color = 'bg-slate-100 text-slate-600'; break;
      case ProjectStatus.STARTED: color = 'bg-blue-100 text-blue-600'; break;
      case ProjectStatus.NEEDS_ADJUSTMENTS: color = 'bg-yellow-100 text-yellow-700'; break;
      case ProjectStatus.FINISHED: color = 'bg-emerald-100 text-emerald-600'; break;
    }
    return <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${color}`}>{status || 'N/A'}</span>;
};

// --- MAIN COMPONENT ---

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('submissions');
  const [tabLoading, setTabLoading] = useState(false); // Loading específico da aba
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // Cache para evitar recarregamento desnecessário
  const loadedTabs = useRef<Set<string>>(new Set());

  // Data States
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);

  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [competencies, setCompetencies] = useState<CompetencyItem[]>([]);
  const [journey, setJourney] = useState<JourneyItem[]>([]);

  // Estado para o Modal de Confirmação de Exclusão
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string;
    tableName: string;
    deleteFn: ((id: string) => Promise<void>) | null;
    setListFn: any | null;
  }>({
    isOpen: false,
    id: '',
    tableName: '',
    deleteFn: null,
    setListFn: null
  });

  // Carrega dados apenas quando a aba muda
  useEffect(() => {
    loadTabData(activeTab);
  }, [activeTab]);

  const loadTabData = async (tab: AdminTab, force = false) => {
    // Se já carregou e não é forçado, não faz nada (Performance)
    if (!force && loadedTabs.current.has(tab)) return;

    setTabLoading(true);
    try {
      switch (tab) {
        case 'submissions':
          const subs = await storageService.getSubmissions();
          setSubmissions(subs);
          break;
        case 'portfolio':
          const projs = await storageService.getProjects();
          setProjects(projs);
          break;
        case 'profile':
          const prof = await storageService.getProfileInfo();
          setProfile(prof);
          break;
        case 'services':
          const svcs = await storageService.getServices();
          setServices(svcs);
          break;
        case 'competencies':
          const comps = await storageService.getCompetencies();
          setCompetencies(comps);
          break;
        case 'journey':
          const journ = await storageService.getJourney();
          setJourney(journ);
          break;
      }
      loadedTabs.current.add(tab);
    } catch (error) {
      console.error("Erro ao carregar aba:", error);
      showNotification('Erro ao carregar dados. Verifique sua conexão.', 'error');
    } finally {
      setTabLoading(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // --- SUBMISSION ACTIONS ---
  
  const handleStatusChange = async (id: string, newStatus: ProjectStatus) => {
    try {
      await storageService.updateSubmissionStatus(id, newStatus);
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
      showNotification('Status atualizado!', 'success');
    } catch (e: any) {
      showNotification(e.message || 'Erro ao atualizar status', 'error');
    }
  };

  const handleCopyPrompt = (submission: FormSubmission) => {
    let text = `📋 **REQUISITOS DO PROJETO**\n\n`;
    text += `👤 **Cliente:** ${submission.userName} (${submission.userEmail})\n`;
    text += `📅 **Data:** ${new Date(submission.timestamp).toLocaleDateString()}\n`;
    text += `-----------------------------------\n\n`;

    REQUIREMENT_FORM_FIELDS.forEach(field => {
      const answer = submission.answers[field.id];
      if (answer) {
        let displayAnswer = answer;
        if (field.options) {
            const opt = field.options.find(o => o.value === answer);
            if (opt) displayAnswer = opt.label;
        }
        text += `🔹 **${field.label}**\n${displayAnswer}\n\n`;
      }
    });

    navigator.clipboard.writeText(text);
    showNotification('Prompt copiado para a área de transferência!', 'success');
  };

  // --- GENERIC HANDLERS ---
  const handleInputChange = (setter: any, currentObj: any, field: string, value: any) => {
     setter({ ...currentObj, [field]: value });
  };

  const handleSaveItem = async (
    item: any, 
    saveFn: (i: any) => Promise<any>, // Expects to return the saved item
    tabName: AdminTab,
    setListFn: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    try {
      const savedItem = await saveFn(item);
      
      // Otimização: Atualiza o estado local diretamente com o item retornado do banco
      // em vez de recarregar toda a lista via API.
      setListFn((prevList: any[]) => {
          const index = prevList.findIndex(p => p.id === item.id);
          if (index >= 0) {
              // Update existing
              const newList = [...prevList];
              newList[index] = savedItem;
              return newList;
          } else {
              // Insert new (append to end or start, depending on preference. Here appending)
              return [...prevList, savedItem];
          }
      });

      showNotification('Item salvo com sucesso!', 'success');
      if (activeTab === 'portfolio') setEditingProject(null);
    } catch (e: any) { 
        showNotification(e.message || 'Erro ao salvar item', 'error'); 
    }
  };

  // Esta função agora APENAS abre o modal.
  const handleDeleteItem = async (
    e: React.MouseEvent,
    id: string, 
    tableName: string,
    deleteFn: (id: string) => Promise<void>,
    setListFn: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Configura o modal para abrir
    setDeleteModal({
        isOpen: true,
        id,
        tableName,
        deleteFn,
        setListFn
    });
  };

  // Esta função é chamada quando o usuário clica em "Confirmar" no modal
  const confirmDelete = async () => {
      const { id, tableName, deleteFn, setListFn } = deleteModal;
      
      if (id === undefined || id === null || !deleteFn || !setListFn) return;

      try {
        // Atualização Otimista (Frontend)
        setListFn((prevList: any[]) => prevList.filter((item) => item.id !== id));

        // Verifica se é um item novo (temporário ou sem ID salvo)
        const isTemp = id.toString().startsWith('temp_') || id === '';

        if (!isTemp) {
            await deleteFn(id);
            showNotification('Item excluído com sucesso!', 'success');
        } else {
            showNotification('Item removido da lista (não salvo).', 'success');
        }
        
        if (activeTab === 'submissions' && selectedSubId === id) {
            setSelectedSubId(null);
        }
      } catch (e: any) { 
          console.error(`[DELETE] Erro ao excluir de ${tableName}:`, e);
          showNotification('Erro ao excluir do banco de dados. Recarregue a página.', 'error'); 
      } finally {
          // Fecha o modal
          setDeleteModal({ isOpen: false, id: '', tableName: '', deleteFn: null, setListFn: null });
      }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      const savedProfile = await storageService.saveProfileInfo(profile);
      setProfile(savedProfile); // Update local state directly
      showNotification('Perfil atualizado!', 'success');
    } catch (e: any) { 
        showNotification(e.message || 'Erro ao salvar perfil', 'error'); 
    }
  };

  // --- STYLES CONSTANTS ---
  const inputClass = "w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all";
  const labelClass = "text-xs font-bold text-slate-500 uppercase mb-1 block";

  const selectedSubmission = submissions.find(s => s.id === selectedSubId);

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col md:flex-row overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className={`fixed md:relative top-0 h-full w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform z-30 shrink-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
           <span className="text-white font-bold text-xl"><i className="fas fa-layer-group text-indigo-500 mr-2"></i> Admin</span>
           <button className="md:hidden text-slate-400" onClick={() => setSidebarOpen(false)}><i className="fas fa-times"></i></button>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          {[
            { id: 'submissions', icon: 'fa-file-invoice', label: 'Requisitos' },
            { id: 'portfolio', icon: 'fa-briefcase', label: 'Portfólio' },
            { id: 'services', icon: 'fa-chess-knight', label: 'Serviços' },
            { id: 'competencies', icon: 'fa-star', label: 'Competências' },
            { id: 'journey', icon: 'fa-road', label: 'Jornada' },
            { id: 'profile', icon: 'fa-user-circle', label: 'Perfil' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as AdminTab); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <i className={`fas ${tab.icon} w-5 text-center`}></i>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-800 shrink-0">
           <button onClick={() => window.location.reload()} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
              <i className="fas fa-sign-out-alt"></i> Sair
           </button>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)}></div>}

      {/* MAIN CONTENT WRAPPER */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 relative w-full">
        
        {/* HEADER */}
        <header className="p-4 md:p-8 pb-0 shrink-0 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <button className="md:hidden p-2 text-slate-600" onClick={() => setSidebarOpen(true)}><i className="fas fa-bars text-xl"></i></button>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 capitalize">
                {activeTab === 'submissions' ? 'Gestão de Requisitos' : activeTab}
              </h1>
           </div>
           {tabLoading && <div className="text-indigo-600 animate-spin bg-white p-2 rounded-full shadow-sm"><i className="fas fa-circle-notch"></i></div>}
        </header>

        {/* SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">

            {/* --- TAB: SUBMISSIONS --- */}
            {activeTab === 'submissions' && (
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] min-h-[500px]">
                {/* LISTA */}
                <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{submissions.length} Solicitações</span>
                </div>
                <div className="flex-grow overflow-y-auto divide-y divide-slate-100">
                    {!tabLoading && submissions.length === 0 && <div className="p-8 text-center text-slate-400">Nenhum requisito recebido.</div>}
                    {submissions.map(sub => (
                    <div 
                        key={sub.id} 
                        onClick={() => setSelectedSubId(sub.id)} 
                        className={`p-5 cursor-pointer hover:bg-slate-50 transition-colors border-l-4 ${
                            selectedSubId === sub.id ? 'bg-indigo-50/50 border-indigo-600' : 'border-transparent'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="font-semibold text-slate-900 truncate pr-2">{sub.answers.projectName || 'Sem Nome'}</h3>
                            <StatusBadge status={sub.status} />
                        </div>
                        <p className="text-sm text-slate-500 mb-2 truncate">{sub.userName}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <i className="far fa-clock"></i> {new Date(sub.timestamp).toLocaleDateString()} 
                            <span>•</span>
                            {sub.isWhatsApp ? <i className="fab fa-whatsapp text-green-500"></i> : <i className="far fa-envelope"></i>}
                        </div>
                    </div>
                    ))}
                </div>
                </div>

                {/* DETALHES */}
                <div className="flex-grow bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    {selectedSubmission ? (
                    <>
                        <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{selectedSubmission.answers.projectName}</h2>
                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                                <span className="flex items-center gap-1"><i className="far fa-user"></i> {selectedSubmission.userName}</span>
                                <span className="flex items-center gap-1"><i className="far fa-envelope"></i> {selectedSubmission.userEmail}</span>
                                <span className="flex items-center gap-1"><i className="fas fa-phone"></i> {selectedSubmission.userPhone}</span>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                            <div className="relative">
                                <select 
                                    value={selectedSubmission.status || ProjectStatus.NOT_STARTED}
                                    onChange={(e) => handleStatusChange(selectedSubmission.id, e.target.value as ProjectStatus)}
                                    className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none cursor-pointer hover:bg-slate-50"
                                >
                                    {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none"></i>
                            </div>

                            <button 
                                type="button"
                                onClick={() => handleCopyPrompt(selectedSubmission)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 flex items-center gap-2"
                            >
                                <i className="fas fa-robot"></i> Copiar p/ IA
                            </button>

                            <button 
                                type="button"
                                // ADICIONADO 'submissions' tableName explicitamente
                                onClick={(e) => handleDeleteItem(e, selectedSubmission.id, 'submissions', storageService.deleteSubmission, setSubmissions)}
                                className="px-3 py-2 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors border border-red-100"
                                title="Excluir"
                            >
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                        </div>

                        <div className="flex-grow overflow-y-auto p-6 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {REQUIREMENT_FORM_FIELDS.map(field => {
                                const answer = selectedSubmission.answers[field.id];
                                if (!answer) return null;
                                
                                let displayAnswer = answer;
                                if (field.options) {
                                    const opt = field.options.find(o => o.value === answer);
                                    if (opt) displayAnswer = opt.label;
                                }

                                return (
                                    <div key={field.id} className={`${field.type === 'TEXTAREA' ? 'md:col-span-2' : ''}`}>
                                        <label className={labelClass}>{field.label}</label>
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-800 text-sm whitespace-pre-wrap leading-relaxed">
                                            {displayAnswer}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        </div>
                    </>
                    ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-slate-400 p-8">
                        <i className="fas fa-inbox text-5xl mb-4 opacity-20"></i>
                        <p>Selecione um requisito ao lado para ver os detalhes.</p>
                    </div>
                    )}
                </div>
            </div>
            )}

            {/* --- TAB: PORTFOLIO --- */}
            {activeTab === 'portfolio' && (
            <div className="grid lg:grid-cols-3 gap-8 pb-10">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-700">Projetos Cadastrados</h2>
                        <button type="button" onClick={() => setEditingProject({ id: '', title: '', description: '', technologies: '', role: '' })} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow hover:bg-indigo-700 transition"><i className="fas fa-plus mr-1"></i> Novo Projeto</button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        {projects.map(p => (
                            <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative">
                                <ActionButtons 
                                    item={p} 
                                    tableName="projects" // NOME DA TABELA EXPLÍCITO
                                    deleteFn={storageService.deleteProject} 
                                    setListFn={setProjects} 
                                    editFn={setEditingProject} 
                                    handleDeleteItem={handleDeleteItem} 
                                />
                                
                                <div className="h-32 bg-slate-100 rounded-xl mb-4 overflow-hidden relative">
                                    {p.imageUrl ? <img src={p.imageUrl} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><i className="fas fa-image text-3xl"></i></div>}
                                </div>
                                <h4 className="font-bold text-slate-900 mb-1">{p.title}</h4>
                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{p.role}</span>
                                <p className="text-sm text-slate-500 mt-2 line-clamp-2">{p.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {editingProject && (
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl sticky top-4">
                            <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-800">{editingProject.id ? 'Editar Projeto' : 'Novo Projeto'}</h3>
                            <button type="button" onClick={() => setEditingProject(null)} className="text-slate-400 hover:text-slate-600"><i className="fas fa-times"></i></button>
                            </div>
                            <div className="space-y-4">
                            <input className={inputClass} placeholder="Título do Projeto" value={editingProject.title} onChange={e => handleInputChange(setEditingProject, editingProject, 'title', e.target.value)} />
                            <textarea className={inputClass} placeholder="Descrição curta" rows={3} value={editingProject.description} onChange={e => handleInputChange(setEditingProject, editingProject, 'description', e.target.value)} />
                            <input className={inputClass} placeholder="Tecnologias (ex: React, Node)" value={editingProject.technologies} onChange={e => handleInputChange(setEditingProject, editingProject, 'technologies', e.target.value)} />
                            <input className={inputClass} placeholder="Seu Papel (Ex: Tech Lead)" value={editingProject.role || ''} onChange={e => handleInputChange(setEditingProject, editingProject, 'role', e.target.value)} />
                            <input className={inputClass} placeholder="URL da Imagem" value={editingProject.imageUrl || ''} onChange={e => handleInputChange(setEditingProject, editingProject, 'imageUrl', e.target.value)} />
                            <div className="grid grid-cols-2 gap-2">
                                <input className={inputClass} placeholder="GitHub URL" value={editingProject.githubUrl || ''} onChange={e => handleInputChange(setEditingProject, editingProject, 'githubUrl', e.target.value)} />
                                <input className={inputClass} placeholder="Demo URL" value={editingProject.liveUrl || ''} onChange={e => handleInputChange(setEditingProject, editingProject, 'liveUrl', e.target.value)} />
                            </div>
                            <button type="button" onClick={() => handleSaveItem(editingProject, storageService.saveProject, 'portfolio', setProjects)} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all">Salvar Projeto</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            )}

            {/* --- TAB: PROFILE --- */}
            {activeTab === 'profile' && profile && (
            <div className="max-w-3xl mx-auto pb-10">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl">
                            <i className="fas fa-user"></i>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Perfil Profissional</h2>
                            <p className="text-slate-500">Informações exibidas na Hero Section da Landing Page.</p>
                        </div>
                    </div>
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div><label className={labelClass}>Nome de Exibição</label><input className={inputClass} value={profile.displayName} onChange={e => handleInputChange(setProfile, profile, 'displayName', e.target.value)} /></div>
                            <div><label className={labelClass}>Título / Headline</label><input className={inputClass} value={profile.headline} onChange={e => handleInputChange(setProfile, profile, 'headline', e.target.value)} /></div>
                        </div>
                        <div><label className={labelClass}>Bio / Resumo</label><textarea className={inputClass} rows={4} value={profile.bio} onChange={e => handleInputChange(setProfile, profile, 'bio', e.target.value)} /></div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div><label className={labelClass}>WhatsApp (apenas números)</label><input className={inputClass} value={profile.whatsapp} onChange={e => handleInputChange(setProfile, profile, 'whatsapp', e.target.value)} /></div>
                            <div className="md:col-span-2"><label className={labelClass}>Email Contato</label><input className={inputClass} value={profile.email} onChange={e => handleInputChange(setProfile, profile, 'email', e.target.value)} /></div>
                        </div>
                        <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all">Salvar Alterações</button>
                    </form>
                </div>
            </div>
            )}

            {/* --- TAB: SERVICES --- */}
            {activeTab === 'services' && (
            <div className="max-w-5xl mx-auto space-y-6 pb-10">
                <button type="button" onClick={() => setServices([...services, { id: `temp_${Date.now()}`, title: 'Novo Serviço', description: '', icon: 'fas fa-star', displayOrder: services.length + 1 }])} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold hover:bg-white hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"><i className="fas fa-plus"></i> Adicionar Serviço</button>
                
                <div className="grid md:grid-cols-2 gap-6">
                    {services.map((svc, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group">
                            <ActionButtons 
                                item={svc} 
                                tableName="services" // NOME DA TABELA EXPLÍCITO
                                deleteFn={storageService.deleteService} 
                                setListFn={setServices} 
                                handleDeleteItem={handleDeleteItem}
                            />
                            <div className="flex gap-4 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-xl text-indigo-600 shrink-0">
                                <i className={svc.icon}></i>
                                </div>
                                <div className="flex-grow space-y-2">
                                <input className={inputClass} placeholder="Título" value={svc.title} onChange={e => { const n = [...services]; n[idx].title = e.target.value; setServices(n); }} />
                                <div className="flex gap-2">
                                    <input className={inputClass} placeholder="Icon Class" value={svc.icon} onChange={e => { const n = [...services]; n[idx].icon = e.target.value; setServices(n); }} />
                                    <input type="number" className={`${inputClass} w-20`} placeholder="#" value={svc.displayOrder} onChange={e => { const n = [...services]; n[idx].displayOrder = parseInt(e.target.value); setServices(n); }} />
                                </div>
                                </div>
                            </div>
                            <textarea className={inputClass} rows={3} placeholder="Descrição" value={svc.description} onChange={e => { const n = [...services]; n[idx].description = e.target.value; setServices(n); }} />
                            <button type="button" onClick={() => handleSaveItem(svc, storageService.saveService, 'services', setServices)} className="mt-2 w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-100">Salvar Alterações</button>
                        </div>
                    ))}
                </div>
            </div>
            )}

            {/* --- TAB: COMPETENCIES --- */}
            {activeTab === 'competencies' && (
                <div className="max-w-5xl mx-auto space-y-6 pb-10">
                    <button type="button" onClick={() => setCompetencies([...competencies, { id: `temp_${Date.now()}`, title: 'Nova Competência', icon: 'fas fa-star', items: [], colorTheme: 'blue', displayOrder: competencies.length + 1 }])} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold hover:bg-white hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"><i className="fas fa-plus"></i> Adicionar Competência</button>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {competencies.map((comp, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group">
                                <ActionButtons 
                                    item={comp} 
                                    tableName="competencies" // NOME DA TABELA EXPLÍCITO
                                    deleteFn={storageService.deleteCompetency} 
                                    setListFn={setCompetencies} 
                                    handleDeleteItem={handleDeleteItem}
                                />

                                <div className="space-y-3 pt-4">
                                    <div>
                                        <label className={labelClass}>Título</label>
                                        <input className={inputClass} placeholder="Título" value={comp.title} onChange={e => { const n = [...competencies]; n[idx].title = e.target.value; setCompetencies(n); }} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Subtítulo</label>
                                        <input className={inputClass} placeholder="Subtítulo opcional" value={comp.subtitle || ''} onChange={e => { const n = [...competencies]; n[idx].subtitle = e.target.value; setCompetencies(n); }} />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className={labelClass}>Cor</label>
                                            <select className={inputClass} value={comp.colorTheme} onChange={e => { const n = [...competencies]; n[idx].colorTheme = e.target.value as any; setCompetencies(n); }}>
                                                <option value="blue">Azul</option><option value="indigo">Indigo</option><option value="cyan">Cyan</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Ícone</label>
                                            <input className={inputClass} placeholder="Icon" value={comp.icon} onChange={e => { const n = [...competencies]; n[idx].icon = e.target.value; setCompetencies(n); }} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className={labelClass}>Itens (separar por vírgula)</label>
                                        <textarea className={inputClass} rows={3} value={comp.items.join(', ')} onChange={e => { const n = [...competencies]; n[idx].items = e.target.value.split(',').map(s=>s.trim()); setCompetencies(n); }} />
                                    </div>
                                    <button type="button" onClick={() => handleSaveItem(comp, storageService.saveCompetency, 'competencies', setCompetencies)} className="mt-2 w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-100">Salvar Alterações</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- TAB: JOURNEY --- */}
            {activeTab === 'journey' && (
                <div className="max-w-5xl mx-auto space-y-6 pb-10">
                    <button type="button" onClick={() => setJourney([...journey, { id: `temp_${Date.now()}`, title: 'Novo Cargo', description: '', type: 'work', displayOrder: journey.length + 1 }])} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold hover:bg-white hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"><i className="fas fa-plus"></i> Adicionar Item na Jornada</button>
                    
                    <div className="space-y-4">
                        {journey.map((item, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 group relative">
                                <div className="absolute top-3 right-3 z-20">
                                   <ActionButtons 
                                    item={item} 
                                    tableName="journey_items" // NOME DA TABELA EXPLÍCITO
                                    deleteFn={storageService.deleteJourneyItem} 
                                    setListFn={setJourney} 
                                    handleDeleteItem={handleDeleteItem}
                                   />
                                </div>
                                <div className="flex flex-col gap-2 items-center justify-center w-12 pt-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${item.type === 'work' ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
                                        <i className={`fas ${item.type === 'work' ? 'fa-briefcase' : 'fa-graduation-cap'}`}></i>
                                    </div>
                                    <div className="h-full w-0.5 bg-slate-100"></div>
                                </div>
                                
                                <div className="flex-grow space-y-3">
                                    <div className="grid md:grid-cols-2 gap-4">
                                    <div><label className={labelClass}>Cargo / Título</label><input className={inputClass} value={item.title} onChange={e => { const n = [...journey]; n[idx].title = e.target.value; setJourney(n); }} /></div>
                                    <div><label className={labelClass}>Empresa</label><input className={inputClass} value={item.company || ''} onChange={e => { const n = [...journey]; n[idx].company = e.target.value; setJourney(n); }} /></div>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <div className="w-1/3"><label className={labelClass}>Tipo</label>
                                        <select className={inputClass} value={item.type} onChange={e => { const n = [...journey]; n[idx].type = e.target.value as any; setJourney(n); }}>
                                            <option value="work">Trabalho</option><option value="education">Educação</option>
                                        </select>
                                        </div>
                                        <div className="w-2/3"><label className={labelClass}>Período</label><input className={inputClass} placeholder="Ex: 2020 - 2023" value={item.period || ''} onChange={e => { const n = [...journey]; n[idx].period = e.target.value; setJourney(n); }} /></div>
                                    </div>
                                    <div><label className={labelClass}>Descrição</label><textarea className={inputClass} rows={2} value={item.description} onChange={e => { const n = [...journey]; n[idx].description = e.target.value; setJourney(n); }} /></div>
                                    <button type="button" onClick={() => handleSaveItem(item, storageService.saveJourneyItem, 'journey', setJourney)} className="mt-2 w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-100">Salvar Alterações</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Modal de Confirmação Customizado */}
        {deleteModal.isOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-200">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-500 text-xl mb-4 mx-auto">
                        <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 text-center mb-2">Excluir Item?</h3>
                    <p className="text-slate-500 text-center mb-6 text-sm">
                        Você tem certeza que deseja excluir este item de <strong>{deleteModal.tableName}</strong>? Esta ação não pode ser desfeita.
                    </p>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                            className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={confirmDelete}
                            className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                        >
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Toast Notification */}
        {notification && (
          <div className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 text-white animate-in slide-in-from-bottom-5 ${notification.type === 'success' ? 'bg-emerald-600' : 'bg-red-500'}`}>
             <i className={`fas ${notification.type === 'success' ? 'fa-check' : 'fa-exclamation'}`}></i>
             <p className="font-bold">{notification.message}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;