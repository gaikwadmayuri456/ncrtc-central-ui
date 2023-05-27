# Build react project
npm run build
npm install -g serve
serve -s build
# or

python3 -m http.server 2020
# remove privious build folder

rm -rf build/
# Copy folder in pi host.107

scp -r build/ pi@172.16.7.27:/home/pi/kochi-metro-ui
# After that create one service file and follow below commands

sudo cp kochi-metro-ui.service /etc/systemd/system/

sudo systemctl enable kochi-metro-ui.service

sudo systemctl start kochi-metro-ui.service

sudo systemctl status kochi-metro-ui.service

# Finaly create one .chromium file follow bellow commands

mkdir /home/pi/.config/autostart
cd /home/pi/.config/autostart
cp /home/pi/iam-gateway-setup/chromium.desktop /home/pi/.config/autostart/chromium.desktop
# #################################################################################################
 # chromium file format 
 [Desktop Entry]
Type=Application
Exec=/usr/bin/chromium-browser --noerrdialogs --check-for-update-interval=31536000 --disable-infobars --disable-session-crashed-bubble --kiosk --app=http://localhost:2902
Hidden=false

# .service file format
# Reference
# https://github.com/torfsen/python-systemd-tutorial

[Unit]
Description=IAM IoT Gateway

[Service]
# Command to execute when the service is started
[Unit]
Description=ICici Ghansoli UI

[Service]
# Command to execute when the service is started
User=pi
Group=pi
WorkingDirectory=/home/pi/icici_ghansoli_ui
ExecStart=serve -p 2902 -s /home/pi/icici_ghansoli_ui/build

[Install]
WantedBy=default.target


[Install]
WantedBy=default.target

# Install Node.js 16 and npm on Raspberry Pi
curl -sSL https://deb.nodesource.com/setup_16.x | sudo bash -
sudo apt install -y nodejs
node --version
npm --version
# React stable version
sudo npm install -g n
sudo n stable
# chromium.desktop file
[Desktop Entry]
Type=Application
Exec=/usr/bin/chromium-browser --noerrdialogs --check-for-update-interval=31536000 --disable-infobars --disable-session-crashed-bubble --kiosk --app=http://localhost:2902
Hidden=false

cd ~/.config/autostart/
cat chromium.desktop

## Build 2.9 Changes regarding power status and status preview and communication column
If Communication between gateway and smarti  device is on and If communication between smarti device and escalator = NOPOLL( i.e off)  then we are showing status off of columns power,status preview and communication.

## Provide net to gateway
curl -X POST http://192.168.100.1:8090/login.xml --data-urlencode "mode=191" --data-urlencode "username=nihar zanwar" --data-urlencode "password=Kiam@12345" --data-urlencode "a=1633529001622" --data-urlencode "producttype=0"
