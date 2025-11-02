import json
import re
import os

# --- 설정 ---
# 입력 파일 경로
spirits_file_1 = r"C:\Users\james\spirit_dps_v2\src\data\spiritsData.js"     # 메인 데이터 (스킬, 등급, 이미지 등)
spirits_file_2 = r"C:\Users\james\spirit_dps_v2\src\data\spiritsData2.js"    # 보조 데이터 (공격력 계수, 공격 속도, 속성)

# 출력 파일 경로
output_file    = r"C:\Users\james\spirit_dps_v2\src\data\spiritsData_merged.js"

# 이름 매핑 (spiritsData.js -> spiritsData2.js)
# 두 파일 간에 이름이 다른 경우 여기에 추가합니다.
NAME_MAP = {
    "지구 정복 Nyan Chichi": "지구 정복 냥이 치치",
    "카이사르 카지하라": "카이사르 강태식",
    "구미의 여우": "구미호",
    "플루트": "플루토",
    "앰브라": "움브라",
    "램": "람",
    "헬하운드": "헬 하운드",
    "서리 팡": "프로스트 팽",
    "밴드": "반드",
    "뿌리": "루트",
    "블리스": "브리스",
    "토렌트": "트렌트",
    "갈라하드": "갤러해드",
    "살라맨더": "샐러맨더",
    "프린샤": "프린셔",
    "레그날": "레그나르",
    "알디스": "아르디스",
    "위스프": "위습",
    "볼레토스": "볼레투스",
    "엘리셔스": "에리셔스",
}

# 속성 매핑 (영문 -> 한글)
ELEMENT_MAP = {
    "FIRE": "불",
    "WATER": "물",
    "GRASS": "풀",
    "LIGHT": "빛",
    "DARK": "어둠",
}

# --- 로직 ---

def extract_json_from_js(js_content, filename):
    """
    JavaScript 파일 내용에서 주석과 export 구문을 제거하고 JSON 배열을 추출합니다.
    """
    # 주석 및 export 구문 제거
    content = re.sub(r'//.*', '', js_content)
    content = re.sub(r'export\s+default\s+\w+;?', '', content)
    content = re.sub(r'export\s+const\s+\w+\s*=\s*', '', content)
    content = re.sub(r'const\s+\w+\s*=\s*', '', content)
    content = content.replace(';', '').strip()

    # 키에 따옴표 추가 및 작은따옴표를 큰따옴표로 변경
    content = content.replace("'", '"')
    # JS 객체 키(따옴표가 없는)를 JSON 형식(따옴표가 있는)으로 변환
    content = re.sub(r'([a-zA-Z_][a-zA-Z0-9_]*)\s*:', r'"\1":', content)

    # 배열 부분만 추출
    match = re.search(r'\[.*\]', content, re.DOTALL)
    if not match:
        raise ValueError(f"'{filename}' 파일에서 JSON 배열을 찾을 수 없습니다.")
    
    json_str = match.group(0)
    # 후행 쉼표 제거
    json_str = re.sub(r',(\s*[}\]])', r'\1', json_str)

    try:
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        # 오류 발생 시 디버깅 정보 출력
        error_pos = e.pos
        start = max(0, error_pos - 80)
        end = min(len(json_str), error_pos + 80)
        snippet = json_str[start:end]
        print(f"❌ '{filename}' 파일 JSON 파싱 오류: {e.msg}")
        print(f"   위치: {e.lineno}:{e.colno} (pos {e.pos})")
        print(f"   내용 일부: ...{snippet}...")
        raise

def load_js_file(path):
    """JS 파일을 읽고 파싱하여 Python 객체로 반환합니다."""
    filename = os.path.basename(path)
    print(f"🔄 '{filename}' 파일을 로드합니다...")
    with open(path, "r", encoding="utf-8-sig") as f:
        return extract_json_from_js(f.read(), filename)

def main():
    """메인 실행 함수"""
    # 데이터 로드
    spirits_main = load_js_file(spirits_file_1)
    spirits_sub = load_js_file(spirits_file_2)
    print(f"  - 메인 데이터: {len(spirits_main)}개")
    print(f"  - 보조 데이터: {len(spirits_sub)}개")

    # 보조 데이터를 이름으로 쉽게 찾을 수 있도록 딕셔너리로 변환
    sub_dict = {s["name"]: s for s in spirits_sub}

    merged_data = []
    updated_count = 0
    not_found_names = set()

    print("\n🔄 데이터를 병합합니다...")
    for spirit in spirits_main:
        original_name = spirit.get("name")
        if not original_name:
            merged_data.append(spirit)
            continue

        # 이름 매핑을 사용하여 보조 데이터에서 해당 정령 찾기
        lookup_name = NAME_MAP.get(original_name, original_name)

        if lookup_name in sub_dict:
            sub_spirit_data = sub_dict[lookup_name]
            
            # "공격력 계수", "공격속도", "element_type" 필드 업데이트
            spirit["공격력 계수"] = sub_spirit_data.get("character_attack_coef", spirit.get("공격력 계수"))
            spirit["공격속도"] = sub_spirit_data.get("character_attack_speed", spirit.get("공격속도"))
            
            sub_element = sub_spirit_data.get("element_type")
            if sub_element in ELEMENT_MAP:
                spirit["element_type"] = ELEMENT_MAP[sub_element]

            updated_count += 1
        else:
            # 보조 데이터에 없는 경우, 이름을 집합에 추가
            not_found_names.add(original_name)
        
        merged_data.append(spirit)

    # 병합 결과 저장
    print(f"💾 '{os.path.basename(output_file)}' 파일로 저장합니다...")
    with open(output_file, "w", encoding="utf-8") as f:
        # JS export 구문과 함께 JSON 데이터 저장
        f.write("export const spiritsData = " + json.dumps(merged_data, ensure_ascii=False, indent=2))
        f.write(";\n")

    print("\n---")
    print(f"✅ 병합 완료! 총 {len(merged_data)}개의 정령 데이터를 처리했습니다.")
    print(f"  - 업데이트된 정령 수: {updated_count}개")

    # 보조 데이터에 없어 업데이트되지 않은 정령 목록 출력
    if not_found_names:
        print(f"  - ⚠️ {len(not_found_names)}개의 정령은 보조 데이터에 없어 업데이트되지 않았습니다:")
        for name in sorted(list(not_found_names)):
            print(f"    - {name}")
    print("---\\n")


if __name__ == "__main__":
    main()