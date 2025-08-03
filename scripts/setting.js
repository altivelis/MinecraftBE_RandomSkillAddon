import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";

mc.world.afterEvents.worldLoad.subscribe(() => {
  // 設定を初期化
  if(mc.world.getDynamicProperty("showSkillMessage") === undefined) {
    mc.world.setDynamicProperty("showSkillMessage", true);
  }
})

mc.system.afterEvents.scriptEventReceive.subscribe(data => {
  if (data.id == "alt:setting") {
    const player = data.sourceEntity;
    if (!(player instanceof mc.Player)) return;

    const settingForm = new ui.ModalFormData()
      .title("設定")
      .toggle("スキルのメッセージを表示", {defaultValue: mc.world.getDynamicProperty("showSkillMessage"), tooltip: "スキルが変わった際にスキルの内容を知らせます"});
    
    settingForm.show(player).then(res=>{
      if (res.canceled) return; // キャンセルされた場合は何もしない
      mc.world.setDynamicProperty("showSkillMessage", res.formValues[0]);

      player.sendMessage(
        "設定が更新されました。\n" +
        `スキルのメッセージ表示: ${res.formValues[0] ? "有効" : "無効"}`
      )
    })
  }
})