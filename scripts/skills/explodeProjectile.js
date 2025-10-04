import * as mc from "@minecraft/server";
import { hasSkill } from "../main";

mc.world.afterEvents.projectileHitBlock.subscribe(data=>{
  const player = data.source;
  if(!(player instanceof mc.Player)) return;
  // スキルが「爆弾の呪い」のプレイヤーのみを対象とする
  if(!hasSkill(player, "explode_projectile")) return;

  // 爆発エフェクトを生成
  data.dimension.createExplosion(data.location, mc.world.getDynamicProperty("explodeProjectilePower"), {breaksBlocks: true, causesFire: false, source: player});
  if(data.projectile.isValid){
    data.projectile.kill(); // 飛び道具を消去
  }
})

mc.world.afterEvents.projectileHitEntity.subscribe(data=>{
  const player = data.source;
  if(!(player instanceof mc.Player)) return;
  // スキルが「爆弾の呪い」のプレイヤーのみを対象とする
  if(!hasSkill(player, "explode_projectile")) return;

  // 爆発エフェクトを生成
  data.dimension.createExplosion(data.location, mc.world.getDynamicProperty("explodeProjectilePower"), {breaksBlocks: true, causesFire: false, source: player});
  if(data.projectile.isValid){
    data.projectile.kill(); // 飛び道具を消去
  }
})