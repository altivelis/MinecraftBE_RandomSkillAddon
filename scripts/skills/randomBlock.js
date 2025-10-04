import * as mc from "@minecraft/server";
import { hasSkill } from "../main";

mc.system.runInterval(() => {
  // スキルがランダムブロックのプレイヤーのみを対象とする
  const players = mc.world.getPlayers().filter(player => {
    return hasSkill(player, "random_block") && player.isOnGround;
  });
  // プレイヤーごとに処理を行う
  if (players.length === 0) return; // 対象のプレイヤーがいない場合は処理をスキップ
  players.forEach(player => {
    // プレイヤーの位置を取得
    const position = player.location;
    const lastPosition = player.getDynamicProperty("lastBlockPosition");
    if(lastPosition==undefined) {
      player.setDynamicProperty("lastBlockPosition", position); // 初回実行時に現在の位置を保存
      return;
    }
    let belowBlock = player.dimension.getBlock(position).below();
    if(belowBlock.isAir || belowBlock.isLiquid) return; // 地面にいない場合は何もしない
    // 前回の位置と同じ場合は何もしない
    // Math.floorを使って小数点以下を無視し、同じブロック上での連続生成を防ぐ
    if(
      Math.floor(position.x) == Math.floor(lastPosition.x) &&
      Math.floor(position.y) == Math.floor(lastPosition.y) &&
      Math.floor(position.z) == Math.floor(lastPosition.z)
    ) return;
    player.setDynamicProperty("lastBlockPosition", position); // 現在の位置を保存
    // ランダムなブロックを生成
    const randomBlockType = mc.BlockTypes.getAll()[Math.floor(Math.random() * mc.BlockTypes.getAll().length)];
    player.dimension.setBlockType({...position, y: position.y - 1}, randomBlockType);
  });
});