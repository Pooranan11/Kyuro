# Kyuro — Sécurité & Bonnes pratiques

## Règles absolues — ne jamais déroger

### Dépendances npm
- Jamais installer Axios — utiliser fetch natif
- Toujours pin les versions exactes dans package.json (pas de ^ ni ~)
- Toujours vérifier npm audit après chaque ajout de package
- Jamais de package avec un script postinstall suspect
- Vérifier le nombre de téléchargements et la date de dernière mise à jour avant d'installer

```json
// Correct
"recharts": "2.12.7"

// Interdit
"recharts": "^2.12.7"
"recharts": "~2.12.7"
```

### Dépendances Python
- Toujours pin les versions dans requirements.txt
- Utiliser un virtual environment
- Jamais de pip install sans vérifier la source

```
# Correct
fastapi==0.115.0
yfinance==0.2.54

# Interdit
fastapi>=0.115.0
```

### Variables d'environnement
- Jamais de credentials dans le code
- Toujours utiliser .env avec python-dotenv côté backend
- Toujours utiliser import.meta.env côté frontend Vite
- .env toujours dans .gitignore

### CORS
Configurer explicitement en backend :

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend Vite
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

### Validation des inputs
Toujours valider les tickers côté backend :

```python
TICKER_PATTERN = re.compile(r'^[A-Z]{1,5}$')

if not TICKER_PATTERN.match(ticker.upper()):
    raise HTTPException(status_code=400, detail="Invalid ticker format")
```

## Docker
Toujours utiliser des images officielles avec version fixe :

```dockerfile
# Correct
FROM python:3.12-slim

# Interdit
FROM python:latest
```

## Git
- .env dans .gitignore
- node_modules dans .gitignore
- __pycache__ dans .gitignore
- Jamais commit de clés API ou tokens
