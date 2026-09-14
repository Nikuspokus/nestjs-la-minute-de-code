# Récap : outillage Claude Code (tokens, skills, bonnes pratiques)

Document de référence pour le futur projet NestJS + Svelte. Résume ce qui a été installé, testé et discuté sur cette session.

## 1. Outils d'optimisation de tokens installés

Ces trois outils réduisent la consommation de tokens, mais n'ont **rien à voir entre eux** ni avec Redux Toolkit (RTK au sens frontend) — nom qui prête à confusion.

### RTK (Rust Token Killer)

- **Rôle** : proxy CLI qui intercepte les sorties de commandes shell (git, npm, cargo, ls, cat...) et les compresse avant qu'elles n'entrent dans le contexte de l'agent.
- **Install** : `brew install rtk` puis `rtk init -g --auto-patch` (hook global, patch `~/.claude/settings.json`, backup automatique en `.bak`).
- **Commandes utiles** :
  - `rtk gain` — total tokens économisés
  - `rtk gain --history` — détail par commande
  - `rtk discover` — repère d'autres opportunités
  - `rtk init --uninstall -g` — désinstallation complète
- **Mesure réelle faite** : `git status` → 96 tokens économisés sur 146 (65,8 %).
- **Portée de l'effet** : agit sur les tokens d'**input/cache** (sorties de commandes réinjectées dans le contexte à chaque tour). C'est le levier le plus structurant des trois pour une session longue, car le cache-read domine largement la consommation totale (voir section 3).

### Caveman

- **Rôle** : compresse le style de **mes réponses** (l'agent), pas les commandes shell. Style télégraphique, sans articles ni formules de politesse, technique intact.
- **Install** : `claude plugin marketplace add JuliusBrussee/caveman` puis `claude plugin install caveman@caveman`.
- **Niveaux** : `/caveman lite|full|ultra|wenyan-lite|wenyan-full|wenyan-ultra|off` — changeable à tout moment sans désinstaller.
- **Désinstall** : `claude plugin uninstall caveman@caveman`.
- **Mesure réelle faite** (`/caveman-stats`, 45 tours) : 15 662 tokens de sortie au total sur la session, dont 13 173 en mode "off" et 2 489 en mode "full" (économie estimée de 4 622 tokens sur les tours en mode full, soit ~65 %, cohérent avec le chiffre annoncé par le projet).
- **Limite** : agit uniquement sur les tokens de **sortie**, qui ne représentent qu'une infime partie du total consommé (voir section 3).

### Ponytail

- **Rôle** : pousse l'agent vers la solution la plus paresseuse qui marche (réutiliser l'existant, stdlib, natif, avant d'écrire du code neuf). Vise la quantité de **code généré**, pas le style de prose.
- **Install** : `claude plugin marketplace add DietrichGebert/ponytail` puis `claude plugin install ponytail@ponytail`.
- **Niveaux** : `/ponytail lite|full|ultra`, désactivable via "stop ponytail" ou "normal mode".
- **Mesures disponibles** :
  - `/ponytail-gain` — scoreboard basé sur des **benchmarks publiés** (5 tâches, 3 modèles), pas une mesure de ce repo précis. Médianes : lignes de code −80 à −94 %, coût −47 à −77 %, vitesse ×3–6.
  - `/ponytail-debt` — ledger réel des raccourcis pris sur ce repo (seule mesure "vraie" par repo).
  - `/ponytail-audit` — audit du repo entier pour repérer la sur-ingénierie.

## 2. Ce qui n'a pas été installé (recherché mais introuvable ou hors sujet)

- **"coderiview"** : aucun projet de ce nom trouvé. Correspond en fait au skill natif `/code-review`, déjà disponible sans installation.
- **"/skills-ui"** : aucune trace, ni dans la doc officielle, ni dans les marketplaces connues. Probable confusion avec `npx skills` (vercel-labs/skills), le gestionnaire de skills qui génère le fichier `skills-lock.json` déjà présent dans ce repo (sous-commandes : `add`, `use`, `list`, `find`, `update`, `init`, `remove` — pas de commande "ui").

## 3. Point clé : impact réel sur la fenêtre d'usage de 5h

Mesure prise sur cette session (`/caveman-stats`) :

```
Cache-read tokens : 2 999 097
Output tokens     :    15 662   (≈ 0,5 % du total)
```

La fenêtre de 5h de Claude Code est bornée par le total de tokens consommés, **dominé par les tokens d'input/cache-read** (contexte réinjecté à chaque tour), pas par les tokens de sortie.

Conséquence :
- **Caveman** : économie de sortie estimée à 4 622 tokens sur la session, soit environ **0,15 % du budget total**. Effet réel quasi nul sur la durée de la fenêtre, malgré le chiffre de "65 %" flatteur pris isolément.
- **Ponytail** : pas de mesure directe possible sans `/ponytail-debt`, mais le levier théorique est plus large que Caveman s'il réduit aussi le nombre d'allers-retours (donc le cache-read cumulé), pas seulement le volume de code.
- **RTK** : touche directement l'input/cache, le poste dominant. Un seul échantillon mesuré (`git status`), donc pas de projection chiffrée fiable, mais le levier est structurellement plus fort que Caveman/Ponytail sur une session longue.

**Conclusion honnête** : pour vraiment prolonger une fenêtre de 5h, RTK a plus de potentiel que Caveman/Ponytail combinés. Ces derniers restent utiles pour d'autres raisons (clarté du code généré pour Ponytail, réponses plus denses pour Caveman) mais ne sont pas le principal levier de quota.

## 4. Liste des skills / sous-agents pour le futur projet NestJS + Svelte

### Officiel (priorité, à installer en premier)

- **Plugin Svelte officiel** — maintenu par l'équipe Svelte (svelte.dev/docs/ai/claude-plugin). Fournit un serveur MCP local (stdio), des skills pour écrire du Svelte 5 correct (runes `$state`/`$derived`/`$effect`) et un agent spécialisé pour éditer les fichiers Svelte.
  ```
  claude plugin marketplace add sveltejs/ai-tools   # marketplace: svelte
  claude plugin install svelte@svelte
  ```
  ✅ Installé (scope user).
- **Context7 (MCP)** — documentation à jour des librairies en temps réel, consultée par l'agent pendant qu'il code. Particulièrement utile pour Svelte 5 (API runes récente) et Prisma/Neon (versions RC / packages récents).
  ```
  claude mcp add --transport http context7 https://mcp.context7.com/mcp
  ```
  ✅ Installé, mais **scope projet local** (`.claude.json`, pas global) — à refaire dans chaque nouveau projet, ou repasser en `--scope user` si tu veux qu'il soit dispo partout. Clé API optionnelle (limites plus hautes) sur context7.com/dashboard.

### Communauté (vérifier la source avant d'installer, moins vetted qu'un plugin officiel)

- **jeffallan/claude-skills** → skill "NestJS Expert" : DI, validation DTO, guards, patterns d'authentification JWT.
  ```
  claude plugin marketplace add jeffallan/claude-skills   # marketplace: fullstack-dev-skills
  claude plugin install fullstack-dev-skills@fullstack-dev-skills
  ```
  ✅ Installé (scope user).
- **spences10/svelte-skills-kit** → skills séparés : `svelte-runes`, `sveltekit-data-flow` (load functions, form actions), `sveltekit-structure` (routing, layouts, SSR).
  ```
  claude plugin marketplace add spences10/svelte-skills-kit   # marketplace: svelte-skills-kit
  claude plugin install svelte-skills@svelte-skills-kit
  ```
  ✅ Installé (scope user).

### Déjà natif à Claude Code (rien à installer)

- `/code-review`, `/simplify`, `/security-review` — qualité et sécurité du code, agnostiques au framework.
- Skill `init` — génère un CLAUDE.md de documentation du projet.
- Skills Neon déjà disponibles (`neon-postgres`, `neon-postgres-branches`, `neon-postgres-egress-optimizer`) — pertinents si Neon/Postgres reste le backend du projet NestJS.
- Sous-agents natifs : `Explore` (recherche de code), `Plan` (architecture avant implémentation), `general-purpose`, `claude-code-guide`.

## 5. Bonnes pratiques (indépendantes de tout plugin)

### NestJS

- Un module par feature ; le service porte la logique métier, le controller ne fait que router.
- DTO + `class-validator` sur toutes les entrées (déjà en place dans ce repo).
- Guards/interceptors pour le cross-cutting (auth, logging) — jamais de logique métier dedans.
- `@nestjs/config` + validation du schéma d'environnement (Zod/Joi) — jamais de `process.env` dispersé directement dans le code.
- Exception filters globaux plutôt que des `try/catch` répétés partout.
- Prisma : requêtes typées, migrations versionnées, jamais de SQL brut sans raison précise.
- Tests : unitaires sur le service isolé + e2e sur l'endpoint (structure Vitest déjà présente dans ce repo).

### Svelte / SvelteKit

- Runes (`$state`/`$derived`/`$effect`) en Svelte 5, pas les stores legacy sauf besoin réel de partage d'état cross-composant global.
- Logique serveur et secrets dans `+page.server.ts` / `+layout.server.ts` — jamais dans `+page.ts` (exposé au client).
- `load` functions pour récupérer les données ; éviter le fetch côté client quand le SSR est possible.
- Form actions natives plutôt que fetch manuel pour les mutations.
- Vérifier `browser` / `building` avant tout accès à `window` ou `document`.

## 6. Installation automatique sur un nouveau projet

Script fourni : [`install-claude-tooling.sh`](install-claude-tooling.sh). Installe RTK, Caveman, Ponytail, plugin Svelte officiel, svelte-skills-kit, fullstack-dev-skills (NestJS Expert inclus) et Context7 (MCP, scope `user` cette fois — dispo direct sur tous futurs projets).

**Usage sur un nouveau projet** :

```bash
# copier ces 2 fichiers à la racine du nouveau projet
cp RECAP-CLAUDE-CODE-SKILLS.md install-claude-tooling.sh /chemin/nouveau-projet/

cd /chemin/nouveau-projet
bash install-claude-tooling.sh
```

Puis redémarrer Claude Code / VSCode pour que tout se charge.

Le script est idempotent (relancer ne casse rien si déjà installé) — les plugins et RTK sont de toute façon en scope **user**, donc une fois faits sur une machine, ils sont déjà actifs pour tout nouveau projet sans rien relancer. Seul cas où le script reste utile : nouvelle machine, ou si un plugin a été désinstallé entre-temps.

## 7. État à date de ce document

Tout installé : RTK (hook global), Caveman (plugin, niveau full), Ponytail (plugin, niveau full), plugin Svelte officiel, spences10/svelte-skills-kit, jeffallan/claude-skills (fullstack-dev-skills), Context7 (MCP, scope projet local uniquement).

**Redémarrage Claude Code nécessaire** pour que les nouveaux plugins (svelte, svelte-skills, fullstack-dev-skills) et le serveur MCP Context7 soient chargés.
