Писал в PyCharm и в его консоли надо прописать:

npm install pg axios

mkdir -p ~/.postgresql

New-Item -Path $env:APPDATA\.postgresql -ItemType Directory -Force

Invoke-WebRequest -Uri "https://storage.yandexcloud.net/cloud-certs/CA.pem" -OutFile "$env:APPDATA\.postgresql\root.crt"

icacls "$env:APPDATA\.postgresql\root.crt" /inheritance:r /grant:r "$($env:USERNAME):(R)"
