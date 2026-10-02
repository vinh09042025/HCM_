import re
D=['không','một','hai','ba','bốn','năm','sáu','bảy','tám','chín']
def two(n, full=False):
    t,u=divmod(n,10)
    if t==0: return ('linh '+D[u]) if full else D[u]
    if t==1: s='mười'
    else: s=D[t]+' mươi'
    if u==0: return s
    if u==1 and t>1: return s+' mốt'
    if u==5: return s+' lăm'
    if u==4 and t>1: return s+' tư'
    return s+' '+D[u]
def three(n, full=False):
    h,r=divmod(n,100)
    if h==0 and not full: return two(r) if r else ''
    s=D[h]+' trăm'
    if r==0: return s
    return s+' '+two(r, full=True)
def num(n):
    n=int(n)
    if n<10: return D[n]
    if n<100: return two(n)
    if n<1000: return three(n)
    th,r=divmod(n,1000)
    s=three(th) + ' nghìn'
    if r==0: return s
    return s+' '+three(r, full=True)
ROMAN={'I':'một','II':'hai','III':'ba','XX':'hai mươi','XIX':'mười chín'}
def normalize(t):
    t=t.replace('Tours','Tua').replace('radio','ra-đi-ô').replace('microphone','mi-crô').replace('micro','mi-crô').replace(' – ',', ')
    t=re.sub(r'[Tt]hập niên (\d\d)(\d\d)', lambda m: ('Thập' if t[m.start()]=='T' else 'thập')+' niên '+num(m.group(2)), t)
    t=re.sub(r'(\d{4})\s*[–-]\s*(\d{4})', lambda m: f'từ năm {num(m.group(1))} đến năm {num(m.group(2))}', t)
    t=re.sub(r'(?:(ngày)\s+)?\b(\d{1,2})/(\d{1,2})/(\d{4})\b', lambda m: f'{m.group(1) or "ngày"} {num(m.group(2))} tháng {num(m.group(3))} năm {num(m.group(4))}', t, flags=re.I)
    t=re.sub(r'(?:tháng\s+)?\b(\d{1,2})/(\d{4})\b', lambda m: f'tháng {num(m.group(1))} năm {num(m.group(2))}', t)
    t=re.sub(r'\b(khóa|Thế kỷ|thế kỷ) ([IVX]+)\b', lambda m: m.group(1)+' '+ROMAN[m.group(2)], t)
    t=re.sub(r'\d+', lambda m: num(m.group(0)), t)
    t=t.replace('·', ',').replace('–', ',').replace('  ',' ')
    return t
if __name__=='__main__':
    for x in [0,1,4,5,10,11,14,15,21,24,25,105,110,1911,1945,1920,1955,1969,2009,1890,1941]: print(x,num(x))
