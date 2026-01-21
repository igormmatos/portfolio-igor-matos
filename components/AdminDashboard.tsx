import React, { useState, useEffect, useRef } from 'react';
import { storageService } from '../services/storage';
import { FormSubmission, ProjectStatus, PortfolioProject, ProfileInfo, ServiceItem, CompetencyItem, JourneyItem } from '../types';
import { REQUIREMENT_FORM_FIELDS } from '../constants';
import { getOptimizedImageUrl } from '../utils/image';

// --- TYPES & INTERFACES ---

type AdminTab = 'submissions' | 'portfolio' | 'profile' | 'services' | 'competencies' | 'journey';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  isSaving?: boolean;
}

// --- REUSABLE COMPONENTS ---

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children, onSave, isSaving }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      {/* Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {children}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <button 
            onClick={onSave} 
            disabled={isSaving}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-check"></i>}
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status?: string }) => {
    let colorClass = 'bg-slate-100 text-slate-600 border-slate-200';
    let icon = 'fa-circle';
    
    switch (status) {
      case ProjectStatus.STARTED: 
        colorClass = 'bg-blue-50 text-blue-600 border-blue-100'; 
        icon = 'fa-play';
        break;
      case ProjectStatus.NEEDS_ADJUSTMENTS: 
        colorClass = 'bg-orange-50 text-orange-600 border-orange-100'; 
        icon = 'fa-exclamation-circle';
        break;
      case ProjectStatus.FINISHED: 
        colorClass = 'bg-emerald-50 text-emerald-600 border-emerald-100'; 
        icon = 'fa-check-circle';
        break;
    }
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 w-fit ${colorClass}`}>
            <i className={`fas ${icon} text-[10px]`}></i>
            {status || 'Novo'}
        </span>
    );
};

const EmptyState = ({ title, message, action }: { title: string, message: string, action?: () => void }) => (
    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300 text-3xl">
            <i className="fas fa-inbox"></i>
        </div>
        <h3 className="text-lg font-bold text-slate-700 mb-1">{title}</h3>
        <p className="text-slate-500 max-w-xs mx-auto mb-6">{message}</p>
        {action && (
            <button onClick={action} className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm">
                Criar Novo Item
            </button>
        )}
    </div>
);

// --- MAIN COMPONENT ---

const AdminDashboard: React.FC = () => {
  // Navigation & Layout State
  const [activeTab, setActiveTab] = useState<AdminTab>('submissions');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [tabLoading, setTabLoading] = useState(false);
  const loadedTabs = useRef<Set<string>>(new Set());

  // Data State
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [competencies, setCompetencies] = useState<CompetencyItem[]>([]);
  const [journey, setJourney] = useState<JourneyItem[]>([]);

  // Interaction State
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  // Drawer/Edit State (Generic to handle all types)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [savingItem, setSavingItem] = useState(false);
  
  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string;
    tableName: string;
    deleteFn: ((id: string) => Promise<void>) | null;
    setListFn: any | null;
  }>({ isOpen: false, id: '', tableName: '', deleteFn: null, setListFn: null });

  // --- INITIALIZATION ---

  useEffect(() => {
    loadTabData(activeTab);
  }, [activeTab]);

  const loadTabData = async (tab: AdminTab, force = false) => {
    if (!force && loadedTabs.current.has(tab)) return;
    setTabLoading(true);
    try {
      switch (tab) {
        case 'submissions': setSubmissions(await storageService.getSubmissions()); break;
        case 'portfolio': setProjects(await storageService.getProjects()); break;
        case 'profile': setProfile(await storageService.getProfileInfo()); break;
        case 'services': setServices(await storageService.getServices()); break;
        case 'competencies': setCompetencies(await storageService.getCompetencies()); break;
        case 'journey': setJourney(await storageService.getJourney()); break;
      }
      loadedTabs.current.add(tab);
    } catch (error) {
      console.error(error);
      showNotification('Erro ao carregar dados.', 'error');
    } finally {
      setTabLoading(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // --- ACTIONS HANDLERS ---

  const handleCreateNew = () => {
    const timestamp = Date.now();
    let newItem: any = { id: `temp_${timestamp}` }; // ID temporário

    switch(activeTab) {
        case 'portfolio': 
            newItem = { ...newItem, title: '', description: '', technologies: '', role: '', imageUrl: '' }; 
            break;
        case 'services': 
            newItem = { ...newItem, title: '', description: '', icon: 'fas fa-star', displayOrder: services.length + 1 }; 
            break;
        case 'competencies': 
            newItem = { ...newItem, title: '', items: [], icon: 'fas fa-star', colorTheme: 'blue', displayOrder: competencies.length + 1 }; 
            break;
        case 'journey': 
            newItem = { ...newItem, title: '', type: 'work', displayOrder: journey.length + 1, description: '' }; 
            break;
    }
    setEditingItem(newItem);
    setIsDrawerOpen(true);
  };

  const handleEdit = (item: any) => {
    // Clone profundo simples para evitar mutação direta
    setEditingItem(JSON.parse(JSON.stringify(item)));
    setIsDrawerOpen(true);
  };

  const handleDeleteRequest = (e: React.MouseEvent, id: string, tableName: string, deleteFn: any, setListFn: any) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, id, tableName, deleteFn, setListFn });
  };

  const confirmDelete = async () => {
    const { id, deleteFn, setListFn } = deleteModal;
    if (!id || !deleteFn) return;
    try {
        setListFn((prev: any[]) => prev.filter(i => i.id !== id));
        if (!id.toString().startsWith('temp_')) await deleteFn(id);
        showNotification('Item excluído.', 'success');
        if (activeTab === 'submissions' && selectedSubId === id) setSelectedSubId(null);
    } catch (e) {
        showNotification('Erro ao excluir item.', 'error');
        // O ideal seria recarregar os dados aqui para reverter o estado otimista em caso de erro
    } finally {
        setDeleteModal({ isOpen: false, id: '', tableName: '', deleteFn: null, setListFn: null });
    }
  };

  const handleSaveDrawer = async () => {
    if (!editingItem) return;
    setSavingItem(true);
    try {
        let savedResult;
        let setListFn: any;

        switch(activeTab) {
            case 'portfolio':
                savedResult = await storageService.saveProject(editingItem);
                setListFn = setProjects;
                break;
            case 'services':
                savedResult = await storageService.saveService(editingItem);
                setListFn = setServices;
                break;
            case 'competencies':
                savedResult = await storageService.saveCompetency(editingItem);
                setListFn = setCompetencies;
                break;
            case 'journey':
                savedResult = await storageService.saveJourneyItem(editingItem);
                setListFn = setJourney;
                break;
        }

        if (setListFn && savedResult) {
            setListFn((prev: any[]) => {
                const idx = prev.findIndex(i => i.id === editingItem.id);
                if (idx >= 0) {
                    const newList = [...prev];
                    newList[idx] = savedResult;
                    return newList;
                }
                return [...prev, savedResult];
            });
            showNotification('Salvo com sucesso!', 'success');
            setIsDrawerOpen(false);
            setEditingItem(null);
        }
    } catch (e: any) {
        showNotification(e.message || 'Erro ao salvar.', 'error');
    } finally {
        setSavingItem(false);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setEditingItem((prev: any) => ({ ...prev, [field]: value }));
  };

  // --- SUBMISSIONS HELPERS ---
  const handleStatusChange = async (id: string, newStatus: ProjectStatus) => {
    try {
        await storageService.updateSubmissionStatus(id, newStatus);
        setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
        showNotification('Status atualizado.');
    } catch (e) { showNotification('Erro ao atualizar status.', 'error'); }
  };

  const handleCopyPrompt = (submission: FormSubmission) => {
    let text = `📋 **PROMPT PARA IA - Requisitos de ${submission.userName}**\n\n`;
    REQUIREMENT_FORM_FIELDS.forEach(field => {
      const answer = submission.answers[field.id];
      if (answer) {
        const display = field.options?.find(o => o.value === answer)?.label || answer;
        text += `**${field.label}**\n${display}\n\n`;
      }
    });
    navigator.clipboard.writeText(text);
    showNotification('Prompt copiado!');
  };

  // --- STYLES ---
  const inputClass = "w-full border border-slate-200 rounded-lg p-3 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all hover:border-slate-300";
  const labelClass = "text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block";

  const selectedSubmission = submissions.find(s => s.id === selectedSubId);

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className={`fixed md:relative top-0 h-full w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform z-40 shrink-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 shadow-xl`}>
        <div className="p-6 h-20 flex items-center justify-between shrink-0 border-b border-slate-800">
           <span className="text-white font-bold text-lg tracking-tight flex items-center gap-2">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white"><i className="fas fa-terminal text-sm"></i></div>
             Admin
           </span>
           <button className="md:hidden text-slate-400" onClick={() => setSidebarOpen(false)}><i className="fas fa-times"></i></button>
        </div>
        
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          {[
            { id: 'submissions', icon: 'fa-inbox', label: 'Requisitos' },
            { id: 'portfolio', icon: 'fa-briefcase', label: 'Portfólio' },
            { id: 'services', icon: 'fa-layer-group', label: 'Serviços' },
            { id: 'competencies', icon: 'fa-star', label: 'Competências' },
            { id: 'journey', icon: 'fa-road', label: 'Jornada' },
            { id: 'profile', icon: 'fa-user-circle', label: 'Perfil' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as AdminTab); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <i className={`fas ${tab.icon} w-5 text-center opacity-80`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-800 shrink-0">
           <button onClick={() => window.location.reload()} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <i className="fas fa-sign-out-alt"></i> Sair do Sistema
           </button>
        </div>
      </aside>

      {/* CONTENT WRAPPER */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>}

        {/* HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-20">
           <div className="flex items-center gap-4">
              <button className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg" onClick={() => setSidebarOpen(true)}><i className="fas fa-bars text-xl"></i></button>
              <h1 className="text-xl md:text-2xl font-bold text-slate-800 capitalize">
                {activeTab === 'submissions' ? 'Gestão de Requisitos' : activeTab}
              </h1>
              {tabLoading && <i className="fas fa-circle-notch fa-spin text-indigo-600 ml-2"></i>}
           </div>

           {/* PRIMARY ACTION BUTTON (Except Submissions/Profile) */}
           {activeTab !== 'submissions' && activeTab !== 'profile' && (
               <button 
                 onClick={handleCreateNew}
                 className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center gap-2 text-sm"
               >
                 <i className="fas fa-plus"></i>
                 <span className="hidden sm:inline">Adicionar Novo</span>
               </button>
           )}
        </header>

        {/* SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-8">
            
            {/* --- TAB: SUBMISSIONS --- */}
            {activeTab === 'submissions' && (
                <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[500px]">
                    {/* List Panel */}
                    <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{submissions.length} Solicitações</span>
                        </div>
                        <div className="flex-grow overflow-y-auto">
                            {submissions.length === 0 && <div className="p-8 text-center text-slate-400">Nenhum requisito recebido.</div>}
                            {submissions.map(sub => (
                                <div 
                                    key={sub.id} 
                                    onClick={() => setSelectedSubId(sub.id)} 
                                    className={`p-4 border-b border-slate-100 cursor-pointer transition-all hover:bg-slate-50 relative group ${selectedSubId === sub.id ? 'bg-indigo-50/60 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'}`}
                                >
                                    <div className="flex justify-between items-start mb-1.5">
                                        <h4 className={`text-sm font-bold truncate pr-2 ${selectedSubId === sub.id ? 'text-indigo-900' : 'text-slate-700'}`}>{sub.answers.projectName || 'Projeto sem nome'}</h4>
                                        <StatusBadge status={sub.status} />
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                        <span>{sub.userName}</span>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                        <span>{new Date(sub.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-sm rounded-lg border border-slate-100">
                                         <button onClick={(e) => handleDeleteRequest(e, sub.id, 'submissions', storageService.deleteSubmission, setSubmissions)} className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg"><i className="fas fa-trash text-xs"></i></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detail Panel */}
                    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative">
                        {selectedSubmission ? (
                            <>
                                <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-800 mb-1">{selectedSubmission.answers.projectName}</h2>
                                        <div className="flex items-center gap-4 text-sm text-slate-500">
                                            <a href={`mailto:${selectedSubmission.userEmail}`} className="hover:text-indigo-600 flex items-center gap-1"><i className="far fa-envelope"></i> {selectedSubmission.userEmail}</a>
                                            <a href={`https://wa.me/${selectedSubmission.userPhone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="hover:text-green-600 flex items-center gap-1"><i className="fab fa-whatsapp"></i> {selectedSubmission.userPhone}</a>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <select 
                                            value={selectedSubmission.status || ProjectStatus.NOT_STARTED} 
                                            onChange={(e) => handleStatusChange(selectedSubmission.id, e.target.value as ProjectStatus)}
                                            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none font-medium shadow-sm"
                                        >
                                            {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <button onClick={() => handleCopyPrompt(selectedSubmission)} className="px-4 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition shadow-lg flex items-center gap-2"><i className="fas fa-robot"></i> Copiar Prompt</button>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                                        {REQUIREMENT_FORM_FIELDS.map(field => {
                                            const ans = selectedSubmission.answers[field.id];
                                            if (!ans) return null;
                                            const display = field.options?.find(o => o.value === ans)?.label || ans;
                                            return (
                                                <div key={field.id} className={field.type === 'TEXTAREA' ? 'md:col-span-2' : ''}>
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">{field.label}</label>
                                                    <div className="text-slate-800 text-base leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-100">{display}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                                <i className="fas fa-mouse-pointer text-4xl mb-4 opacity-20"></i>
                                <p>Selecione um item para ver detalhes</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- TAB: PORTFOLIO --- */}
            {activeTab === 'portfolio' && (
                <>
                    {projects.length === 0 ? <EmptyState title="Nenhum Projeto" message="Adicione projetos ao seu portfólio para mostrar seu trabalho." action={handleCreateNew} /> : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map(project => (
                                <div key={project.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col h-full">
                                    <div className="h-48 bg-slate-100 relative overflow-hidden">
                                        {project.imageUrl ? <img src={getOptimizedImageUrl(project.imageUrl, 400)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={project.title} /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><i className="fas fa-image text-3xl"></i></div>}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                            <button onClick={() => handleEdit(project)} className="w-10 h-10 bg-white rounded-full text-indigo-600 flex items-center justify-center hover:scale-110 transition-transform shadow-lg"><i className="fas fa-pen"></i></button>
                                            <button onClick={(e) => handleDeleteRequest(e, project.id, 'projects', storageService.deleteProject, setProjects)} className="w-10 h-10 bg-white rounded-full text-red-500 flex items-center justify-center hover:scale-110 transition-transform shadow-lg"><i className="fas fa-trash"></i></button>
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="font-bold text-lg text-slate-800 mb-1">{project.title}</h3>
                                        <span className="text-xs font-bold text-indigo-500 uppercase tracking-wide mb-3 block">{project.role}</span>
                                        <p className="text-sm text-slate-500 line-clamp-3 mb-4 flex-grow">{project.description}</p>
                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            {project.technologies.split(',').slice(0, 3).map((t, i) => <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">{t.trim()}</span>)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* --- TAB: SERVICES, COMPETENCIES, JOURNEY (Generic Card View) --- */}
            {(['services', 'competencies', 'journey'].includes(activeTab)) && (
                <>
                 {((activeTab === 'services' && services.length === 0) || (activeTab === 'competencies' && competencies.length === 0) || (activeTab === 'journey' && journey.length === 0)) ? (
                    <EmptyState title={`Sem dados em ${activeTab}`} message="Comece adicionando novos itens para preencher esta seção." action={handleCreateNew} />
                 ) : (
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {/* Generic Mapper based on Active Tab */}
                        {(activeTab === 'services' ? services : activeTab === 'competencies' ? competencies : journey).map((item: any) => (
                            <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all group relative">
                                {/* Actions Top Right */}
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(item)} className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center"><i className="fas fa-pen text-xs"></i></button>
                                    <button onClick={(e) => handleDeleteRequest(e, item.id, activeTab === 'journey' ? 'journey_items' : activeTab, activeTab === 'services' ? storageService.deleteService : activeTab === 'competencies' ? storageService.deleteCompetency : storageService.deleteJourneyItem, activeTab === 'services' ? setServices : activeTab === 'competencies' ? setCompetencies : setJourney)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center"><i className="fas fa-trash text-xs"></i></button>
                                </div>

                                <div className="flex items-center gap-4 mb-4">
                                    {/* Icon / Avatar Logic */}
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${activeTab === 'journey' ? (item.type === 'work' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600') : 'bg-slate-100 text-slate-600'}`}>
                                        <i className={item.icon || (activeTab === 'journey' ? (item.type === 'work' ? 'fas fa-briefcase' : 'fas fa-graduation-cap') : 'fas fa-star')}></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{item.title}</h3>
                                        {activeTab === 'competencies' && item.subtitle && <p className="text-xs text-slate-400">{item.subtitle}</p>}
                                        {activeTab === 'journey' && <p className="text-xs text-slate-400">{item.company} • {item.period}</p>}
                                    </div>
                                </div>
                                
                                {activeTab === 'competencies' ? (
                                    <div className="flex flex-wrap gap-1.5">
                                        {item.items?.slice(0,5).map((t: string, i: number) => <span key={i} className="text-xs bg-slate-50 text-slate-500 px-2 py-1 rounded border border-slate-100">{t}</span>)}
                                        {item.items?.length > 5 && <span className="text-xs text-slate-400 px-2 py-1">+{item.items.length - 5}</span>}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 line-clamp-3">{item.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                 )}
                </>
            )}

            {/* --- TAB: PROFILE --- */}
            {activeTab === 'profile' && profile && (
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-8 border-b border-slate-100">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xl"><i className="fas fa-id-card"></i></div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">Perfil Profissional</h2>
                                    <p className="text-sm text-slate-500">Dados exibidos na Hero Section da Landing Page.</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 space-y-6">
                             <div className="grid md:grid-cols-2 gap-6">
                                <div><label className={labelClass}>Nome de Exibição</label><input className={inputClass} value={profile.displayName} onChange={e => setProfile({...profile, displayName: e.target.value})} /></div>
                                <div><label className={labelClass}>Cargo / Headline</label><input className={inputClass} value={profile.headline} onChange={e => setProfile({...profile, headline: e.target.value})} /></div>
                            </div>
                            <div><label className={labelClass}>Bio / Resumo Profissional</label><textarea className={inputClass} rows={4} value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} /></div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div><label className={labelClass}>Email de Contato</label><input className={inputClass} value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} /></div>
                                <div><label className={labelClass}>WhatsApp (Apenas números)</label><input className={inputClass} value={profile.whatsapp} onChange={e => setProfile({...profile, whatsapp: e.target.value})} /></div>
                                <div className="md:col-span-2"><label className={labelClass}>LinkedIn URL</label><input className={inputClass} value={profile.linkedinUrl || ''} onChange={e => setProfile({...profile, linkedinUrl: e.target.value})} /></div>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
                            <button onClick={async () => {
                                try { await storageService.saveProfileInfo(profile); showNotification('Perfil salvo!'); } catch(e) { showNotification('Erro ao salvar.', 'error'); }
                            }} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all">Salvar Alterações</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </main>

      {/* --- DRAWERS (FORMS) --- */}
      <Drawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        title={editingItem?.id?.toString().startsWith('temp_') ? 'Criar Novo' : 'Editar Item'}
        onSave={handleSaveDrawer}
        isSaving={savingItem}
      >
        {editingItem && (
            <div className="space-y-5">
                {activeTab === 'portfolio' && (
                    <>
                        <div><label className={labelClass}>Título do Projeto</label><input className={inputClass} value={editingItem.title} onChange={e => handleFieldChange('title', e.target.value)} autoFocus /></div>
                        <div><label className={labelClass}>Seu Papel (Ex: Tech Lead)</label><input className={inputClass} value={editingItem.role} onChange={e => handleFieldChange('role', e.target.value)} /></div>
                        <div><label className={labelClass}>Descrição</label><textarea className={inputClass} rows={4} value={editingItem.description} onChange={e => handleFieldChange('description', e.target.value)} /></div>
                        <div><label className={labelClass}>Tecnologias (Separadas por vírgula)</label><input className={inputClass} value={editingItem.technologies} onChange={e => handleFieldChange('technologies', e.target.value)} /></div>
                        <div><label className={labelClass}>URL da Imagem</label><input className={inputClass} value={editingItem.imageUrl} onChange={e => handleFieldChange('imageUrl', e.target.value)} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className={labelClass}>GitHub URL</label><input className={inputClass} value={editingItem.githubUrl || ''} onChange={e => handleFieldChange('githubUrl', e.target.value)} /></div>
                            <div><label className={labelClass}>Live Demo URL</label><input className={inputClass} value={editingItem.liveUrl || ''} onChange={e => handleFieldChange('liveUrl', e.target.value)} /></div>
                        </div>
                    </>
                )}
                {activeTab === 'services' && (
                    <>
                        <div><label className={labelClass}>Título do Serviço</label><input className={inputClass} value={editingItem.title} onChange={e => handleFieldChange('title', e.target.value)} autoFocus /></div>
                        <div><label className={labelClass}>Ícone (FontAwesome Class)</label><input className={inputClass} value={editingItem.icon} onChange={e => handleFieldChange('icon', e.target.value)} /></div>
                        <div><label className={labelClass}>Descrição</label><textarea className={inputClass} rows={4} value={editingItem.description} onChange={e => handleFieldChange('description', e.target.value)} /></div>
                        <div><label className={labelClass}>Ordem de Exibição</label><input type="number" className={inputClass} value={editingItem.displayOrder} onChange={e => handleFieldChange('displayOrder', parseInt(e.target.value))} /></div>
                    </>
                )}
                {activeTab === 'competencies' && (
                    <>
                        <div><label className={labelClass}>Título</label><input className={inputClass} value={editingItem.title} onChange={e => handleFieldChange('title', e.target.value)} autoFocus /></div>
                        <div><label className={labelClass}>Subtítulo (Opcional)</label><input className={inputClass} value={editingItem.subtitle || ''} onChange={e => handleFieldChange('subtitle', e.target.value)} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className={labelClass}>Ícone</label><input className={inputClass} value={editingItem.icon} onChange={e => handleFieldChange('icon', e.target.value)} /></div>
                            <div><label className={labelClass}>Cor do Tema</label>
                                <select className={inputClass} value={editingItem.colorTheme} onChange={e => handleFieldChange('colorTheme', e.target.value)}>
                                    <option value="blue">Azul</option><option value="indigo">Indigo</option><option value="cyan">Cyan</option>
                                </select>
                            </div>
                        </div>
                        <div><label className={labelClass}>Itens (Separados por vírgula)</label><textarea className={inputClass} rows={4} value={Array.isArray(editingItem.items) ? editingItem.items.join(', ') : editingItem.items} onChange={e => handleFieldChange('items', e.target.value.split(',').map((i: string) => i.trim()))} /></div>
                        <div><label className={labelClass}>Ordem</label><input type="number" className={inputClass} value={editingItem.displayOrder} onChange={e => handleFieldChange('displayOrder', parseInt(e.target.value))} /></div>
                    </>
                )}
                {activeTab === 'journey' && (
                    <>
                         <div><label className={labelClass}>Cargo / Título</label><input className={inputClass} value={editingItem.title} onChange={e => handleFieldChange('title', e.target.value)} autoFocus /></div>
                         <div><label className={labelClass}>Empresa / Instituição</label><input className={inputClass} value={editingItem.company} onChange={e => handleFieldChange('company', e.target.value)} /></div>
                         <div className="grid grid-cols-2 gap-4">
                            <div><label className={labelClass}>Tipo</label>
                                <select className={inputClass} value={editingItem.type} onChange={e => handleFieldChange('type', e.target.value)}>
                                    <option value="work">Trabalho</option><option value="education">Educação</option>
                                </select>
                            </div>
                            <div><label className={labelClass}>Período</label><input className={inputClass} value={editingItem.period} onChange={e => handleFieldChange('period', e.target.value)} placeholder="Ex: 2020 - 2023" /></div>
                         </div>
                         <div><label className={labelClass}>Descrição</label><textarea className={inputClass} rows={4} value={editingItem.description} onChange={e => handleFieldChange('description', e.target.value)} /></div>
                         <div><label className={labelClass}>Ordem</label><input type="number" className={inputClass} value={editingItem.displayOrder} onChange={e => handleFieldChange('displayOrder', parseInt(e.target.value))} /></div>
                    </>
                )}
            </div>
        )}
      </Drawer>

      {/* --- CONFIRM DELETE MODAL --- */}
      {deleteModal.isOpen && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
                <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl"><i className="fas fa-trash-alt"></i></div>
                <h3 className="text-xl font-bold text-center text-slate-800 mb-2">Excluir Item?</h3>
                <p className="text-center text-slate-500 mb-6 text-sm">Tem certeza? Esta ação é irreversível.</p>
                <div className="flex gap-3">
                    <button onClick={() => setDeleteModal({...deleteModal, isOpen: false})} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">Cancelar</button>
                    <button onClick={confirmDelete} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-colors">Sim, Excluir</button>
                </div>
            </div>
         </div>
      )}

      {/* --- NOTIFICATIONS --- */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-[70] px-6 py-4 rounded-xl shadow-2xl text-white font-bold flex items-center gap-3 animate-in slide-in-from-bottom-5 ${notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
            <i className={`fas ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {notification.message}
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;