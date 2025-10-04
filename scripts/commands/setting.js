import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import { adjustSkillCount } from "../main";

mc.world.afterEvents.worldLoad.subscribe(() => {
  // 設定を初期化
  if(mc.world.getDynamicProperty("skillCount") === undefined) {
    mc.world.setDynamicProperty("skillCount", 1);
  }
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
  if(mc.world.getDynamicProperty("area_attack_range") === undefined) {
    mc.world.setDynamicProperty("area_attack_range", 3);
  }
  if(mc.world.getDynamicProperty("area_heal_radius") === undefined) {
    mc.world.setDynamicProperty("area_heal_radius", 5);
  }
  if(mc.world.getDynamicProperty("magnet_body_radius") === undefined) {
    mc.world.setDynamicProperty("magnet_body_radius", 5);
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
      .slider("スキルの個数", 1, 3, {valueStep: 1, defaultValue: mc.world.getDynamicProperty("skillCount"), tooltip: "1日に設定されるスキルの個数"})
      .toggle("スキルのメッセージを表示", {defaultValue: mc.world.getDynamicProperty("showSkillMessage"), tooltip: "スキルが変わった際に内容が分かります"})
      .slider("2段ジャンプの強さ", 5, 20, {valueStep: 1, defaultValue: mc.world.getDynamicProperty("doubleJumpPower")})
      .slider("爆弾の呪いの爆発力", 1, 10, {valueStep: 1, defaultValue: mc.world.getDynamicProperty("explodeProjectilePower")})
      .slider("スーパースマッシュの強さ", 2, 20, {valueStep: 1, defaultValue: mc.world.getDynamicProperty("superSmashPower")})
      .slider("強烈な体臭の範囲", 1, 10, {valueStep: 1, defaultValue: mc.world.getDynamicProperty("strongSmellPower")})
      .slider("無下限呪術の範囲", 1, 10, {valueStep: 1, defaultValue: mc.world.getDynamicProperty("satoruLength")})
      .slider("自然の恵みの範囲", 1, 10, {valueStep: 1, defaultValue: mc.world.getDynamicProperty("nature_blessing_radius")})
      .slider("鉱夫の直感の範囲", 5, 20, {valueStep: 1, defaultValue: mc.world.getDynamicProperty("miner_instinct_radius"), tooltip: "この設定は重くなる可能性があります"})
      .slider("範囲攻撃の範囲", 1, 10, {valueStep: 1, defaultValue: mc.world.getDynamicProperty("area_attack_range"), })
      .slider("エリアヒールの範囲", 1, 10, {valueStep: 1, defaultValue: mc.world.getDynamicProperty("area_heal_radius"), })
      .slider("マグネットボディの範囲", 1, 10, {valueStep: 1, defaultValue: mc.world.getDynamicProperty("magnet_body_radius")})
    mc.system.run(()=>{
      settingForm.show(player).then(res => {
        if (res.canceled) return; // キャンセルされた場合は何もしない
        const oldSkillCount = mc.world.getDynamicProperty("skillCount") || 1;
        const newSkillCount = res.formValues[0];
        
        mc.world.setDynamicProperty("skillCount", newSkillCount);
        mc.world.setDynamicProperty("showSkillMessage", res.formValues[1]);
        mc.world.setDynamicProperty("doubleJumpPower", res.formValues[2]);
        mc.world.setDynamicProperty("explodeProjectilePower", res.formValues[3]);
        mc.world.setDynamicProperty("superSmashPower", res.formValues[4]);
        mc.world.setDynamicProperty("strongSmellPower", res.formValues[5]);
        mc.world.setDynamicProperty("satoruLength", res.formValues[6]);
        mc.world.setDynamicProperty("nature_blessing_radius", res.formValues[7]);
        mc.world.setDynamicProperty("miner_instinct_radius", res.formValues[8]);
        mc.world.setDynamicProperty("area_attack_range", res.formValues[9]);
        mc.world.setDynamicProperty("area_heal_radius", res.formValues[10]);
        mc.world.setDynamicProperty("magnet_body_radius", res.formValues[11]);
        
        // スキル数が増えた場合、全プレイヤーのスキルを調整
        if (newSkillCount > oldSkillCount) {
          const allPlayers = mc.world.getPlayers();
          allPlayers.forEach(p => {
            adjustSkillCount(p);
          });
        }
        // 設定が更新されたことをプレイヤーに通知
        player.sendMessage(
          "設定が更新されました。\n" +
          `スキルの個数: ${res.formValues[0]} (デフォルト: 1)\n` +
          `スキルのメッセージ表示: ${res.formValues[1] ? "有効" : "無効"}\n` +
          `2段ジャンプの強さ: ${res.formValues[2]} (デフォルト: 7)\n` +
          `爆弾の呪いの爆発力: ${res.formValues[3]} (デフォルト: 4)\n` +
          `スーパースマッシュの強さ: ${res.formValues[4]} (デフォルト: 10)\n` +
          `強烈な体臭の範囲: ${res.formValues[5]} (デフォルト: 5)\n` +
          `無下限呪術の範囲: ${res.formValues[6]} (デフォルト: 3)\n` +
          `自然の恵みの範囲: ${res.formValues[7]} (デフォルト: 5)\n` +
          `鉱夫の直感の範囲: ${res.formValues[8]} (デフォルト: 10)\n` +
          `範囲攻撃の範囲: ${res.formValues[9]} (デフォルト: 3)\n` +
          `エリアヒールの範囲: ${res.formValues[10]} (デフォルト: 5)\n` +
          `マグネットボディの範囲: ${res.formValues[11]} (デフォルト: 5)`
        )
      })
    })
    return {
      status: mc.CustomCommandStatus.Success,
      message: "設定フォームを表示しました。"
    }
  })
})