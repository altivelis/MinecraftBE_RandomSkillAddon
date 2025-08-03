import * as mc from "@minecraft/server";
import { skillList } from "./skillList";
import "./setting";
import "./skills/doubleJump";
import "./skills/randomEffect";

mc.system.runInterval(() => {
  const players = mc.world.getPlayers();
  // 毎日0時にスキルをリセットする
  if (mc.world.getTimeOfDay() == 0) {
    players.forEach(player => {
      setRandomSkill(player);
    });
  }

  players.forEach(player=>{
    // プレイヤーがスキルを持っていない場合、ランダムなスキルを設定する
    if(player.getDynamicProperty("skill") == undefined) {
      setRandomSkill(player);
    }
  })
})

export function setRandomSkill(player) {
  if (!(player instanceof mc.Player)) return;
  const skillIndex = Math.floor(Math.random() * skillList.length);
  player.setDynamicProperty("skill", skillIndex);
  if (mc.world.getDynamicProperty("showSkillMessage")) {
    const skill = skillList[skillIndex];
    player.sendMessage(`スキルが変化した…\n§e${skill.name}§r - §b${skill.description}`);
  } else {
    player.sendMessage("スキルが変化した…");
  }
}

/**
 * 指定されたプレイヤーのスキルを取得する
 * @param {mc.Player} player
 * @returns {null | {id: string, name: string, description: string}}
 */
export function getSkill(player) {
  /**
   * @type {number | null}
   */
  const skillIndex = player.getDynamicProperty("skill");
  if (skillIndex === undefined) {
    return null; // スキルが設定されていない場合
  }
  return skillList[skillIndex];
}

mc.system.afterEvents.scriptEventReceive.subscribe(data=>{
  if(data.id == "altivelis:getskill") {
    const player = data.sourceEntity;
    const skill = getSkill(player);
    if(!(player instanceof mc.Player)) return;
    if (skill) {
      player.sendMessage(`あなたのスキル: ${skill.name} - ${skill.description}`);
    }
    else {
      player.sendMessage("スキルが設定されていません。");
    }
  }
})