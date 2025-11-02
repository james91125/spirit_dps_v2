import os
import re
import json
from bs4 import BeautifulSoup

# 경로 설정
html_file = r"C:\Users\james\spirit_dps_v2\src\pasing\spirits2DataHtml.txt"  # 새 속성 페이지
data_file = r"C:\Users\james\spirit_dps_v2\src\data\spiritsData.js"          # 기존 데이터
output_file = data_file  # 덮어쓰기

# -----------------------------
# 1️⃣ HTML 파싱하여 정령 이름 + 속성 추출
# -----------------------------
with open(html_file, "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f, "html.parser")

def map_element_jp(k):
    if any(x in k for x in ["火"]): return "불"
    if any(x in k for x in ["水"]): return "물"
    if any(x in k for x in ["木", "草"]): return "풀"
    if any(x in k for x in ["光"]): return "빛"
    if any(x in k for x in ["闇"]): return "어둠"
    return ""

element_map = {}

for tr in soup.select("tbody tr"):
    tds = tr.find_all("td")
    if len(tds) < 2:
        continue
    img_tag = tr.find("img")
    if not img_tag:
        continue
    name = img_tag.get("alt", "").strip()
    attr_text = tds[1].get_text(" ", strip=True)
    element_type = map_element_jp(attr_text)
    if name and element_type:
        element_map[name] = element_type

print(f"[INFO] {len(element_map)}개 정령 속성 추출 완료")

# -----------------------------
# 2️⃣ 기존 spiritsData.js 로드
# -----------------------------
def extract_json(js_text):
    js_text = re.sub(r'//.*', '', js_text)
    js_text = re.sub(r'export\s+const\s+\w+\s*=\s*', '', js_text)
    js_text = re.sub(r'export\s+default\s+\w+;?', '', js_text)
    js_text = js_text.replace(';', '')
    match = re.search(r'\[.*\]', js_text, re.S)
    if not match:
        raise ValueError("❌ JSON 배열을 찾을 수 없습니다.")
    json_str = match.group(0)
    return json.loads(json_str)

with open(data_file, "r", encoding="utf-8") as f:
    data_text = f.read()
    spirits = extract_json(data_text)

# -----------------------------
# 3️⃣ 이름 기준으로 element_type 업데이트
# -----------------------------
updated_count = 0
for s in spirits:
    name = s.get("name")
    if name in element_map:
        s["element_type"] = element_map[name]
        updated_count += 1

print(f"[UPDATE] {updated_count}개 정령의 element_type 갱신 완료")

# -----------------------------
# 4️⃣ JS 파일로 다시 저장
# -----------------------------
js_text = "export const spiritsData = " + json.dumps(spirits, ensure_ascii=False, indent=2)
os.makedirs(os.path.dirname(output_file), exist_ok=True)
with open(output_file, "w", encoding="utf-8") as f:
    f.write(js_text)

print(f"[✅ OK] spiritsData.js 업데이트 완료 → {output_file}")
