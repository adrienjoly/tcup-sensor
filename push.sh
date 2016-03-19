# rsync -av -e "ssh -A root@proxy ssh" ./ root@192.168.100.177/node_target
# rsync -avz ./ root@192.168.100.177:/node_app_slot/
# rcp -r ./ root@192.168.100.177:/node_app_slot/
rcp -r ./ root@edison.local:/node_app_slot/
