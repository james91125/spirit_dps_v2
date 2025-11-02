import json
import re
import os

# =====================================================================================
# CONFIGURATION
# =====================================================================================

FILE_PATHS = [
    r"C:\Users\james\spirit_dps_v2\src\data\spiritsData.js",
    r"C:\Users\james\spirit_dps_v2\src\data\skillData.js",
]

# 순서가 중요: 긴 이름(특정) -> 짧은 이름(일반)
GRADE_MAP = [
    ('아카식', '아카식'),
    ('엠피리언', '엠피리안'), # 엠피리안으로 통일
    ('엠피리안', '엠피리안'),
    ('엘더', '엘더'),
    ('인피니티', '인피니티'),
    ('이터널', '이터널'),
    ('미스틱', '미스틱'),
    ('디바인', '디바인'),
    ('레전더리', '레전더리'),
    ('전설', '레전더리'),
    ('에픽', '에픽'),
    ('유니크', '유니크'),
    ('독특한', '유니크'),
    ('레어', '레어'),
    ('희귀', '레어'),
    ('매직', '매직'),
    ('노멀', '노말'),
    ('노말', '노말'),
    ('목차', '목차'),
]

# =====================================================================================
# SCRIPT LOGIC
# =====================================================================================

def extract_data_from_js(js_content, filename):
    # JS에서 변수 이름과 배열(JSON) 부분을 추출 (세미콜론 옵셔널, export default 처리)
    match = re.search(r"export\s+const\s+([a-zA-Z0-9_]+)\s*=\s*(\[.*?\]);?", js_content, re.DOTALL)
    if not match:
        match = re.search(r"const\s+([a-zA-Z0-9_]+)\s*=\s*(\[.*?\]);?", js_content, re.DOTALL)
        if not match:
            raise ValueError(f"Could not extract data array from {filename}")

    variable_name, json_str = match.groups()

    # JSON 파싱을 위해 문자열 정리
    json_str = re.sub(r"//.*", "", json_str)
    json_str = re.sub(r",(\s*[\\\]}}])", r"\1", json_str)
    json_str = json_str.replace("'", '"')
    json_str = re.sub(r'([{{,]\s*)([a-zA-Z0-9_]+)\s*:', r'\1"\2":', json_str)

    try:
        data = json.loads(json_str)
        return data, variable_name
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON from {filename}: {e}")
        raise

def standardize_file(filepath):
    print(f"Processing {os.path.basename(filepath)}...")
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_data, var_name = extract_data_from_js(content, filepath)
        updated_count = 0

        for item in original_data:
            if 'grade' in item and isinstance(item['grade'], str):
                original_grade = item['grade']
                found = False
                for key, new_grade in GRADE_MAP:
                    if key in original_grade:
                        if original_grade != new_grade:
                            item['grade'] = new_grade
                            updated_count += 1
                        found = True
                        break
                if not found:
                    print(f"  - Warning: No grade mapping found for '{original_grade}'")

        if updated_count > 0:
            js_output = f"export const {var_name} = {json.dumps(original_data, ensure_ascii=False, indent=2)};"
            if "skillData" in var_name:
                 js_output += "\n\nexport default skillData;"

            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(js_output)
            print(f"  - Success: Standardized {updated_count} grade(s).")
        else:
            print("  - No changes needed.")

    except Exception as e:
        print(f"  - Error processing file: {e}")

if __name__ == "__main__":
    for path in FILE_PATHS:
        standardize_file(path)
    print("\nGrade standardization complete.")
