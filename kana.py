import re

file_in1 = 'D:\\git\\note\\hira.txt'
file_in2 = 'D:\\git\\note\\kata.txt'

pt = re.compile(r'[a-z]+')
hira_map = []
hira_lst = []
for line in open(file_in1, encoding='utf-8'):
    line = line.strip()
    if not line:continue
    hira_lst.append(line)
    if pt.match(line):
        hira_map.append([line,hira_lst[-2]])


print("-"*55)
kata_map = {}
kata_lst = []
for line in open(file_in2, encoding='utf-8'):
    line = line.strip()
    if not line:continue
    kata_lst.append(line)
    if pt.match(line):
        kata_map[line] = kata_lst[-2]

kana = []
for tu in hira_map:
    roma = tu[0]
    hira = tu[1]
    kata = kata_map.get(roma,"")
    val = [roma,hira,kata]
    kana.append(val)

a = []
i = []
u = []
e = []
o = []
r = []
w = []
for tu in kana:

    if tu[0].endswith("a"):a.append(tu)
    if tu[0].endswith("i"):i.append(tu)
    if tu[0].endswith("u"):u.append(tu)
    if tu[0].endswith("e"):e.append(tu)
    if tu[0].endswith("o"):o.append(tu)
    
    if tu[0].startswith("r"):r.append(tu)
    if tu[0].startswith("w"):w.append(tu)
for n in range(0,8):
    print(a[n],i[n],u[n],e[n],o[n])

print(r)
print(w)