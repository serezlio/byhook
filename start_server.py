#!/usr/bin/env python3
"""
By Hook — iPhone Yerel Sunucu
===============================
Çalıştır: python start_server.py
iPhone'dan: http://[IPHONE_GOSTERILEN_IP]:8080/byhook.html

iPhone ve PC aynı WiFi ağında olmalı.
"""
import http.server
import socketserver
import os
import socket
import threading

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # No-cache: F5 her zaman güncel veri getirir
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        # CORS — gerekli değil ama zarar vermez
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def log_message(self, fmt, *args):
        # Konsolu çok meşgul etme
        if '200' in str(args[1]) and '.js' not in str(args[0]):
            print(f"  → {args[0].split(' ')[1]}")

def get_all_ips():
    import subprocess
    ips = []
    try:
        # Tüm network interface IP'lerini al
        result = subprocess.run(['ipconfig'], capture_output=True, text=True, encoding='cp1254', errors='ignore')
        lines = result.stdout.split('\n')
        adapter = ''
        for line in lines:
            if 'adapter' in line.lower() or 'bağdaştırıcı' in line.lower() or 'Ethernet' in line or 'Wi-Fi' in line or 'Kablosuz' in line:
                adapter = line.strip().rstrip(':')
            if 'IPv4' in line and '127.' not in line:
                parts = line.split(':')
                if len(parts) >= 2:
                    ip = parts[-1].strip()
                    if ip and ip != '127.0.0.1':
                        ips.append((adapter, ip))
    except:
        pass
    if not ips:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            ips = [('Ag', s.getsockname()[0])]
            s.close()
        except:
            ips = [('', '127.0.0.1')]
    return ips

all_ips = get_all_ips()

ip_lines = ""
for adapter, ip in all_ips:
    ip_lines += f"    http://{ip}:{PORT}/byhook.html"
    if adapter:
        ip_lines += f"  ({adapter.strip()})"
    ip_lines += "\n"

print(f"""
{'='*60}
  BY HOOK  ·  Yerel Sunucu Aktif
{'='*60}
  PC'den aç:
    http://localhost:{PORT}/byhook.html

  iPhone'dan dene (WiFi ile baglananı sec):
{ip_lines}
  iPhone'a eklemek icin:
    1. Safari'de yukaridaki adresi ac
    2. Paylas butonu (kare+ok)
    3. "Ana Ekrana Ekle" → Ekle
{'='*60}
  Durdurmak icin: Ctrl+C
{'='*60}
""")

with socketserver.TCPServer(("", PORT), NoCacheHandler) as httpd:
    httpd.allow_reuse_address = True
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n  Sunucu durduruldu.")
