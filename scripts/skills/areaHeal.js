import * as mc from "@minecraft/server";
import { getSkill } from "../main";

// 範囲回復スキル
mc.system.runInterval(() => {
  const players = mc.world.getPlayers();
  players.forEach(player =>{
    let skill = getSkill(player);
    if (!skill || skill.id !== "area_heal") return;
    // 0.25秒ごとに周囲3ブロック以内のプレイヤーを回復する
    const currentTick = mc.system.currentTick;
    if (currentTick % 5 != 0) return;

    const nearbyPlayers = player.dimension.getPlayers({location: player.location, maxDistance: 5});

    nearbyPlayers.forEach(target =>{
      let health = target.getComponent(mc.EntityHealthComponent.componentId);
      if (!health) return;
      if (health.currentValue >= health.defaultValue) return; // 満タンならスキップ
      health.setCurrentValue(Math.min(health.currentValue + 1, health.defaultValue));
      target.dimension.spawnParticle("minecraft:heart_particle", target.location);
    });
  });
});