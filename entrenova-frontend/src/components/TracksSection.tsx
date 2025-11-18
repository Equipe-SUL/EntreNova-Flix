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

    // --- RENDERIZAÇÃO ---
    
    // Estilo básico para o container e modal (para fins funcionais)
    const containerStyle = { padding: '20px 0', color: 'white' };
    const modalOverlayStyle = { position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
    const modalContentStyle = { backgroundColor: '#333', padding: '30px', borderRadius: '8px', width: '400px', boxShadow: '0 4px 8px rgba(0,0,0,0.5)', color: 'white' };
    const inputStyle = { width: '100%', padding: '8px', margin: '5px 0 15px 0', boxSizing: 'border-box', border: '1px solid #555', backgroundColor: '#444', color: 'white' };
    const btnStyle = { padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', margin: '5px' };


    const renderFormModal = () => (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <h3>{editingConteudo ? 'Editar Trilha' : 'Adicionar Nova Trilha'}</h3>
                <form onSubmit={handleSubmit}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Modelo:</label>
                    <input name="modelo" value={formData.modelo} onChange={handleInputChange} required />
                    
                    <label style={{ display: 'block', marginBottom: '5px' }}>Categoria:</label>
                    <input name="categoria" value={formData.categoria} onChange={handleInputChange} required />

                    <label style={{ display: 'block', marginBottom: '5px' }}>Duração:</label>
                    <input name="duracao" value={formData.duracao} onChange={handleInputChange} placeholder="Ex: 3h 20m" required />

                    <label style={{ display: 'block', marginBottom: '5px' }}>Tags:</label>
                    <input name="tags" value={formData.tags} onChange={handleInputChange} placeholder="Separadas por vírgula" />

                    <label style={{ display: 'block', marginBottom: '5px' }}>Descrição:</label>
                    <textarea name="descricao" value={formData.descricao} onChange={handleInputChange} style={{ minHeight: '80px' }} required />

                    <button type="submit" style={{ ...btnStyle, backgroundColor: '#8a2be2', color: 'white' }} disabled={loading}>
                        {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button type="button" onClick={() => setIsModalOpen(false)} style={{ ...btnStyle, backgroundColor: '#555', color: 'white' }}>
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );

    if (error) return <p style={{ padding: '20px 0', color: 'red' }}>{error}</p>;

    return (
        <div style={containerStyle}>
            <h3>Gerenciar Trilhas (CRUD)</h3>
            <button onClick={openCreateModal} style={{ ...btnStyle, backgroundColor: '#28a745', color: 'white', marginBottom: '20px' }} disabled={loading}>
                + Adicionar Nova Trilha
            </button>

            {loading && !conteudos.length ? <p>Carregando trilhas...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {conteudos.map(c => (
                        <div key={c.id} style={{ border: '1px solid #444', padding: '15px', borderRadius: '8px', backgroundColor: '#333', color: 'white' }}>
                            <h4 style={{ margin: '0 0 5px 0' }}>{c.descricao.substring(0, 50)}...</h4>
                            <p style={{ margin: '0' }}><small>Modelo: **{c.modelo}**</small></p>
                            <p style={{ margin: '0 0 10px 0' }}><small>Categoria: **{c.categoria}** | Duração: **{c.duracao}**</small></p>
                            <button onClick={() => openEditModal(c)} style={{ ...btnStyle, backgroundColor: '#ffc107', color: 'black', marginRight: '10px' }}>
                                Editar
                            </button>
                            <button onClick={() => handleDelete(c.id)} style={{ ...btnStyle, backgroundColor: '#dc3545', color: 'white' }}>
                                Apagar
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && renderFormModal()}
        </div>
    );
};

export default TracksSection;