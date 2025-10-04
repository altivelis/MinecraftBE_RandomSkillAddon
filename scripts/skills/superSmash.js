import * as mc from "@minecraft/server";
import { hasSkill } from "../main";


mc.world.afterEvents.entityHitEntity.subscribe(data=>{
  const player = data.damagingEntity;
  if(!(player instanceof mc.Player)) return;
  // スキルが「スーパースマッシュ」のプレイヤーのみを対象とする
  if(!hasSkill(player, "super_smash")) return;
  const smashPower = mc.world.getDynamicProperty("superSmashPower");
  const target = data.hitEntity;
  const direction = player.getViewDirection();
  target.applyKnockback({x:direction.x * smashPower, z:direction.z * smashPower}, (direction.y + 0.3) * smashPower);
})