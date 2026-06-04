import sys
import os
import importlib.util

# 現在のファイルがあるディレクトリをルートとして登録
root_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, root_dir)

def dynamic_import():
    # 探索対象のパス候補（scripts か src）
    search_paths = ['scripts', 'src']
    for folder in search_paths:
        target = os.path.join(root_dir, folder, 'lib', 'ecc_dashboard_runtime.py')
        if os.path.exists(target):
            # 動的にモジュールをロード
            spec = importlib.util.spec_from_file_location("ecc_dashboard_runtime", target)
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            return module
    raise ImportError("ecc_dashboard_runtime.py がどこにも見当たらないで！")

try:
    runtime = dynamic_import()
    launch_terminal = runtime.launch_terminal
    maximize_window = runtime.maximize_window
    print("インポート成功やで！ダッシュボード起動の準備は万端や！")
except Exception as e:
    print(f"エラー発生やで: {e}")
    print("ディレクトリ構成を確認したけど、runtimeファイルが見つからへんかったわ。")