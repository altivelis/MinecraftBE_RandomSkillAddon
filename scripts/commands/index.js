/**
 * カスタムコマンド - 自動インポートファイル
 * 
 * 新しいカスタムコマンドを追加する手順：
 * 1. commands/ディレクトリに新しい.jsファイルを作成
 * 2. 下の// COMMANDS IMPORTSセクションにimport文を追加
 * 3. commandList.jsにコマンド情報を追加
 */

// ===============================
// COMMANDS IMPORTS - 新しいコマンドはここに追加
// ===============================
import "./setSkill";
import "./setting";
import "./skillList";
import "./skillInfo";

// 新しいコマンドの例：
// import "./newCommandName";