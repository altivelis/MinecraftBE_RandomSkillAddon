import * as mc from "@minecraft/server";
import { getSkill } from "../main";

mc.system.runInterval(() => {
  const players = mc.world.getPlayers().filter(player=>{
    return getSkill(player)?.id == "strong_smell";
  })
  if (players.length === 0) return; // 対象のプレイヤーがいない場合は処理をスキップ
  players.forEach(player=>{
    // プレイヤーの周囲にいるモブを取得
    const nearbyEntities = player.dimension.getEntities({
      location: player.location,
      maxDistance: 5 // 近くのモブを取得する距離
    });
    nearbyEntities.forEach(entity=>{
      if(entity.id == player.id) return; // 自分自身は除外
      entity.addEffect(mc.EffectTypes.get("minecraft:poison"), 5, {amplifier: 10, showParticles: true});
    });
  })
})