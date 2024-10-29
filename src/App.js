// Import de bibliotecas
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useState, useEffect } from "react";

// Define o endereço do servidor
const endereco_servidor = "http://localhost:8000";

function NoPage() {
  return (
    <div>
      <h2>404 - Página não encontrada</h2>
    </div>
  );
}

function Layout() {
  return (
    <>
      <h1>Menu principal</h1>
      <nav>
        <ol>
          <li>
            <Link to="/frmcadastrocliente/-1">Incluir</Link>
          </li>
          <li>
            <Link to="/frmlistarcliente">Listar (Alterar, Excluir)</Link>
          </li>
        </ol>
        <hr />
      </nav>
      <Outlet />
    </>
  );
}

function FrmCadastroCliente() {
  const { alterarId } = useParams();
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("");
  const [resultado, setResultado] = useState("");

  useEffect(() => {
    const getCliente = async () => {
      if (alterarId > 0) {
        const response = await fetch(`${endereco_servidor}/cliente/${alterarId}`);
        const data = await response.json();
        setNome(data.nome);
        setIdade(data.idade);
        setEmail(data.email);
        setCargo(data.cargo);
      }
    };
    getCliente();
  }, [alterarId]);

  const handleSubmitInsert = async (event) => {
    event.preventDefault();
    const dados = { nome, idade, email, cargo };
    const response = await fetch(`${endereco_servidor}/cliente`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    const data = await response.json();
    setResultado(data.message);
    limpar();
  };

  const handleSubmitUpdate = async (event) => {
    event.preventDefault();
    const dados = { nome, idade, email, cargo };
    const response = await fetch(`${endereco_servidor}/cliente/${alterarId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    const data = await response.json();
    setResultado(data.message);
    limpar();
  };

  const limpar = () => {
    setNome("");
    setIdade("");
    setEmail("");
    setCargo("");
  };

  return (
    <>
      <form
        name="FrmCadastroCliente"
        method="post"
        onSubmit={alterarId < 0 ? handleSubmitInsert : handleSubmitUpdate}
      >
        <h2>{alterarId < 0 ? "1 - Formulário Cadastro Trabalhador" : "1 - Formulário Alteração Trabalhador"}</h2>
        <label>
          Nome:
          <input
            type="text"
            size="60"
            id="nome"
            name="nome"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
          />
        </label>
        <br />
        <label>
          Idade:
          <input
            type="number"
            id="idade"
            name="idade"
            value={idade}
            onChange={(event) => setIdade(event.target.value)}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            size="60"
            id="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <br />
        <label>
          Cargo:
          <input
            type="text"
            id="cargo"
            name="cargo"
            value={cargo}
            onChange={(event) => setCargo(event.target.value)}
          />
        </label>
        <br />
        <input type="button" value="Limpar" onClick={limpar} />
        <input type="submit" value={alterarId < 0 ? "Cadastrar" : "Atualizar"} />
        <br />
        <label>Resultado: {resultado}</label>
      </form>
    </>
  );
}

function FrmExcluirCliente() {
  const { clienteId } = useParams();
  const [resultado, setResultado] = useState("");

  useEffect(() => {
    const excluirCliente = async () => {
      const response = await fetch(`${endereco_servidor}/cliente/${clienteId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      setResultado(data.message);
    };
    excluirCliente();
  }, [clienteId]);

  return (
    <div>
      <label>Resultado: {resultado}</label>
    </div>
  );
}

function FrmListarCliente() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const getClientes = async () => {
      const response = await fetch(`${endereco_servidor}/clientes`);
      const data = await response.json();
      setClientes(data);
    };
    getClientes();
  }, []);

  return (
    <div>
      <h2>2 - Listar (Editar, Excluir)</h2>
      <div>
        <table border="1">
          <thead>
            <tr>
              <td>Id</td>
              <td>Nome</td>
              <td>Idade</td>
              <td>Email</td>
              <td>Cargo</td>
              <td>Editar</td>
              <td>Excluir</td>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.clienteId}>
                <td>{cliente.clienteId}</td>
                <td>{cliente.nome}</td>
                <td>{cliente.idade}</td>
                <td>{cliente.email}</td>
                <td>{cliente.cargo}</td>
                <td>
                  <button onClick={() => navigate(`/frmcadastrocliente/${cliente.clienteId}`)}>
                    Editar
                  </button>
                </td>
                <td>
                  <button onClick={() => navigate(`/frmexcluircliente/${cliente.clienteId}`)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MenuPrincipal() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="frmcadastrocliente/:alterarId" element={<FrmCadastroCliente />} />
          <Route path="frmexcluircliente/:clienteId" element={<FrmExcluirCliente />} />
          <Route path="frmlistarcliente" element={<FrmListarCliente />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default MenuPrincipal;
  