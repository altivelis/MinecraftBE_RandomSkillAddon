import * as mc from "@minecraft/server";
import { setRandomSkill } from "../main";
import { skillList } from "../skillList";

mc.system.beforeEvents.startup.subscribe(data=>{
  const skillEnum = skillList.map(s => s.id);
  data.customCommandRegistry.registerEnum("alt:skill1", skillEnum);
  data.customCommandRegistry.registerEnum("alt:skill2", skillEnum);
  data.customCommandRegistry.registerEnum("alt:skill3", skillEnum);
  /**
   * alt:setskillコマンドを定義
   * @type {mc.CustomCommand}
   */
  const setSkillCommand = {
    cheatsRequired: true,
    name: "alt:setskill",
    description: "現在のスキルを変更する",
    permissionLevel: mc.CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [],
    optionalParameters: [
      {name: "alt:skill1", type: mc.CustomCommandParamType.Enum},
      {name: "alt:skill2", type: mc.CustomCommandParamType.Enum},
      {name: "alt:skill3", type: mc.CustomCommandParamType.Enum},
    ],
  }
  data.customCommandRegistry.registerCommand(setSkillCommand, (origin, skill1, skill2, skill3)=>{
    if (origin.sourceEntity?.typeId !== "minecraft:player") {
      return {
        status: mc.CustomCommandStatus.Failure,
        message: "このコマンドはプレイヤーのみが実行できます。"
      }
    }
    const player = origin.sourceEntity;
    const skillCount = mc.world.getDynamicProperty("skillCount") || 1;
    
    // 引数が1つも指定されていない場合はランダム
    if(!skill1 && !skill2 && !skill3) {
      setRandomSkill(player);
      return {
        status: mc.CustomCommandStatus.Success,
        message: `${player.nameTag}のスキルがランダムに設定されました。`
      }
    }
    
    // 指定されたスキルを収集
    const specifiedSkills = [skill1, skill2, skill3].filter(s => s !== undefined);
    const skillIndices = [];
    const skillNames = [];
    
    // 指定されたスキルを検証して追加
    for (const skillId of specifiedSkills) {
      const skillIndex = skillList.findIndex(s => s.id === skillId);
      if (skillIndex === -1) {
        return {
          status: mc.CustomCommandStatus.Failure,
          message: `スキル「${skillId}」は存在しません。`
        }
      }
      if (skillIndices.includes(skillIndex)) {
        return {
          status: mc.CustomCommandStatus.Failure,
          message: `スキル「${skillId}」が重複しています。`
        }
      }
      skillIndices.push(skillIndex);
      skillNames.push(skillList[skillIndex].name);
    }
    
    // 残りのスキルをランダムに追加
    const remainingCount = skillCount - skillIndices.length;
    if (remainingCount > 0) {
      const availableSkills = [...Array(skillList.length).keys()].filter(i => !skillIndices.includes(i));
      for (let i = 0; i < remainingCount && availableSkills.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableSkills.length);
        const selectedIndex = availableSkills[randomIndex];
        skillIndices.push(selectedIndex);
        skillNames.push(skillList[selectedIndex].name);
        availableSkills.splice(randomIndex, 1);
      }
    }
    
    // スキルを設定
    player.setDynamicProperty("skills", JSON.stringify(skillIndices));
    
    // メッセージを送信
    if (mc.world.getDynamicProperty("showSkillMessage")) {
      let message = "スキルが設定されました:\n";
      skillIndices.forEach((idx, i) => {
        const skill = skillList[idx];
        message += `${i + 1}. §e${skill.name}§r - §b${skill.description}\n`;
      });
      player.sendMessage(message);
    } else {
      player.sendMessage("スキルが設定されました。");
    }
    
    return {
      status: mc.CustomCommandStatus.Success,
      message: `${player.nameTag}のスキルが設定されました: ${skillNames.join(", ")}`
    }
  })
})