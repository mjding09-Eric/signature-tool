#!/usr/bin/env python3
from __future__ import annotations

import contextlib
import http.server
import os
import socket
import socketserver
import sys
import webbrowser
from pathlib import Path


PORT = 8135
ROOT = Path(__file__).resolve().parent


def get_lan_ip() -> str:
    with contextlib.closing(socket.socket(socket.AF_INET, socket.SOCK_DGRAM)) as sock:
        try:
            sock.connect(("8.8.8.8", 80))
            return sock.getsockname()[0]
        except OSError:
            return "127.0.0.1"


class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


def main() -> int:
    os.chdir(ROOT)
    handler = http.server.SimpleHTTPRequestHandler

    with ReusableTCPServer(("0.0.0.0", PORT), handler) as httpd:
        local_url = f"http://localhost:{PORT}/"
        lan_ip = get_lan_ip()
        lan_url = f"http://{lan_ip}:{PORT}/"

        print("")
        print("Juyu Email Signature Builder")
        print(f"Local: {local_url}")
        print(f"Share: {lan_url}")
        print("")
        print("Tip: devices on the same Wi-Fi can open the Share URL.")
        print("Press Ctrl+C to stop the server.")
        print("")

        webbrowser.open(local_url)

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
            return 0


if __name__ == "__main__":
    sys.exit(main())
