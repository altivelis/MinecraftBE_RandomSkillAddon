import * as mc from "@minecraft/server";
import { getSkill } from "../main";

mc.world.afterEvents.entityHurt.subscribe(data=>{
  const player = data.damageSource.damagingEntity;
  if(!player || !(player instanceof mc.Player) || !getSkill(player) || getSkill(player).id !== "vampire") return;
  const healthComponent = player.getComponent(mc.EntityHealthComponent.componentId);
  healthComponent.setCurrentValue(Math.min(Math.floor(healthComponent.currentValue + data.damage), healthComponent.effectiveMax));
})