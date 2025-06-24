#!/bin/bash

PROFILE="${1:-default}"
CRED_FILE="$HOME/.aws/credentials"

echo "Extraindo credenciais do perfil '$PROFILE'..."

if [ ! -f "$CRED_FILE" ]; then
  echo "Erro: O arquivo de credenciais '$CRED_FILE' não foi encontrado."
  exit 1
fi

AWS_ACCESS_KEY_ID=$(awk -v profile="[$PROFILE]" '
  $0 == profile {in_profile=1; next}
  /^\[.*\]/ {in_profile=0}
  in_profile && $0 ~ /^aws_access_key_id/ {
    split($0, a, "="); gsub(/^[ \t]+|[ \t]+$/, "", a[2]); print a[2]
  }
' "$CRED_FILE")

AWS_SECRET_ACCESS_KEY=$(awk -v profile="[$PROFILE]" '
  $0 == profile {in_profile=1; next}
  /^\[.*\]/ {in_profile=0}
  in_profile && $0 ~ /^aws_secret_access_key/ {
    split($0, a, "="); gsub(/^[ \t]+|[ \t]+$/, "", a[2]); print a[2]
  }
' "$CRED_FILE")

AWS_SESSION_TOKEN=$(awk -v profile="[$PROFILE]" '
  $0 == profile {in_profile=1; next}
  /^\[.*\]/ {in_profile=0}
  in_profile && $0 ~ /^aws_session_token/ {
    split($0, a, "="); gsub(/^[ \t]+|[ \t]+$/, "", a[2]); print a[2]
  }
' "$CRED_FILE")

if [[ -z "$AWS_ACCESS_KEY_ID" || -z "$AWS_SECRET_ACCESS_KEY" || -z "$AWS_SESSION_TOKEN" ]]; then
  echo "Erro: Falha ao encontrar todas as credenciais no perfil '$PROFILE'."
  exit 1
fi

ENCODED_ACCESS_KEY_ID=$(echo -n "$AWS_ACCESS_KEY_ID" | base64)
ENCODED_SECRET_ACCESS_KEY=$(echo -n "$AWS_SECRET_ACCESS_KEY" | base64)
ENCODED_SESSION_TOKEN=$(echo -n "$AWS_SESSION_TOKEN" | base64)

if [ -f secrets.yml ]; then
  cp secrets.yml "secrets.yml.bak_$(date +%Y%m%d_%H%M%S)"
  echo "Backup criado: secrets.yml.bak_$(date +%Y%m%d_%H%M%S)"
fi


cat <<EOF > secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: fiap-fast-food-secret
  namespace: default
  labels:
    app: fiap-fast-food-app
type: Opaque
data:
  AWS_ACCESS_KEY_ID: $ENCODED_ACCESS_KEY_ID
  AWS_SECRET_ACCESS_KEY: $ENCODED_SECRET_ACCESS_KEY
  AWS_SESSION_TOKEN: $ENCODED_SESSION_TOKEN
EOF

echo "Arquivo secrets.yml gerado com sucesso usando o perfil '$PROFILE'."
