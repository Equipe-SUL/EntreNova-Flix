import '../styles/AdminNavbar.css'

const AdminNavbar: React.FC = () => {
    return (
        <nav className="navbar-admin">
            <div className="title-navbar">
                <h1>Área da Entrenova</h1>
                <h6>Tenha informações sobre o projeto Entrenova-Flix</h6>
            </div>
            <div className='btns-navbar'>
                <button>
                    Visão Geral
                </button>
                <button>
                    Empresas e Filtros
                </button>
            </div>
        </nav>
    )
}

export default AdminNavbar;