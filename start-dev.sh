#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH"
cd /Users/matinkim/vibeCoding/maknaeya-mwomeok
exec node node_modules/.bin/next dev --webpack --port 3000
