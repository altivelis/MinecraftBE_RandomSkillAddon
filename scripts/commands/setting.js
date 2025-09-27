import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";

mc.world.afterEvents.worldLoad.subscribe(() => {
  // 設定を初期化
  if(mc.world.getDynamicProperty("showSkillMessage") === undefined) {
    mc.world.setDynamicProperty("showSkillMessage", false);
  }
  if(mc.world.getDynamicProperty("doubleJumpPower") === undefined) {
    mc.world.setDynamicProperty("doubleJumpPower", 7);
  }
  if(mc.world.getDynamicProperty("explodeProjectilePower") === undefined) {
    mc.world.setDynamicProperty("explodeProjectilePower", 4);
  }
  if(mc.world.getDynamicProperty("superSmashPower") === undefined) {
    mc.world.setDynamicProperty("superSmashPower", 10);
  }
  if(mc.world.getDynamicProperty("strongSmellPower") === undefined) {
    mc.world.setDynamicProperty("strongSmellPower", 5);
  }
  if(mc.world.getDynamicProperty("satoruLength") === undefined) {
    mc.world.setDynamicProperty("satoruLength", 3);
  }
  if(mc.world.getDynamicProperty("nature_blessing_radius") === undefined) {
    mc.world.setDynamicProperty("nature_blessing_radius", 5);
  }
  if(mc.world.getDynamicProperty("miner_instinct_radius") === undefined) {
    mc.world.setDynamicProperty("miner_instinct_radius", 10);
  }
})

mc.system.beforeEvents.startup.subscribe(data=>{
  /**
   * 設定コマンドを定義
   * @type {mc.CustomCommand}
   */
  const settingCommand = {
    cheatsRequired: false,
    name: "alt:setting",
    description: "スキルの設定を変更する",
    permissionLevel: mc.CommandPermissionLevel.Host,
    mandatoryParameters: [],
    optionalParameters: [],
    cheatsRequired: false
  }
  data.customCommandRegistry.registerCommand(settingCommand, (origin) => {
    if (origin.sourceEntity?.typeId !== "minecraft:player") {
      return {
        status: mc.CustomCommandStatus.Failure,
        message: "このコマンドはプレイヤーのみが実行できます。"
      }
    }
    const player = origin.sourceEntity;
    // 設定フォームを表示
    const settingForm = new ui.ModalFormData()
      .title("設定")
      .toggle("スキルのメッセージを表示", {defaultValue: mc.world.getDynamicProperty("showSkillMessage"), tooltip: "スキルが変わった際にスキルの内容を知らせます"})
      .slider("2段ジャンプの強さ", 5, 20, {valueStep: 1, defaultValue: mc.world.getDynamicProperty("doubleJumpPower")})
      .slider("爆弾の呪いの爆発力", 1, 10, {valueStep: 1, defaultValue: mc.world.getDynamicProperty("explodeProjectilePower")})
      .slider("スーパースマッシュの強さ", 2, 20, {valueStep: 1, defaultValue: mc.world.getDynamicProperty("superSmashPower")})
      .slider("強烈な体臭の範囲", 1, 10, {valueStep: 1, defaultValue: mc.world.getDynamicProperty("strongSmellPower")})
      .slider("無下限呪術の範囲", 1, 10, {valueStep: 1, defaultValue: mc.world.getDynamicProperty("satoruLength")})
      .slider("自然の恵みの範囲", 1, 10, {valueStep: 1, defaultValue: mc.world.getDynamicProperty("nature_blessing_radius")})
      .slider("鉱夫の直感の範囲", 5, 20, {valueStep: 1, defaultValue: mc.world.getDynamicProperty("miner_instinct_radius")});
    mc.system.run(()=>{
      settingForm.show(player).then(res => {
        if (res.canceled) return; // キャンセルされた場合は何もしない
        mc.world.setDynamicProperty("showSkillMessage", res.formValues[0]);
        mc.world.setDynamicProperty("doubleJumpPower", res.formValues[1]);
        mc.world.setDynamicProperty("explodeProjectilePower", res.formValues[2]);
        mc.world.setDynamicProperty("superSmashPower", res.formValues[3]);
        mc.world.setDynamicProperty("strongSmellPower", res.formValues[4]);
        mc.world.setDynamicProperty("satoruLength", res.formValues[5]);
        mc.world.setDynamicProperty("nature_blessing_radius", res.formValues[6]);
        mc.world.setDynamicProperty("miner_instinct_radius", res.formValues[7]);
        // 設定が更新されたことをプレイヤーに通知
        player.sendMessage(
          "設定が更新されました。\n" +
          `スキルのメッセージ表示: ${res.formValues[0] ? "有効" : "無効"}\n` +
          `2段ジャンプの強さ: ${res.formValues[1]} (デフォルト: 7)\n` +
          `爆弾の呪いの爆発力: ${res.formValues[2]} (デフォルト: 4)\n` +
          `スーパースマッシュの強さ: ${res.formValues[3]} (デフォルト: 10)\n` +
          `強烈な体臭の範囲: ${res.formValues[4]} (デフォルト: 5)\n` +
          `無下限呪術の範囲: ${res.formValues[5]} (デフォルト: 3)\n` +
          `自然の恵みの範囲: ${res.formValues[6]} (デフォルト: 5)\n` +
          `鉱夫の直感の範囲: ${res.formValues[7]} (デフォルト: 10)\n`
        )
      })
    })
    return {
      status: mc.CustomCommandStatus.Success,
      message: "設定フォームを表示しました。"
    }
  })
})