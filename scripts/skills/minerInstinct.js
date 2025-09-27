import * as mc from "@minecraft/server";
import { getSkill } from "../main";

const searchBlockList = [
  "iron_ore",
  "gold_ore",
  "diamond_ore",
  "lapis_ore",
  "redstone_ore",
  "coal_ore",
  "copper_ore",
  "emerald_ore",
  "quartz_ore",
  "nether_gold_ore",
  "ancient_debris",
  "deepslate_iron_ore",
  "deepslate_gold_ore",
  "deepslate_diamond_ore",
  "deepslate_lapis_ore",
  "deepslate_redstone_ore",
  "deepslate_emerald_ore",
  "deepslate_coal_ore",
  "deepslate_copper_ore",
  "amethyst_block",
  "budding_amethyst",
  "amethyst_cluster",
  "large_amethyst_bud",
  "medium_amethyst_bud",
  "small_amethyst_bud",
  "raw_iron_block",
  "raw_copper_block",
  "raw_gold_block",
  "gold_block",
  "iron_block",
  "emerald_block",
  "diamond_block",
  "lapis_block"
]

/**
 * @type {{[key: string]: mc.MolangVariableMap}}
 */
let oreColors = {};

mc.world.afterEvents.worldLoad.subscribe(()=>{
  oreColors["iron"] = new mc.MolangVariableMap();
  oreColors["iron"].setColorRGB("variable.color", {red:0.9, green:0.8, blue:0.8});
  oreColors["gold"] = new mc.MolangVariableMap();
  oreColors["gold"].setColorRGB("variable.color", {red:1, green:0.8, blue:0.4});
  oreColors["diamond"] = new mc.MolangVariableMap();
  oreColors["diamond"].setColorRGB("variable.color", {red:0.4, green:1, blue:1});
  oreColors["lapis"] = new mc.MolangVariableMap();
  oreColors["lapis"].setColorRGB("variable.color", {red:0.24, green:0.4, blue:1});
  oreColors["redstone"] = new mc.MolangVariableMap();
  oreColors["redstone"].setColorRGB("variable.color", {red:0.95, green:0.24, blue:0.24});
  oreColors["coal"] = new mc.MolangVariableMap();
  oreColors["coal"].setColorRGB("variable.color", {red:0.2, green:0.2, blue:0.2});
  oreColors["copper"] = new mc.MolangVariableMap();
  oreColors["copper"].setColorRGB("variable.color", {red:0.8, green:0.5, blue:0.2});
  oreColors["emerald"] = new mc.MolangVariableMap();
  oreColors["emerald"].setColorRGB("variable.color", {red:0.24, green:0.8, blue:0.24});
  oreColors["quartz"] = new mc.MolangVariableMap();
  oreColors["quartz"].setColorRGB("variable.color", {red:0.9, green:0.9, blue:0.9});
  oreColors["ancient_debris"] = new mc.MolangVariableMap();
  oreColors["ancient_debris"].setColorRGB("variable.color", {red:0.6, green:0.4, blue:0.2});
  oreColors["amethyst"] = new mc.MolangVariableMap();
  oreColors["amethyst"].setColorRGB("variable.color", {red:0.6, green:0.4, blue:0.8});
})

mc.system.runInterval(() => {
  const radius = mc.world.getDynamicProperty("miner_instinct_radius");
  const players = mc.world.getPlayers().filter(player => {
    const skill = getSkill(player);
    return skill && skill.id === "miner_instinct";
  });
  if (players.length === 0) return;
  players.forEach(player => {
    // 鉱石の位置を表示
    const p = player.location;
    const locations = player.dimension.getBlocks(
      new mc.BlockVolume({x: p.x - radius, y: p.y - radius, z: p.z - radius}, {x: p.x + radius, y: p.y + radius, z: p.z + radius}),
      {includeTypes: searchBlockList}
    ).getBlockLocationIterator();
    /**
     * @type {{[key: string]: mc.Vector3}}
     */
    let oreLocations = {};
    for(const loc of locations) {
      if(getDistance(player.location, loc) > radius) continue;
      const block = player.dimension.getBlock(loc);
      let name = "";
      switch(block.typeId) {
        // 鉄
        case "minecraft:iron_ore":
        case "minecraft:deepslate_iron_ore":
        case "minecraft:raw_iron_block":
        case "minecraft:iron_block":
          name = "iron";
          break;
        // 金
        case "minecraft:gold_ore":
        case "minecraft:deepslate_gold_ore":
        case "minecraft:nether_gold_ore":
        case "minecraft:raw_gold_block":
        case "minecraft:gold_block":
          name = "gold";
          break;
        // ダイヤモンド
        case "minecraft:diamond_ore":
        case "minecraft:deepslate_diamond_ore":
        case "minecraft:diamond_block":
          name = "diamond";
          break;
        // ラピスラズリ
        case "minecraft:lapis_ore":
        case "minecraft:deepslate_lapis_ore":
        case "minecraft:lapis_block":
          name = "lapis";
          break;
        // レッドストーン
        case "minecraft:redstone_ore":
        case "minecraft:deepslate_redstone_ore":
          name = "redstone";
          break;
        // 石炭
        case "minecraft:coal_ore":
        case "minecraft:deepslate_coal_ore":
          name = "coal";
          break;
        // 銅
        case "minecraft:copper_ore":
        case "minecraft:deepslate_copper_ore":
        case "minecraft:raw_copper_block":
          name = "copper";
          break;
        // エメラルド
        case "minecraft:emerald_ore":
        case "minecraft:deepslate_emerald_ore":
        case "minecraft:emerald_block":
          name = "emerald";
          break;
        // クォーツ
        case "minecraft:quartz_ore":
          name = "quartz";
          break;
        // 古代の残骸
        case "minecraft:ancient_debris":
          name = "ancient_debris";
          break;
        // アメジスト
        case "minecraft:amethyst_block":
        case "minecraft:budding_amethyst":
        case "minecraft:amethyst_cluster":
        case "minecraft:large_amethyst_bud":
        case "minecraft:medium_amethyst_bud":
        case "minecraft:small_amethyst_bud":
          name = "amethyst";
          break;
      }
      if (name) {
        if(oreLocations[name]) {
          if(getDistance(player.location, oreLocations[name]) > getDistance(player.location, loc)) {
            oreLocations[name] = {x: loc.x+0.5, y: loc.y+0.5, z: loc.z+0.5}; // 鉱石の位置を更新
          }
        } else {
          oreLocations[name] = {x: loc.x+0.5, y: loc.y+0.5, z: loc.z+0.5}; // 鉱石の位置を更新
        }
      }
    }
    for(const [name, loc] of Object.entries(oreLocations)) {
      let color = oreColors[name];
      let pLocation = {...player.location, y:player.location.y + 1};
      const dx = loc.x - pLocation.x;
      const dy = loc.y - pLocation.y;
      const dz = loc.z - pLocation.z;
      const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const vector = {x: dx / length, y: dy / length, z: dz / length};
      for (let i = 0; i < length; i++) {
        const particleLocation = {
          x: pLocation.x + vector.x * i,
          y: pLocation.y + vector.y * i,
          z: pLocation.z + vector.z * i
        };
        player.spawnParticle("minecraft:colored_flame_particle", particleLocation, color);
      }
    }
  });
}, 20)

function getDistance(loc1, loc2) {
  const dx = loc1.x - loc2.x;
  const dy = loc1.y - loc2.y;
  const dz = loc1.z - loc2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}