"""Contrôles sans dépendance du site statique de Barsac."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import sys

ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = sorted(ROOT.glob("*.html"))
ERRORS = []

class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []
        self.ids = set()
    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        if "id" in data:
            if data["id"] in self.ids:
                ERRORS.append(f"identifiant dupliqué: {data['id']}")
            self.ids.add(data["id"])
        for key in ("href", "src", "srcset"):
            if key in data:
                self.refs.append(data[key].split()[0])

for page in HTML_FILES:
    source = page.read_text(encoding="utf-8")
    parser = References()
    parser.feed(source)
    for ref in parser.refs:
        parsed = urlsplit(ref)
        if parsed.scheme or ref.startswith(("//", "#", "mailto:", "tel:")):
            continue
        local_path = unquote(parsed.path).lstrip("/") if parsed.path.startswith("/") else unquote(parsed.path)
        target = (ROOT / local_path).resolve() if parsed.path.startswith("/") else (page.parent / local_path).resolve()
        if parsed.path and not target.exists():
            ERRORS.append(f"{page.name}: cible absente {parsed.path}")

index = (ROOT / "index.html").read_text(encoding="utf-8")
for required in ("10970", "914", "11891", "mairie.barsac@orange.fr", 'id="contact-form"'):
    if required not in index and required not in (ROOT / "assets/js/main.js").read_text(encoding="utf-8"):
        ERRORS.append(f"configuration requise absente: {required}")

if "fonts.googleapis.com" in index or "fonts.gstatic.com" in index:
    ERRORS.append("police Google distante encore présente")

runtime_files = ["package.json", "knexfile.js", ".env", "server"]
for name in runtime_files:
    if (ROOT / name).exists():
        ERRORS.append(f"élément serveur inattendu: {name}")

if ERRORS:
    print("ÉCHEC")
    print("\n".join(f"- {error}" for error in ERRORS))
    sys.exit(1)
print(f"OK — {len(HTML_FILES)} pages HTML contrôlées")
