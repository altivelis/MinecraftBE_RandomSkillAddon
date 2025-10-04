import * as mc from "@minecraft/server";
import { hasSkill } from "../main";

mc.world.beforeEvents.playerInteractWithEntity.subscribe(data=>{
  const player = data.player;
  if(!hasSkill(player, "magician")) return;
  mc.system.run(() => {
    while (1) {
      try {
        data.target.dimension.spawnEntity(mc.EntityTypes.getAll()[Math.floor(Math.random() * mc.EntityTypes.getAll().length)], data.target.location);
      } catch (e) {
        continue;
      }
      break;
    }
    data.target.dimension.spawnParticle("minecraft:cauldron_explosion_emitter", data.target.location);
    data.target.remove();
  })
})