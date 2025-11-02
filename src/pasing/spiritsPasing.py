import os
import re
import json
from bs4 import BeautifulSoup

# 경로 설정
html_file = r"C:\Users\james\spirit_dps_v2\src\pasing\spiritsDataHtml.txt"
out_file = r"C:\Users\james\spirit_dps_v2\src\data\spiritsData.js"

with open(html_file, "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f, "html.parser")

spirits = []

# 속성 매핑 (한국어 + 일본어)
def map_element(k):
    k = k.strip()
    if any(x in k for x in ["잔디", "풀", "木"]): return "풀"
    if any(x in k for x in ["화", "불", "火"]): return "불"
    if any(x in k for x in ["수", "물", "水"]): return "물"
    if any(x in k for x in ["광", "빛", "光"]): return "빛"
    if any(x in k for x in ["암", "어둠", "闇"]): return "어둠"
    return "기타"

# 일본어 패턴 대응 정규식
atk_coef_re  = re.compile(r'攻撃力係数[:：]?\s*([\d.]+)')
atk_speed_re = re.compile(r'攻撃速度[:：]?\s*([\d.]+)')
damage_re    = re.compile(r'([\d,\.]+)%のダメージ')
hit_re       = re.compile(r'(\d+)回')
cd_re        = re.compile(r'クールタイム[:：]?\s*([\d.]+)秒')
type_buff_re = re.compile(r'(火|水|木|光|闇)属性.*?(\d+(?:\.\d+)?)%')
char_buff_re = re.compile(r'キャラ.*?(\d+(?:\.\d+)?)%')
duration_re  = re.compile(r'(\d+)秒間')

# 정령 리스트 파싱
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
        img_name = f"{name}.png".replace("/", "_")

        attr_text = tds[1].get_text(" ", strip=True)
        desc = tds[2].get_text(" ", strip=True)

        element_type = map_element(attr_text)

        # 공격력 계수 / 공격속도
        m = atk_coef_re.search(desc)
        attack_coef = float(m.group(1)) if m else 0.0
        m = atk_speed_re.search(desc)
        attack_speed = float(m.group(1)) if m else 0.0

        # 데미지 및 타수
        m = damage_re.search(desc)
        element_damage_percent = float(m.group(1).replace(",", "")) if m else 0.0
        m = hit_re.search(desc)
        element_damage_hitCount = int(m.group(1)) if m else (1 if element_damage_percent > 0 else 0)

        # 쿨타임
        m = cd_re.search(desc)
        element_damage_delay = float(m.group(1)) if m else 0.0

        # 버프
        fire = water = grass = light = dark = 0.0
        for tm, val in type_buff_re.findall(desc):
            val = float(val)
            if tm == "火": fire = max(fire, val)
            elif tm == "水": water = max(water, val)
            elif tm == "木": grass = max(grass, val)
            elif tm == "光": light = max(light, val)
            elif tm == "闇": dark = max(dark, val)

        m = char_buff_re.search(desc)
        character_type_buff = float(m.group(1)) if m else 0.0

        m = duration_re.search(desc)
        element_type_buff_time = int(m.group(1)) if m else 10000

        spirits.append({
            "name": name,
            "image": f"./resouce/spirits/{img_name}",
            "grade": grade,
            "공격력 계수": attack_coef,
            "공격속도": attack_speed,
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
            "element_damage_delay": element_damage_delay,
            "comment": desc
        })

# JS 파일로 저장
js_text = "export const spiritsData = " + json.dumps(spirits, ensure_ascii=False, indent=2)
os.makedirs(os.path.dirname(out_file), exist_ok=True)
with open(out_file, "w", encoding="utf-8") as f:
    f.write(js_text)

print(f"[OK] {len(spirits)}개 정령 데이터 저장 완료 (일본어 기반 파싱).")
