import * as mc from "@minecraft/server";
import { getSkill } from "../main";

// ジャンプの強さ
const jumpPower = 0.7;

mc.system.runInterval(() => {
  // スキルが2段ジャンプのプレイヤーのみを対象とする
  const players = mc.world.getPlayers().filter(player => {
    return getSkill(player)?.id == "double_jump";
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
      player.applyKnockback({x:dir.x * jumpPower, z:dir.z * jumpPower}, 1 * jumpPower);
      player.addTag("doubleJump");
    }
    // ジャンプ中で地面にいない場合の処理
    if(player.hasTag("ground") && !player.isOnGround && !player.isJumping) {
      player.addTag("jumping");
      player.removeTag("ground");
    }
  })
})