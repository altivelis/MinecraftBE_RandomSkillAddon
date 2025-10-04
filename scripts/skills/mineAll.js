import * as mc from "@minecraft/server";
import { hasSkill } from "../main";

// 木の原木を一括で破壊する
mc.world.beforeEvents.playerBreakBlock.subscribe(data => {
  if (!hasSkill(data.player, "mine_all")) return;

  const block = data.block;
  if (!block) return;
  // "lit_"がついていたら消す
  const blockId = block.typeId.replace(/lit_/, "");
  // 原木以外なら処理しない
  if (!blockId || !blockId.endsWith("ore")) return;

  // itemStackが存在するか確認（素手などでundefinedになる可能性）
  if (!data.itemStack || typeof data.itemStack.typeId !== "string") return;
  if (!data.itemStack.typeId.endsWith("pickaxe")) return; // ピッケルでない場合は処理をスキップ

  // 隣接する同種の鉱石をBFSで収集する
  const toCheck = [block];
  const checkedPos = new Set();
  /**
   * @type {mc.Block[]}
   */
  const blocksToBreak = [];
  const maxBlocks = 100; // 最大破壊数

  function posKey(loc) {
    return `${Math.floor(loc.x)},${Math.floor(loc.y)},${Math.floor(loc.z)}`;
  }

  while (toCheck.length > 0 && blocksToBreak.length < maxBlocks) {
    const current = toCheck.pop();
    if (!current) continue;
    const key = posKey(current.location);
    if (checkedPos.has(key)) continue;
    checkedPos.add(key);

    // 全方位探索
    const adjacentBlocks = [
      current.north(),
      current.south(),
      current.east(),
      current.west(),
      current.above(),
      current.below()
    ];

    for (const adj of adjacentBlocks) {
      if (!adj) continue;
      const akey = posKey(adj.location);
      if (checkedPos.has(akey)) continue;
      if (adj.typeId.replace(/lit_/, "") === blockId) {
        toCheck.push(adj);
        blocksToBreak.push(adj);
      }
    }
  }

  if (blocksToBreak.length === 0) return;

  // 一括破壊を実行
  mc.system.run(() => {
    blocksToBreak.forEach(b => {
      // ツールの耐久値を減らす
      let item = data.player.getComponent(mc.EntityEquippableComponent.componentId).getEquipment(mc.EquipmentSlot.Mainhand);
      if (!item) return;
      let comp = item.getComponent(mc.ItemDurabilityComponent.componentId);
      if (!comp || comp.damage > comp.maxDurability) return;
      let unbreakLevel = 0;
      const enchant = item.getComponent(mc.ItemEnchantableComponent.componentId).getEnchantment("unbreaking");
      if (enchant) {
        unbreakLevel = enchant.level;
      }
      if (Math.random() * 100 < comp.getDamageChance(unbreakLevel)) {
        if (comp.damage >= comp.maxDurability) return; // 耐久値が最大ならこれ以上減らさない
        item.getComponent(mc.ItemDurabilityComponent.componentId).damage = comp.damage + 1;
        data.player.getComponent(mc.EntityEquippableComponent.componentId).setEquipment(mc.EquipmentSlot.Mainhand, item);
      }
      // 破壊処理
      data.player.runCommand(`loot spawn ${block.location.x} ${block.location.y} ${block.location.z} mine ${b.location.x} ${b.location.y} ${b.location.z} mainhand`);
      let pos = b.bottomCenter();
      b.dimension.spawnParticle("minecraft:villager_happy", {...pos, y: pos.y + 0.5});
      b.setType("minecraft:air");
    });
  });
});