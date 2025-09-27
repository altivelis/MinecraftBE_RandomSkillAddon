import * as mc from "@minecraft/server";
import { setRandomSkill } from "../main";
import { skillList } from "../skillList";

mc.system.beforeEvents.startup.subscribe(data=>{
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
      {name: "skill", type: mc.CustomCommandParamType.String},
    ],
  }
  data.customCommandRegistry.registerCommand(setSkillCommand, (origin, skill)=>{
    if (origin.sourceEntity?.typeId !== "minecraft:player") {
      return {
        status: mc.CustomCommandStatus.Failure,
        message: "このコマンドはプレイヤーのみが実行できます。"
      }
    }
    const player = origin.sourceEntity;
    if(!skill) {
      setRandomSkill(player);
      return {
        status: mc.CustomCommandStatus.Success,
        message: `${player.nameTag}のスキルがランダムに設定されました。`
      }
    }else{
      const skillIndex = skillList.findIndex(s => s.id === skill);
      if (skillIndex === -1) {
        return {
          status: mc.CustomCommandStatus.Failure,
          message: `スキル「${skill}」は存在しません。`
        }
      }
      player.setDynamicProperty("skill", skillIndex);
      const skillData = skillList[skillIndex];
      if (mc.world.getDynamicProperty("showSkillMessage")) {
        player.sendMessage(`スキルが設定されました: §e${skillData.name}§r - §b${skillData.description}`);
      }
      else {
        player.sendMessage("スキルが設定されました。");
      }
      return {
        status: mc.CustomCommandStatus.Success,
        message: `${player.nameTag}のスキルが「${skillData.name}」に設定されました。`
      }
    }
  })
})