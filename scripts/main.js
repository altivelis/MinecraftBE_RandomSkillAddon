import * as mc from "@minecraft/server";
import { skillList } from "./skillList";
import "./skills/index";
import "./commands/index";

mc.system.runInterval(() => {
  const players = mc.world.getPlayers();
  // 毎日0時にスキルをリセットする
  if (mc.world.getTimeOfDay() == 0) {
    players.forEach(player => {
      setRandomSkill(player);
      player.setDynamicProperty("day", mc.world.getDay())
    });
  }
})

// ワールド参加時、日が変わっている場合はスキルをリセットする
mc.world.afterEvents.playerSpawn.subscribe(data=>{
  const player = data.player;
  if(!data.initialSpawn) return; // 初回スポーン時のみ実行
  const lastDay = player.getDynamicProperty("day");
  if(lastDay === undefined || lastDay < mc.world.getDay()) {
    setRandomSkill(player);
    player.setDynamicProperty("day", mc.world.getDay());
  } else {
    // 日が変わっていなくても、スキル数が不足していれば補充
    adjustSkillCount(player);
  }
})

export function setRandomSkill(player) {
  if (!(player instanceof mc.Player)) return;
  const skillCount = mc.world.getDynamicProperty("skillCount") || 1;
  const selectedSkills = [];
  const availableSkills = [...Array(skillList.length).keys()];
  
  // ランダムに重複しないスキルを選択
  for (let i = 0; i < Math.min(skillCount, skillList.length); i++) {
    const randomIndex = Math.floor(Math.random() * availableSkills.length);
    selectedSkills.push(availableSkills[randomIndex]);
    availableSkills.splice(randomIndex, 1);
  }
  
  // 配列をJSON文字列として保存
  player.setDynamicProperty("skills", JSON.stringify(selectedSkills));
  
  if (mc.world.getDynamicProperty("showSkillMessage")) {
    let message = "スキルが変化した…\n";
    selectedSkills.forEach((skillIndex, i) => {
      const skill = skillList[skillIndex];
      message += `§r${i + 1}. §e${skill.name}§r - §b${skill.description}\n`;
    });
    player.sendMessage(message);
  } else {
    player.sendMessage("スキルが変化した…");
  }
}

/**
 * プレイヤーのスキル数を調整し、不足分をランダムで補充する
 * @param {mc.Player} player
 */
export function adjustSkillCount(player) {
  if (!(player instanceof mc.Player)) return;
  const skillCount = mc.world.getDynamicProperty("skillCount") || 1;
  const skillsJson = player.getDynamicProperty("skills");
  
  let currentSkills = [];
  if (skillsJson !== undefined) {
    try {
      currentSkills = JSON.parse(skillsJson);
    } catch (e) {
      // パース失敗時は旧形式をチェック
      const oldSkillIndex = player.getDynamicProperty("skill");
      if (oldSkillIndex !== undefined) {
        currentSkills = [oldSkillIndex];
      }
    }
  } else {
    // 旧形式のスキルをチェック
    const oldSkillIndex = player.getDynamicProperty("skill");
    if (oldSkillIndex !== undefined) {
      currentSkills = [oldSkillIndex];
    }
  }
  
  // スキルが不足している場合、ランダムで補充
  if (currentSkills.length < skillCount) {
    const availableSkills = [...Array(skillList.length).keys()].filter(i => !currentSkills.includes(i));
    const neededCount = skillCount - currentSkills.length;
    
    for (let i = 0; i < neededCount && availableSkills.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availableSkills.length);
      currentSkills.push(availableSkills[randomIndex]);
      availableSkills.splice(randomIndex, 1);
    }
    
    // 更新したスキルを保存
    player.setDynamicProperty("skills", JSON.stringify(currentSkills));
    
    if (mc.world.getDynamicProperty("showSkillMessage")) {
      let message = "スキルが追加されました:\n";
      currentSkills.forEach((skillIndex, i) => {
        const skill = skillList[skillIndex];
        message += `§r${i + 1}. §e${skill.name}§r - §b${skill.description}\n`;
      });
      player.sendMessage(message);
    }
  }
}

/**
 * 指定されたプレイヤーのスキルを取得する
 * @param {mc.Player} player
 * @returns {null | {id: string, name: string, description: string}[]}
 */
export function getSkill(player) {
  const skillsJson = player.getDynamicProperty("skills");
  if (skillsJson === undefined) {
    // 旧バージョンとの互換性のため、単一スキルをチェック
    const skillIndex = player.getDynamicProperty("skill");
    if (skillIndex === undefined) {
      return null; // スキルが設定されていない場合
    }
    return [skillList[skillIndex]];
  }
  
  try {
    const skillIndices = JSON.parse(skillsJson);
    return skillIndices.map(index => skillList[index]);
  } catch (e) {
    return null;
  }
}

/**
 * プレイヤーが指定されたIDのスキルを持っているかチェックする
 * @param {mc.Player} player
 * @param {string} skillId
 * @returns {boolean}
 */
export function hasSkill(player, skillId) {
  const skills = getSkill(player);
  if (!skills) return false;
  const skillCount = mc.world.getDynamicProperty("skillCount") || 1;
  // 設定されたスキル数までしかチェックしない
  const activeSkills = skills.slice(0, skillCount);
  return activeSkills.some(skill => skill.id === skillId);
}

mc.system.afterEvents.scriptEventReceive.subscribe(data=>{
  if(data.id == "altivelis:test") {
    const player = data.sourceEntity;
    if(!(player instanceof mc.Player)) return;
    player.applyImpulse({x:0, y:10, z:0});
  }
})