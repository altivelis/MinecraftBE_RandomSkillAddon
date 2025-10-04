import * as mc from "@minecraft/server";
import { hasSkill } from "../main";

mc.system.runInterval(() => {
  const jumpPower = mc.world.getDynamicProperty("doubleJumpPower") / 10; // デフォルト値を7に設定
  // スキルが2段ジャンプのプレイヤーのみを対象とする
  const players = mc.world.getPlayers().filter(player => {
    return hasSkill(player, "double_jump");
  });
  // プレイヤーごとに処理を行う
  if (players.length === 0) return; // 対象のプレイヤーがいない場合は処理をスキップ
  players.forEach(player=>{
    // 地面にいる場合の処理
    if(player.isOnGround) {
      player.addTag("ground");
      player.removeTag("jumping");
      player.removeTag("doubleJump");
    }
    // ジャンプ中で2段ジャンプが可能な場合の処理
    if(player.hasTag("jumping") && player.isJumping && !player.hasTag("doubleJump")) {
      let dir = player.getViewDirection();
      let velocity = player.getVelocity();
      // player.applyKnockback({x:dir.x * jumpPower * 0.5, z:dir.z * jumpPower * 0.5}, (1-velocity.y*0.5) * jumpPower );
      player.clearVelocity();
      player.applyImpulse({x:velocity.x * jumpPower * 2, y:jumpPower, z:velocity.z * jumpPower * 2});
      player.addTag("doubleJump");
      player.dimension.spawnParticle("minecraft:knockback_roar_particle", player.location);
      player.dimension.playSound("mob.bat.takeoff", player.location);
    }
    // ジャンプ中で地面にいない場合の処理
    if(player.hasTag("ground") && !player.isOnGround && !player.isJumping) {
      player.addTag("jumping");
      player.removeTag("ground");
    }
  })
})