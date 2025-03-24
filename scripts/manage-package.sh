#!/bin/bash

# Configuración
MAIN_REPO="https://github.com/anthonydevs17/mastra.git"
BRANCH="main"

# Definir los mapeos de rutas
declare -A PACKAGE_PATHS=(
  ["package/cli/src/playground"]="src/package/playground"
  ["deployers/vercel"]="src/package/deployers/vercel"
  # Añade más mapeos según necesites
)

function add_package() {
  local mono_path=$1
  local local_path=${PACKAGE_PATHS[$mono_path]}
  
  echo "Añadiendo $mono_path a $local_path..."
  git subtree add \
    --prefix="$local_path" \
    $MAIN_REPO \
    $BRANCH \
    --squash \
    --squash-opts="-P $mono_path"
}

function update_package() {
  local mono_path=$1
  local local_path=${PACKAGE_PATHS[$mono_path]}
  
  echo "Actualizando $mono_path en $local_path..."
  git subtree pull \
    --prefix="$local_path" \
    $MAIN_REPO \
    $BRANCH \
    --squash \
    --squash-opts="-P $mono_path"
}

case $1 in
  "add")
    add_package "$2"
    ;;
  "update")
    update_package "$2"
    ;;
  "add-all")
    for mono_path in "${!PACKAGE_PATHS[@]}"; do
      add_package "$mono_path"
    done
    ;;
  "update-all")
    for mono_path in "${!PACKAGE_PATHS[@]}"; do
      update_package "$mono_path"
    done
    ;;
  *)
    echo "Uso: ./manage-packages.sh [add|update|add-all|update-all] [ruta-en-monorepo]"
    ;;
esac