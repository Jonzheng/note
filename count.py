import re, json
file_in1 = r'D:\git_pro\note\badapple4.log'
# file_out = r'D:\git_pro\note\badapple_out.txt'
file_out = r'D:\git_pro\note\badapple_zip.txt'

prog = re.compile(r'\s+')
idx = 0

def diff(line, data, idx):
  if idx == 0:
    return line
  elif line == data[idx-1]:
    return 'same'
  else:
    return line

with open(file_out, 'w', encoding='utf-8') as out:
  with open(file_in1, 'r', encoding='utf-8') as inf:
    arr = inf.readlines()
    data = json.loads(arr[0])
    for line in data:
      nl = diff(line, data, idx)
      out.write(nl + '\n')
      idx += 1


print('总计', idx)