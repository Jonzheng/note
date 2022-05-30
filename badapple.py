import re, json
file_in1 = r'D:\git_pro\note\badapple_out.txt'
file_zip = r'D:\git_pro\note\badapple_zip.txt'

prog = re.compile(r'\s+')
count = 0
with open(file_zip, 'w', encoding='utf-8') as out:
  with open(file_in1, 'r', encoding='utf-8') as inf:
    arr = inf.readlines()
    data = json.loads(arr[0])
    for line in data:
      out.write(line + '\n')
      count += 1


print('总计', count)