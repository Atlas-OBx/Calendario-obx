# Calendário de Ações OBX

Site institucional e agenda de ações do **Observatório das Baixadas (OBX)** — desenvolvido para acompanhar atividades, eventos e iniciativas nos territórios.

**Stack:** React 19 · Vite · CSS puro · Supabase

🔗 **[calendário-obx-mu.vercel.app](https://calendario-obx-mu.vercel.app)**

---

## ✨ Funcionalidades

### Site Público
- Agenda de ações com visualização em **lista** e **calendário**
- Busca por nome da ação ou cidade
- Filtro por status (Planejada, Confirmada, Em andamento, Realizada, Cancelada)
- Modal de detalhes de cada ação
- Design responsivo (mobile-first)

### Painel Administrativo (`/admin`)
- Login seguro com **Supabase Auth** (e-mail e senha)
- Cadastro, edição e exclusão de ações
- Acesso em: `https://calendario-obx-mu.vercel.app/#/admin`

---

## 🗄️ Banco de Dados — Supabase

As ações são armazenadas na tabela `acoes` do Supabase com os seguintes campos:

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | uuid | Identificador único (gerado automaticamente) |
| `titulo` | text | Nome da ação |
| `data` | date | Data da ação |
| `horario` | text | Horário (ex: 14h00) |
| `cidade` | text | Cidade onde ocorre |
| `local` | text | Local específico |
| `status` | text | Status da ação |
| `descricao` | text | Descrição detalhada |
| `responsavel` | text | Pessoa ou equipe responsável |
| `created_at` | timestamptz | Data de criação |

### Segurança (Row Level Security)
- **Leitura pública:** qualquer pessoa pode visualizar as ações
- **Escrita restrita:** apenas usuários autenticados podem criar, editar ou excluir

---

## ⚙️ Variáveis de Ambiente

Configure no painel do Vercel em **Settings → Environment Variables**:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

---

## 📁 Estrutura do Projeto

```
public/
├── OBX_LOGO_OFICIAL.png
└── OBX_LOGO_OFICIAL_-_Preto.png

src/
├── components/
│   ├── admin/
│   │   └── ActionForm.jsx    # Formulário de criação/edição de ações
│   ├── Header.jsx            # Cabeçalho público com botão "Entrar"
│   ├── Hero.jsx              # Seção principal (landing)
│   ├── About.jsx             # Seção institucional/sobre
│   ├── Agenda.jsx            # Agenda pública (busca dados do Supabase)
│   ├── CalendarView.jsx      # Visualização calendário
│   ├── ActionCard.jsx        # Card de cada ação na lista
│   └── ActionModal.jsx       # Modal de detalhes
├── hooks/
│   └── useAuth.js            # Hook de autenticação Supabase
├── lib/
│   └── supabaseClient.js     # Client Supabase (singleton)
├── pages/
│   ├── AdminPage.jsx         # Painel administrativo (requer login)
│   └── LoginPage.jsx         # Tela de login
├── App.jsx                   # Roteamento hash-based (#/admin)
├── App.css                   # Estilos de todos os componentes
├── index.css                 # Design tokens e reset global
└── main.jsx                  # Entry point React
```

---

## 🎨 Design

- **Paleta:** Preto `#111111` · Amarelo `#FFD400` · Fundo claro `#f5f4f0`
- **Tipografia:** Inter (Google Fonts)
- **Responsivo:** funciona em todos os tamanhos de tela

---

## ☁️ Deploy

O projeto está hospedado no **[Vercel](https://vercel.com)**, com deploy automático a partir do repositório GitHub.

Para atualizar a produção, basta fazer push para a branch `main` — o Vercel detecta e faz o redeploy automaticamente.

---

## 📝 Licença

MIT — Uso livre para organizações comunitárias e movimentos sociais.
