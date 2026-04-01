# Kyuro — Contexte pour Claude Code

## C'est quoi Kyuro
App web de suivi de courbes financières premium.
Stack : FastAPI + React + PostgreSQL + Redis.

## Lis ces fichiers avant de commencer
- `.claude/skills/ARCHITECTURE.md` — structure complète du projet
- `.claude/skills/BACKEND.md` — conventions FastAPI
- `.claude/skills/FRONTEND.md` — conventions React
- `.claude/skills/SECURITY.md` — règles de sécurité absolues

## Règles non négociables
1. Jamais installer Axios — fetch natif uniquement
2. Toujours pin les versions exactes (pas de ^ ni ~)
3. Jamais de credentials dans le code
4. Toujours valider les inputs côté backend
5. Toujours vérifier npm audit après un nouvel ajout

## Ce que tu dois faire quand tu proposes du code
- Respecter la structure de dossiers définie dans ARCHITECTURE.md
- Utiliser le format de réponse uniforme défini dans BACKEND.md
- Utiliser le wrapper fetch défini dans FRONTEND.md
- Signaler si tu as besoin d'installer un nouveau package et justifier pourquoi

## Ce que tu ne dois jamais faire
- Installer Axios ou tout autre client HTTP
- Utiliser ^ ou ~ dans package.json ou requirements.txt
- Mettre des credentials en dur dans le code
- Créer des fichiers hors de la structure définie
