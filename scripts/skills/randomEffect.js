import * as mc from "@minecraft/server";
import { getSkill } from "../main";

mc.system.runInterval(() => {
  const players = mc.world.getPlayers().filter(player=>{
    return getSkill(player)?.id == "random_effect";
  });
  if (players.length === 0) return; // 対象のプレイヤーがいない場合は処理をスキップ
  const effects = mc.EffectTypes.getAll();
  players.forEach(player => {
    // ランダムなポーション効果を適用する
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    player.addEffect(randomEffect, mc.TicksPerSecond * 30, {amplifier: 1, showParticles: true});
  })
}, mc.TicksPerSecond * 30);