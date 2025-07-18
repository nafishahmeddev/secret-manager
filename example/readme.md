# Load Environment variable
Fix Permission
```bash
chmod +x ./bin/envar
```

Fetch Environment
```bash
./bin/envar
```

Set env
```bash
source /tmp/env.sh #this will load the in current session
rm -f /tmp/env.sh #this will delete the file 
```

Start application
```bash
npm start
#or
pm2 start
```