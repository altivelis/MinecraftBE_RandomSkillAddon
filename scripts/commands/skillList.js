import * as mc from "@minecraft/server";
import { skillList } from "../skillList";

mc.system.beforeEvents.startup.subscribe(data => {
  /**
   * alt:skilllistコマンドを定義
   * @type {mc.CustomCommand}
   */
  const skillListCommand = {
    cheatsRequired: true,
    name: "alt:skilllist",
    description: "利用可能なスキルのリストを表示する",
    permissionLevel: mc.CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [],
    optionalParameters: [
      {name: "skill", type: mc.CustomCommandParamType.String},
    ],
  }
  data.customCommandRegistry.registerCommand(skillListCommand, (origin, skill) => {
    if (!(origin.sourceEntity instanceof mc.Player)) {
      return {
        status: mc.CustomCommandStatus.Failure,
        message: "このコマンドはプレイヤーのみが実行できます。"
      }
    }
    let textList = [];
    if (skill) {
      let skillInfo = skillList.find(s => s.id === skill);
      textList.push(`スキルID: ${skillInfo.id}\nスキル名: §a${skillInfo.name}§r\nスキル説明: ${skillInfo.description}\n`);
    } else {
      textList.push("利用可能なスキル:\n");
      skillList.forEach(s => {
        textList.push(`スキルID: ${s.id}\nスキル名: §a${s.name}§r\nスキル説明: ${s.description}\n`);
      });
    }
    return {
      status: mc.CustomCommandStatus.Success,
      message: textList.join("================\n")
    }
  })
})