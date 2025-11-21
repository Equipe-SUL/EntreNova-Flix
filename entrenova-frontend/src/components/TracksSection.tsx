// TracksSection.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

// 1. Interface de dados para a tabela 'conteudos'
interface Conteudo {
    id: number;
    modelo: string;
    categoria: string;
    descricao: string;
    duracao: string;
    tags: string;
}

const TracksSection: React.FC = () => {
    const [conteudos, setConteudos] = useState<Conteudo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingConteudo, setEditingConteudo] = useState<Conteudo | null>(null);

    // Dados do formulário
    const [formData, setFormData] = useState({
        modelo: '', categoria: '', descricao: '', duracao: '', tags: ''
    });

    // --- FUNÇÕES DE BUSCA (READ) ---
    const fetchConteudos = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('conteudos')
                .select('*')
                .order('id', { ascending: true });

            if (error) throw error;
            setConteudos(data as Conteudo[]);
        } catch (err) {
            setError(`Erro ao carregar trilhas: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConteudos();
    }, []);

    // --- FUNÇÕES DE FORMULÁRIO ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openCreateModal = () => {
        setEditingConteudo(null);
        setFormData({ modelo: '', categoria: '', descricao: '', duracao: '', tags: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (conteudo: Conteudo) => {
        setEditingConteudo(conteudo);
        setFormData({
            modelo: conteudo.modelo,
            categoria: conteudo.categoria,
            descricao: conteudo.descricao,
            duracao: conteudo.duracao,
            tags: conteudo.tags
        });
        setIsModalOpen(true);
    };

    // --- FUNÇÕES CRUD ---

    // CREATE / UPDATE
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = { ...formData };
        
        try {
            if (editingConteudo) {
                // UPDATE
                const { error } = await supabase
                    .from('conteudos')
                    .update(payload)
                    .eq('id', editingConteudo.id);

                if (error) throw error;
            } else {
                // CREATE
                const { error } = await supabase
                    .from('conteudos')
                    .insert([payload]);

                if (error) throw error;
            }
            
            setIsModalOpen(false);
            await fetchConteudos(); // Atualiza a lista
        } catch (err) {
            setError(`Erro ao salvar: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setLoading(false);
        }
    };

    // DELETE
    const handleDelete = async (id: number) => {
        if (!window.confirm("Tem certeza que deseja apagar esta trilha?")) return;
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase
                .from('conteudos')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchConteudos(); // Atualiza a lista
        } catch (err) {
            setError(`Erro ao apagar: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setLoading(false);
        }
    };

    // --- RENDERIZAÇÃO (ESTILOS ATUALIZADOS) ---
    
    const containerStyle = { padding: '20px 0', color: 'white' };
    
    // Modal Styles
    const modalOverlayStyle = { 
        position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0, 
        backgroundColor: 'rgba(0,0,0,0.8)', // Mais escuro
        backdropFilter: 'blur(5px)', // Efeito de desfoque no fundo
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 
    };
    
    const modalContentStyle = { 
        backgroundColor: '#1a1a1a', // Fundo Dark Padrão
        border: '1px solid #333',
        padding: '30px', 
        borderRadius: '12px', 
        width: '450px', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)', 
        color: 'white' 
    };

    // Input Styles
    const labelStyle = { display: 'block', marginBottom: '5px', color: '#ccc', fontSize: '0.9rem' };
    
    const inputStyle = { 
        width: '100%', 
        padding: '12px', 
        margin: '0 0 15px 0', 
        boxSizing: 'border-box' as const, 
        border: '1px solid #333', 
        borderRadius: '6px',
        backgroundColor: '#222', // Input escuro
        color: 'white',
        outline: 'none',
        fontFamily: 'inherit'
    };

    // Botões Gerais
    const btnBaseStyle = { 
        padding: '10px 20px', 
        border: 'none', 
        borderRadius: '6px', 
        cursor: 'pointer', 
        fontWeight: '600',
        fontFamily: 'inherit',
        transition: 'all 0.3s ease'
    };

    const renderFormModal = () => (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <h3 style={{ marginTop: 0, color: '#fff', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                    {editingConteudo ? 'Editar Trilha' : 'Adicionar Nova Trilha'}
                </h3>
                <form onSubmit={handleSubmit}>
                    <label style={labelStyle}>Modelo (Ex: **Vídeo**):</label>
                    <input name="modelo" value={formData.modelo} onChange={handleInputChange} style={inputStyle} required />
                    
                    <label style={labelStyle}>Categoria:</label>
                    <input name="categoria" value={formData.categoria} onChange={handleInputChange} style={inputStyle} required />

                    <label style={labelStyle}>Duração:</label>
                    <input name="duracao" value={formData.duracao} onChange={handleInputChange} style={inputStyle} placeholder="Ex: 3h 20m" required />

                    <label style={labelStyle}>Tags:</label>
                    <input name="tags" value={formData.tags} onChange={handleInputChange} style={inputStyle} placeholder="Separadas por vírgula" />

                    <label style={labelStyle}>Descrição:</label>
                    <textarea name="descricao" value={formData.descricao} onChange={handleInputChange} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' as const }} required />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                         <button type="button" onClick={() => setIsModalOpen(false)} style={{ ...btnBaseStyle, backgroundColor: 'transparent', border: '1px solid #555', color: '#ccc' }}>
                            Cancelar
                        </button>
                        <button type="submit" style={{ ...btnBaseStyle, backgroundColor: '#ff007f', color: 'white', boxShadow: '0 0 10px rgba(255, 0, 127, 0.3)' }} disabled={loading}>
                            {loading ? 'Salvando...' : 'Salvar Trilha'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    if (error) return <p style={{ padding: '20px 0', color: '#ff6b6b' }}>{error}</p>;

    return (
        <div style={containerStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, color: '#ccc', fontWeight: 400 }}>Gerenciar Trilhas (CRUD)</h3>
                
                {/* BOTÃO ADICIONAR - ROSA NEON */}
                <button 
                    onClick={openCreateModal} 
                    style={{ 
                        ...btnBaseStyle, 
                        backgroundColor: '#ff007f', 
                        color: 'white', 
                        borderRadius: '25px',
                        padding: '12px 25px',
                        boxShadow: '0 0 15px rgba(255, 0, 127, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }} 
                    disabled={loading}
                >
                    <span style={{ fontSize: '1.2rem', lineHeight: 0 }}>+</span> Adicionar Nova Trilha
                </button>
            </div>

            {loading && !conteudos.length ? <p style={{ color: '#aaa' }}>Carregando trilhas...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {conteudos.map(c => (
                        // CARD ESTILIZADO
                        <div key={c.id} style={{ 
                            border: '1px solid #333', 
                            padding: '25px', 
                            borderRadius: '12px', 
                            backgroundColor: '#1a1a1a', 
                            color: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            minHeight: '200px',
                            transition: 'transform 0.2s',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                        }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                    <span style={{ 
                                        backgroundColor: '#333', color: '#ff007f', padding: '4px 10px', 
                                        borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', border: '1px solid #ff007f' 
                                    }}>
                                        {c.modelo}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: '#888' }}>{c.duracao}</span>
                                </div>
                                
                                <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', lineHeight: '1.4' }}>
                                    {c.descricao.length > 60 ? c.descricao.substring(0, 60) + '...' : c.descricao}
                                </h4>
                                
                                <p style={{ margin: '0 0 20px 0', fontSize: '0.9rem', color: '#aaa' }}>
                                    {c.categoria}
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                                {/* BOTÃO EDITAR (Ghost Pink) */}
                                <button 
                                    onClick={() => openEditModal(c)} 
                                    style={{ 
                                        ...btnBaseStyle, 
                                        backgroundColor: 'transparent', 
                                        border: '1px solid #ff007f', 
                                        color: '#ff007f', 
                                        padding: '8px 0',
                                        flex: 1 
                                    }}
                                >
                                    Editar
                                </button>
                                
                                {/* BOTÃO APAGAR (Ghost Gray/Red Hover logic placeholder) */}
                                <button 
                                    onClick={() => handleDelete(c.id)} 
                                    style={{ 
                                        ...btnBaseStyle, 
                                        backgroundColor: 'transparent', 
                                        border: '1px solid #444', 
                                        color: '#aaa', 
                                        padding: '8px 0',
                                        flex: 1 
                                    }}
                                >
                                    Apagar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && renderFormModal()}
        </div>
    );
};

export default TracksSection;