import * as mc from "@minecraft/server";
import { hasSkill } from "../main";

mc.system.runInterval(()=>{
  const players = mc.world.getPlayers().filter(player=>{
    return hasSkill(player, "charge_jump");
  })
  if (players.length === 0) return;

  players.forEach(player=>{
    let power = player.getDynamicProperty("chargeJumpPower") || 0;
    power += 1; // パワーを溜める
    player.setDynamicProperty("chargeJumpPower", power);
    if (power > 40) power = 40; // 最大パワーを40に制限
    if (power > 5 && player.isJumping) {
      // ジャンプした場合、パワーに応じて吹っ飛ばす
      let jumpPower = power / 10; // パワーを5で割ってジャンプ力に変換
      const direction = player.getViewDirection();
      player.dimension.spawnParticle("minecraft:wind_explosion_emitter", player.location);
      player.dimension.playSound("wind_charge.burst", player.location);
      player.applyKnockback({
        x: direction.x * jumpPower * 2,
        z: direction.z * jumpPower * 2
      },
    direction.y * jumpPower);
    }
    if (!player.isSneaking || !player.isOnGround) {
      player.setDynamicProperty("chargeJumpPower", 0); // しゃがんでいない場合はパワーをリセット
      return;
    } // しゃがんでいない場合は何もしない
    player.onScreenDisplay.setActionBar(`§l§a${"/".repeat(power)}§8${"/".repeat(40 - power)}`);
  });
})