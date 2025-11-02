import os, re, json, requests
from bs4 import BeautifulSoup

# 경로 설정
html_file = r"C:\Users\james\spirit_dps_v2\public\resouce\skillDataHtml.txt"
img_dir = r"C:\Users\james\spirit_dps_v2\public\resouce\skill"
out_file = r"C:\Users\james\spirit_dps_v2\src\data\skillData.js"

os.makedirs(img_dir, exist_ok=True)

# HTML 로드
with open(html_file, "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f, "html.parser")

skills = []

def extract_num(text, pattern):
    m = re.search(pattern, text)
    return float(m.group(1)) if m else None

def extract_hit(text):
    m = re.search(r"(\d+)번", text)
    return int(m.group(1)) if m else 1

# 각 h2(등급) 기준으로 순회
for h2 in soup.find_all("h2"):
    grade = h2.get_text(strip=True)
    table = h2.find_next("table")
    if not table:
        continue

    for tr in table.select("tbody tr"):
        img_tag = tr.find("img")
        if not img_tag:
            continue

        name = img_tag.get("alt", "").strip()
        img_url = img_tag["src"]

        tds = tr.find_all("td")
        if len(tds) < 2:
            continue
        desc = tds[1].get_text(" ", strip=True)

        cooltime = extract_num(desc, r"쿨타임[:：]?\s*([\d.]+)")
        dmg = extract_num(desc, r"(\d+)%의 데미지")
        hits = extract_hit(desc)
        comment = desc.strip()

        # 이미지 저장
        img_name = f"{name}.png".replace("/", "_")
        img_path = os.path.join(img_dir, img_name)
        if not os.path.exists(img_path):
            try:
                r = requests.get(img_url)
                if r.ok:
                    with open(img_path, "wb") as f:
                        f.write(r.content)
            except Exception as e:
                print(f"[오류] {name} 이미지 저장 실패: {e}")

        skills.append({
            "name": name,
            "image": f"./resouce/skill/{img_name}",
            "grade": grade,
            "cooltime": cooltime,
            "damagePercent": dmg,
            "hitCount": hits,
            "comment": comment
        })

# JS 파일 생성
js_content = "export const skillData = " + json.dumps(skills, ensure_ascii=False, indent=2)
os.makedirs(os.path.dirname(out_file), exist_ok=True)
with open(out_file, "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"[OK] {len(skills)}개 스킬 저장 완료.")
