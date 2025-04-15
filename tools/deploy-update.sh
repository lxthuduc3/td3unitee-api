#!/bin/bash

echo "################################"
echo "#         DEPLOY UPDATE        #"
echo "################################"

# Get newest version
echo -e "\nUpdating repository...\n"
git pull

# Install necessary packages
echo -e "\nInstalling dependencies...\n"
npm i --force

# Update environment variables
echo -e "\nConfiguring environment variables...\n"
new_env_vars=""
keys=()

# Read keys from .env.example
while IFS= read -r line || [[ -n "$line" ]]; do
  trimmed_line=$(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
  if [[ -n "$trimmed_line" ]]; then
    keys+=("$trimmed_line")
  fi
done < .env.example

for key in "${keys[@]}"; do
  value=""

  # Keep asking until a value is provided
  while [[ -z "$value" ]]; do
    read -p "$key (get from current .env if ignored): " input

    if [[ -n "$input" ]]; then
      value="$input"
    else
      # Try to get value from existing .env file
      if [[ -f .env ]]; then
        value=$(grep -E "^$key" .env | cut -d '=' -f2- | tr -d '"\r')
        echo "$value (keep)"
      fi
    fi

    # If still empty, ask again
    if [[ -z "$value" ]]; then
      echo "Value for $key is not found in current .env. Please enter again."
    fi
  done

  new_env_vars+="$key\"$value\"\n"
done

echo -e "$new_env_vars" > .env

# Initializing database if needed
echo -e "\nInitializing database...\n"
npm run init

echo -e "\nRestarting PM2...\n"
pm2 restart td3unitee-api

echo -e "\nDeployment completed successfully!\n"
