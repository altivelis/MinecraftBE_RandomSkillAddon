import * as mc from "@minecraft/server";
import { skillList } from "../skillList";
import { getSkill } from "../main";

mc.system.beforeEvents.startup.subscribe(data => {
  /**
   * alt:skilllistコマンドを定義
   * @type {mc.CustomCommand}
   */
  const skillListCommand = {
    cheatsRequired: true,
    name: "alt:skillinfo",
    description: "現在のスキルの情報を表示する",
    permissionLevel: mc.CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [],
    optionalParameters: [
      {name: "target", type: mc.CustomCommandParamType.PlayerSelector}
    ],
  }
  data.customCommandRegistry.registerCommand(skillListCommand, 
    /**
     * @param {mc.CustomCommandOrigin} origin 
     * @param {mc.Player[]} player 
     */
    (origin, player) => {
    if (player === undefined) {
      if (origin.sourceEntity instanceof mc.Player) {
        let skills = getSkill(origin.sourceEntity);
        if (!skills) {
          return {
            status: mc.CustomCommandStatus.Failure,
            message: "スキル情報が見つかりませんでした。"
          }
        }
        let text = `${origin.sourceEntity.nameTag}のスキル:\n`;
        skills.forEach((skill, i) => {
          text += `${i + 1}. §a${skill.name}§r - ${skill.description}\n`;
        });
        return {
          status: mc.CustomCommandStatus.Success,
          message: text
        }
      } else {
        return {
          status: mc.CustomCommandStatus.Failure,
          message: "プレイヤーが指定されていません。"
        }
      }
    }
    else if (player.length == 0) {
      return {
        status: mc.CustomCommandStatus.Failure,
        message: "プレイヤーが見つかりませんでした。"
      }
    } else {
      let textList = [];
      for (const target of player) {
        let skills = getSkill(target);
        if (!skills) {
          textList.push(`${target.nameTag}: スキル情報が見つかりませんでした。`);
        } else {
          let text = `${target.nameTag}のスキル:\n`;
          skills.forEach((skill, i) => {
            text += `  ${i + 1}. §a${skill.name}§r - ${skill.description}\n`;
          });
          textList.push(text);
        }
      }
      return {
        status: mc.CustomCommandStatus.Success,
        message: textList.join("\n")
      };
    }
  })
})