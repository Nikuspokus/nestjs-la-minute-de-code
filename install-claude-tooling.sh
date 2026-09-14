#!/usr/bin/env bash
set -euo pipefail

echo "== Claude Code tooling install (RTK + Caveman + Ponytail + Svelte + NestJS skills + Context7) =="

if ! command -v claude >/dev/null 2>&1; then
  echo "ERREUR: commande 'claude' introuvable dans PATH. Installe Claude Code d'abord." >&2
  exit 1
fi

# --- RTK (Rust Token Killer) : proxy CLI qui compresse les sorties de commandes shell ---
if ! command -v rtk >/dev/null 2>&1; then
  if command -v brew >/dev/null 2>&1; then
    echo "-- Install rtk via Homebrew"
    brew install rtk
  else
    echo "-- Install rtk via script officiel"
    curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh
  fi
else
  echo "-- rtk déjà installé ($(rtk --version))"
fi

echo "-- Enregistrement hook global rtk pour Claude Code"
rtk init -g --auto-patch

# --- Plugins Claude Code (scope user : une fois par machine, réutilisable sur tous les projets) ---
add_plugin() {
  local repo="$1" plugin="$2"
  echo "-- Marketplace: $repo"
  claude plugin marketplace add "$repo" || true
  echo "-- Plugin: $plugin"
  claude plugin install "$plugin" || true
}

add_plugin "JuliusBrussee/caveman" "caveman@caveman"
add_plugin "DietrichGebert/ponytail" "ponytail@ponytail"
add_plugin "sveltejs/ai-tools" "svelte@svelte"
add_plugin "spences10/svelte-skills-kit" "svelte-skills@svelte-skills-kit"
add_plugin "jeffallan/claude-skills" "fullstack-dev-skills@fullstack-dev-skills"

# --- Context7 MCP (doc à jour des libs) ---
# --scope user : dispo sur tous les projets de la machine, pas seulement celui-ci.
echo "-- MCP: context7"
claude mcp add --scope user --transport http context7 https://mcp.context7.com/mcp || true

echo "== Terminé. Redémarre Claude Code / VSCode pour charger plugins + MCP. =="
echo "== Active caveman/ponytail au niveau voulu : /caveman lite|full|ultra, /ponytail lite|full|ultra =="
