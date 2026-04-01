# Kyuro — Command runner
# Usage : just <commande>
# Installer just : brew install just

# Affiche la liste des commandes disponibles
default:
    @just --list

# ─── Docker ────────────────────────────────────────────────────────────────────

# Démarre tous les services (backend, frontend, postgres, redis)
up:
    docker-compose up

# Démarre en arrière-plan
up-d:
    docker-compose up -d

# Arrête tous les services
down:
    docker-compose down

# Recompile les images et redémarre
rebuild:
    docker-compose up --build

# ─── Développement local ───────────────────────────────────────────────────────

# Lance backend + frontend en parallèle (Ctrl+C arrête les deux)
dev:
    #!/usr/bin/env bash
    trap 'kill 0' EXIT
    (cd backend && .venv/bin/uvicorn app.main:app --reload --port 8000) &
    (cd frontend && npm run dev) &
    wait

# Lance le serveur FastAPI en mode reload
backend:
    cd backend && .venv/bin/uvicorn app.main:app --reload --port 8000

# Lance le serveur Vite
frontend:
    cd frontend && npm run dev

# ─── Installation ──────────────────────────────────────────────────────────────

# Installe toutes les dépendances (backend + frontend)
install: install-backend install-frontend

# Installe les dépendances Python
install-backend:
    cd backend && pip install -r requirements.txt

# Installe les dépendances Node
install-frontend:
    cd frontend && npm install

# ─── Tests ─────────────────────────────────────────────────────────────────────

# Lance tous les tests (backend + frontend)
test: test-backend test-frontend

# Lance les tests backend avec pytest
test-backend:
    cd backend && python -m pytest tests/ -v

# Lance les tests frontend avec vitest
test-frontend:
    cd frontend && npm test

# Lance les tests en mode watch (frontend)
test-watch:
    cd frontend && npm run test:watch

# ─── Base de données ───────────────────────────────────────────────────────────

# Applique les migrations Alembic
migrate:
    cd backend && alembic upgrade head

# Crée une nouvelle migration (usage : just migration "description")
migration name:
    cd backend && alembic revision --autogenerate -m "{{name}}"

# ─── Qualité ───────────────────────────────────────────────────────────────────

# Vérifie les vulnérabilités npm
audit:
    cd frontend && npm audit
