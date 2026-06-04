import sys
import os

# llm フォルダに移動して実行
os.chdir(os.path.join(os.getcwd(), 'llm'))

try:
    # 起動オプションを渡せるようにする
    import __main__
except Exception as e:
    print(f"エラーや…: {e}")