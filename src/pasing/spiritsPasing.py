import os
import re
import json
import requests
from bs4 import BeautifulSoup

# 경로 설정
html_file = r"C:\Users\james\spirit_dps_v2\public\resouce\spiritsDataHtml.txt"
img_dir = r"C:\Users\james\spirit_dps_v2\public\resouce\spirits"
out_file = r"C:\Users\james\spirit_dps_v2\src\data\spiritsData.js"

os.makedirs(img_dir, exist_ok=True)

with open(html_file, "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f, "html.parser")

spirits = []

# 속성 매핑 함수
def map_element(k):
    k = k.strip()
    if "잔디" in k: return "풀"
    if "화" in k:   return "불"
    if "수" in k:   return "물"
    if "광" in k:   return "빛"
    if "암" in k:   return "어둠"
    return ""

# 정규식 정의
damage_re = re.compile(r'(\d+(?:\.\d+)?)%\s*(?:의)?\s*(?:데미지|피해)', re.I)
hit_re    = re.compile(r'(\d+)\s*(?:번|회)\b')
ctype_re  = re.compile(r'캐릭터의\s*공격력(?:\s*증폭)?[^0-9]*(\d+(?:\.\d+)?)%[^)]*증가')
type_re   = re.compile(r'(화|수|잔디|광|암)정령\s*타입의\s*공격력이\s*(\d+(?:\.\d+)?)%')
dur_re    = re.compile(r'(\d+)\s*초간')
cd_re     = re.compile(r'\(쿨타임\s*([\d.]+)\s*초\)')

# h2가 등급 구분
for h2 in soup.find_all("h2"):
    grade = h2.get_text(strip=True)
    table = h2.find_next("table")
    if not table:
        continue

    for tr in table.select("tbody tr"):
        tds = tr.find_all("td")
        if len(tds) < 3:
            continue

        img_tag = tr.find("img")
        if not img_tag:
            continue

        name = img_tag.get("alt", "").strip()
        img_url = img_tag["src"]
        attr_text = tds[1].get_text(" ", strip=True)
        desc = tds[2].get_text(" ", strip=True)

        element_type = map_element(attr_text)

        # 데미지 및 타수
        m = damage_re.search(desc)
        element_damage_percent = float(m.group(1)) if m else 0.0
        m = hit_re.search(desc)
        element_damage_hitCount = int(m.group(1)) if m else (1 if element_damage_percent > 0 else 0)

        # 쿨타임 (새로운 필드 element_damage_delay)
        m = cd_re.search(desc)
        element_damage_delay = float(m.group(1)) if m else 0.0

        # 버프 처리
        fire = water = grass = light = dark = 0.0
        for tm, val in type_re.findall(desc):
            valf = float(val)
            if tm == "화": fire = max(fire, valf)
            elif tm == "수": water = max(water, valf)
            elif tm == "잔디": grass = max(grass, valf)
            elif tm == "광": light = max(light, valf)
            elif tm == "암": dark = max(dark, valf)

        m = ctype_re.search(desc)
        character_type_buff = float(m.group(1)) if m else 0.0

        m = dur_re.search(desc)
        element_type_buff_time = int(m.group(1)) if m else 10000

        # 이미지 저장
        img_name = f"{name}.png".replace("/", "_")
        save_path = os.path.join(img_dir, img_name)
        if not os.path.exists(save_path):
            try:
                r = requests.get(img_url)
                if r.ok:
                    with open(save_path, "wb") as f:
                        f.write(r.content)
            except Exception as e:
                print(f"[이미지 실패] {name}: {e}")

        # JSON 구성
        spirit_data = {
            "name": name,
            "image": f"./resouce/spirits/{img_name}",
            "grade": grade,
            "공격력 계수": 0,   # HTML에 없음
            "공격속도": 0,     # HTML에 없음
            "element_type": element_type,
            "light_type_buff": light,
            "dark_type_buff": dark,
            "fire_type_buff": fire,
            "water_type_buff": water,
            "grass_type_buff": grass,
            "character_type_buff": character_type_buff,
            "element_type_buff_time": element_type_buff_time,
            "element_damage_percent": element_damage_percent,
            "element_damage_hitCount": element_damage_hitCount,
            "element_damage_delay": element_damage_delay,   # ✅ 추가됨
            "comment": desc
        }

        spirits.append(spirit_data)

# JS 파일로 저장
js_text = "export const spiritsData = " + json.dumps(spirits, ensure_ascii=False, indent=2)
os.makedirs(os.path.dirname(out_file), exist_ok=True)
with open(out_file, "w", encoding="utf-8") as f:
    f.write(js_text)

print(f"[OK] {len(spirits)}개 정령 데이터 저장 완료 (쿨타임 포함).")
