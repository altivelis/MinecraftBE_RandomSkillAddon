import * as mc from "@minecraft/server";
import { hasSkill } from "../main";

mc.system.runInterval(() => {
  const players = mc.world.getPlayers().filter(player=>{
    return hasSkill(player, "sprinter");
  });
  if (players.length === 0) return; // 対象のプレイヤーがいない場合は処理をスキップ
  players.forEach(player=>{
    if(player.isSprinting) {
      let sprintTime = player.getDynamicProperty("sprintTime") || 0;
      let comp = player.getComponent(mc.EntityMovementComponent.componentId);
      if (!comp) return;
      if (sprintTime > 20 && player.isJumping && !player.isOnGround) {
        let v = player.getVelocity();
        player.applyImpulse({x:v.x * comp.currentValue * 2, y:comp.currentValue * 2, z:v.z*comp.currentValue * 2});
        player.setDynamicProperty("sprintTime");
        comp.resetToDefaultValue();
        player.dimension.spawnParticle("minecraft:knockback_roar_particle", player.location);
        player.dimension.playSound("breeze_wind_charge.burst", player.location);
      }
      if(player.isOnGround) {
        sprintTime++;
        player.setDynamicProperty("sprintTime", sprintTime);
        if(sprintTime > 20) {
          let speed = comp.currentValue * 1.01;
          if (speed > 0.5) speed = 0.5; // 最大速度を制限
          comp.setCurrentValue(speed);
        }
      }
    } else {
      player.setDynamicProperty("sprintTime");
    }
  })
})