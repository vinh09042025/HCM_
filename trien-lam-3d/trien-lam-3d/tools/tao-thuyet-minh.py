#!/usr/bin/env python3
"""Thu âm lời thuyết minh tiếng Việt cho bảo tàng 3D.

Cách dùng:
  1. Mở trang, gõ trong Console:  copy(JSON.stringify(museumNarrationTexts()))
     rồi dán vào tools/narration-lines.json (mảng các câu).
  2. Tải giọng Piper tiếng Việt (giọng nữ VAIS1000):
     https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-vi_VN-vais1000-medium.tar.bz2
  3. pip install sherpa-onnx soundfile numpy ; cần có ffmpeg.
  4. python3 tools/tao-thuyet-minh.py --model <thư-mục-giọng> [--force]

Tên file MP3 = mã băm FNV-1a 32 bit (UTF-8) của câu đã chuẩn hóa khoảng trắng,
trùng với hàm narrationClipId() trong script.js.
"""
import argparse, json, os, re, subprocess, sys, tempfile
import numpy as np, soundfile as sf, sherpa_onnx
sys.path.insert(0, os.path.dirname(__file__))
from vnnorm import normalize

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'audio', 'thuyet-minh')

def clip_id(text):
    h = 0x811c9dc5
    for b in re.sub(r'\s+', ' ', text).strip().encode('utf-8'):
        h ^= b
        h = (h * 0x01000193) & 0xffffffff
    return f'{h:08x}'

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--model', required=True)
    ap.add_argument('--lines', default=os.path.join(ROOT, 'tools', 'narration-lines.json'))
    ap.add_argument('--speed', type=float, default=0.92)
    ap.add_argument('--force', action='store_true')
    a = ap.parse_args()
    name = [f for f in os.listdir(a.model) if f.endswith('.onnx')][0]
    tts = sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
        vits=sherpa_onnx.OfflineTtsVitsModelConfig(model=os.path.join(a.model, name), tokens=os.path.join(a.model, 'tokens.txt'),
                                                   data_dir=os.path.join(a.model, 'espeak-ng-data')), num_threads=4)))
    lines = json.load(open(a.lines, encoding='utf-8'))
    os.makedirs(OUT, exist_ok=True)
    ids = []
    for text in lines:
        cid = clip_id(text)
        ids.append(cid)
        dst = os.path.join(OUT, cid + '.mp3')
        if os.path.exists(dst) and not a.force:
            continue
        audio = tts.generate(normalize(text), sid=0, speed=a.speed)
        pad = np.zeros(int(audio.sample_rate * 0.18), dtype=np.float32)
        samples = np.concatenate([pad, np.asarray(audio.samples, dtype=np.float32), pad])
        with tempfile.NamedTemporaryFile(suffix='.wav') as wav:
            sf.write(wav.name, samples, audio.sample_rate)
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav.name, '-af', 'highpass=f=70,loudnorm=I=-17:TP=-1.5:LRA=9',
                            '-ar', '22050', '-ac', '1', '-codec:a', 'libmp3lame', '-b:a', '48k', dst], check=True)
        print(cid, text[:70])
    keep = set(ids)
    for f in os.listdir(OUT):
        if f.endswith('.mp3') and f[:-4] not in keep:
            os.remove(os.path.join(OUT, f))
    json.dump({'voice': 'Piper vi_VN vais1000 (giọng nữ tiếng Việt)', 'clips': sorted(keep)}, open(os.path.join(OUT, 'manifest.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('Tổng số câu:', len(keep))

if __name__ == '__main__':
    main()
