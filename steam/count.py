import re
from turtle import end_fill
file_in1 = r'D:\git_pro\note\steam\payList.csv'
file_out = r'D:\git_pro\note\steam\payListOut.csv'

prog = re.compile(r'\s+')

# with open(file_out, 'w', encoding='utf-8') as out:
count = 0
with open(file_in1, 'r', encoding='utf-8') as inf:
  arr = inf.readlines()
  lines = ''.join(arr).split(';#')
  for line in lines:
    # print(line.replace('\n','').replace(prog,'!'))
    ol = prog.sub(' ', line).strip()
    spend = float(ol.split('¥')[1])
    if '退款' in ol:
      spend *= -1
    print(spend, ol.split(',')[1])
    count += spend

print('总计', count)