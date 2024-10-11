import os
import json
import base64

# 定义包含映射文件的目录路径
unidecode_folder_path = r'C:\Users\Edwin\Downloads\unidecode-master\unidecode'
output_file_path = 'unicode_mapping_base64.js'

# 创建或清空输出文件
with open(output_file_path, 'w', encoding='utf-8') as output_file:
    output_file.write('// Unicode to ASCII mapping arrays encoded in Base64\n')
    output_file.write('const unicodeMapping = {};\n\n')

    # 遍历所有的映射文件（形如 x000.py, x001.py 等）
    for file_name in sorted(os.listdir(unidecode_folder_path)):
        if file_name.startswith('x') and file_name.endswith('.py'):
            file_path = os.path.join(unidecode_folder_path, file_name)

            # 输出调试信息：当前正在处理的文件
            print(f"Processing file: {file_name}")

            # 动态执行 Python 文件以获取映射数组
            with open(file_path, 'r', encoding='utf-8') as mapping_file:
                file_content = mapping_file.read()
                local_vars = {}
                exec(file_content, {}, local_vars)  # 执行文件内容并获取结果
                mapping_array = local_vars.get('data')  # 获取映射数组

                if mapping_array:
                    # 将映射数组转换为 JSON 格式并编码为 Base64
                    mapping_json = json.dumps(mapping_array, ensure_ascii=False)
                    encoded_data = base64.b64encode(mapping_json.encode('utf-8')).decode('utf-8')

                    # 提取文件的块号，例如 'x06d.py' 提取为 '06d'
                    block_key = file_name[1:4]
                    print(f"Writing block {block_key} to unicodeMapping.")

                    output_file.write(f'unicodeMapping["{block_key}"] = "{encoded_data}";\n')
                else:
                    print(f"Warning: No data found in file {file_name}")

print(f"映射数据已成功提取并保存到 {output_file_path}")
