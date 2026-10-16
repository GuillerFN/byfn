#!/usr/bin/env python3
"""Atualiza catalogo.json com os dados públicos do Apps Script da by FN.

Usado pelo GitHub Actions. Nunca escreve no Google Sheets.
"""
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'catalogo.json'
ENDPOINT = os.environ.get('BYFN_APPS_SCRIPT_URL', 'https://script.google.com/macros/s/AKfycbzJWrVQ9Nnp5nUUsIoPFaGEwPdeaHj40cWPHSMFpEm1xkE-jzO_eB8wGUcpocDpkKuX/exec')
CALLBACK = 'byfnSyncCatalogo'


def decode_response(body):
    body = body.strip()
    # Suporta JSON puro e JSONP retornado pelo Google Apps Script.
    if body.startswith('{'):
        return json.loads(body)
    match = re.match(r'^\s*(?:/\*.*?\*/\s*)?'+CALLBACK+r'\s*\(\s*', body, re.S)
    if not match:
        raise ValueError('A integração não retornou JSON ou JSONP esperado')
    payload, _ = json.JSONDecoder().raw_decode(body[match.end():])
    return payload


def validate(payload):
    if not isinstance(payload, dict) or payload.get('sucesso') is not True:
        raise ValueError('A API retornou uma resposta sem sucesso')
    if not isinstance(payload.get('colecoes'), list) or not isinstance(payload.get('produtos'), list):
        raise ValueError('A API não retornou listas de colecoes/produtos')
    if not payload['colecoes'] or not payload['produtos']:
        raise ValueError('Resposta vazia: catálogo anterior foi preservado por segurança')
    for p in payload['produtos']:
        if not isinstance(p, dict) or not p.get('id') or not p.get('nome'):
            raise ValueError('Produto sem identificação: catálogo anterior preservado')
    return payload


def download():
    params = urllib.parse.urlencode({'callback': CALLBACK, '_': int(time.time())})
    url = ENDPOINT + ('&' if '?' in ENDPOINT else '?') + params
    req = urllib.request.Request(url, headers={'User-Agent': 'byFN-catalog-sync/1.0', 'Accept': 'application/javascript,application/json,text/plain,*/*'})
    with urllib.request.urlopen(req, timeout=45) as response:
        return validate(decode_response(response.read().decode('utf-8-sig')))


def main():
    error = None
    for attempt in range(1, 4):
        try:
            payload = download()
            DEST.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
            print(f'Catálogo atualizado: {len(payload["colecoes"])} coleções, {len(payload["produtos"])} produtos')
            return
        except Exception as exc:
            error = exc
            print(f'Tentativa {attempt}/3 falhou: {exc}', file=sys.stderr)
            if attempt < 3:
                time.sleep(5)
    raise SystemExit(f'Falha na sincronização; arquivo existente não foi apagado. Detalhe: {error}')


if __name__ == '__main__':
    main()
