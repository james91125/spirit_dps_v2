import { num, ELEMENT_MAP } from './constants';

export function createTeamContext(team) {
  const context = {
    sharedBuffs: { '불': 0, '물': 0, '풀': 0, '빛': 0, '어둠': 0 },
    characterBuffs: { total: 0 },
    activeBuffs: {},
  };
  team.forEach(s => {
    if (!s) return;
    Object.keys(context.sharedBuffs).forEach(el => {
      const key = `${ELEMENT_MAP[el]}_type_buff`;
      context.sharedBuffs[el] += num(s[key]);
    });
    context.characterBuffs.total += num(s.character_type_buff);

    const comment = s.comment || '';
    const ampMatch = comment.match(/캐릭터의 공격력 증폭이 (\d+)초간 ([\d,.]+)% 증가합니다/);
    if(s.element_type_buff_time > 0 && s.element_damage_percent > 0) {
        context.activeBuffs[s.name] = { type: 'spirit_amp', value: s.element_damage_percent };
    } else if (ampMatch) {
       context.activeBuffs[s.name] = { type: 'char_amp', value: num(ampMatch[2]) };
    }
  });
  return context;
}