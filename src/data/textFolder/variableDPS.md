# DPS 계산에 사용되는 변수 목록 (2025년 11월 4일 기준)

## 1. UI 입력 (`uiBuffs` 객체)

| 변수명 | 설명 |
| :--- | :--- |
| `Attack` | 캐릭터의 기본 공격력 |
| `charAttackSpeed` | 캐릭터의 기본 공격 속도 |
| `attackAmplify` | 공격력 증폭(%) 값 |
| `critChance` | 치명타 확률(%) |
| `critDamage` | 치명타 피해(%) |
| `spiritAttackAmplify` | 정령 공격력 증폭(%) 값 |
| `fireAmplify` | 불 타입 공격력 증폭(%) |
| `waterAmplify` | 물 타입 공격력 증폭(%) |
| `grassAmplify` | 풀 타입 공격력 증폭(%) |
| `lightAmplify` | 빛 타입 공격력 증폭(%) |
| `darkAmplify` | 어둠 타입 공격력 증폭(%) |

## 2. 데이터 파일 (`spiritsData.js`, `skillData.js`)

| 변수명 | 파일 | 설명 |
| :--- | :--- | :--- |
| `공격력 계수` | spiritsData | 정령의 기본 공격력 계수 |
| `공격속도` | spiritsData | 정령의 초당 공격 횟수 |
| `character_type_buff` | spiritsData | 정령이 제공하는 캐릭터 공격력 증폭 버프(%) |
| `element_damage_percent` | spiritsData | 정령 자체 스킬의 데미지 계수(%) |
| `element_damage_hitCount`| spiritsData | 정령 자체 스킬의 타격 횟수 |
| `element_damage_delay` | spiritsData | 정령 자체 스킬의 쿨타임(초) |
| `damagePercent` | skillData | 캐릭터 스킬의 데미지 계수(%) |
| `hitCount` | skillData | 캐릭터 스킬의 타격 횟수 |
| `coolTime` | skillData | 캐릭터 스킬의 쿨타임(초) |

## 3. 팀 컨텍스트 (`teamContext` 객체)

| 변수명 | 설명 |
| :--- | :--- |
| `spiritCharBuff` | 팀 내 정령들이 캐릭터에게 제공하는 총 공격력 증폭(%) |
| `totalElementBuffs` | 팀 내 정령들이 각 속성별로 제공하는 총 속성 공격력 증폭(%) |

## 4. 주요 내부 계산 변수

| 변수명 | 설명 |
| :--- | :--- |
| `simTime` | DPS 계산을 위한 시뮬레이션 시간(초) |
| `casts` | `simTime` 동안 스킬을 시전하는 횟수 (`floor(simTime / coolTime)`) |
| `charTotalAmplify` | 캐릭터의 총 공격력 증폭 (UI입력 + 정령버프) |
| `charNonCritDamagePerHit` | 캐릭터의 비치명타 1회 공격 데미지 |
| `charCritDamagePerHit` | 캐릭터의 치명타 1회 공격 데미지 |
| `charDamagePerHit` | 캐릭터의 평균 1회 공격 데미지 (치명타 고려) |
| `charDPS` | 캐릭터의 평타 DPS |
| `spiritMultiplier` | 정령의 최종 데미지 배율 (계수 + 증폭) |
| `spiritAAResult.damagePerHit` | 정령의 평타 1회 데미지 |
| `spiritAAResult.dps` | 정령의 평타 DPS |
| `spiritSkillResult.totalDamage` | `simTime` 동안 정령 스킬이 가하는 총 데미지 |
| `spiritSkillResult.dps` | 정령 스킬의 DPS |
| `skillResult.totalDamage` | `simTime` 동안 캐릭터 스킬이 가하는 총 데미지 |
| `skillResult.dps` | 캐릭터 스킬의 DPS |
