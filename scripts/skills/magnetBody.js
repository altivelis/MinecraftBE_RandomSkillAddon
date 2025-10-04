import * as mc from "@minecraft/server";
import { hasSkill } from "../main";
import { getVectorBetweenEntities } from "./gojoSatoru";

mc.system.runInterval(() => {
  const players = mc.world.getPlayers();
  players.forEach(player =>{
    if (!hasSkill(player, "magnet_body")) return;
    if (!player.isSneaking) return;
    const nearbyEntities = player.dimension.getEntities({location: player.location, maxDistance: mc.world.getDynamicProperty("magnet_body_radius") || 5});
    nearbyEntities.forEach(entity => {
      if (entity.id === player.id) return; // 自分自身には適用しない
      const vector = getVectorBetweenEntities(entity, player);
      entity.applyImpulse({
        x: vector.x * 0.5, // 吸引力の強さを調整
        y: vector.y * 0.5,
        z: vector.z * 0.5
      });
    });
  });
});