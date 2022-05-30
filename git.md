
# Git基本操作
## 1、设置全局用户：
git config --global user.name "Jon"
git config --global user.email "jonoz@qq.com"
## 2、创建版本库：
git init
## 3、文件添加到本地仓库：
git add readme.txt
## 4、将Add的文件提交到本地版本库：
git commit -m "git start"
## 5、查看命令：
git config --list
git status
## 6、文件对比：
git diff readme.txt
## 7、查看分支/版本日志：
git log
git log --graph
git reflog
## 8、版本跳转：
git reset --hard head^
git reset --hard e4b2afa
## 9、让文件回到最近一次git commit或git add时的状态：
git checkout -- readme.txt
### 注意 -- 前后有空格
## 常用命令组合
git stash -- 暂存本地代码
git pull
git stash pop -- 处理冲突(如果有)
git push
## 发布版本，把dev合并到master
git checkout master
git merge dev -- 处理冲突(如果有)
git push

#远程仓库
## 1、创建SSH Key：
ssh-keygen -t rsa –b 4096 -C "jonoz@qq.com"
### 一路回车，把id_rsa.pub的内容添加到自己的github账号
## 2、关联远程仓库：
git remote add origin git@github.com:Jonzheng/note.git
### 先在github new repository(hello_storm)
## 3、克隆远程仓库：
git clone git@github.com:Jonzheng/note.git
## 4、提交到远程仓库：
git push -u origin master
### 可能会遇到Permission denied (publickey).
### 可以尝试先clone修改后在push
# 分支
## 1、创建/切换分支：
git checkout -b dev
### ==
git branch dev
git checkout dev
## 2、查看当前分支：
git breach
## 3、快速合并dev到当前分支：
git merge dev
## 4、删除分支：
git branch -d dev
# Vim基本命令
## 1、退出保存：
Esc+":"+"wq"	Esc+":"+"q!"	Esc+":"+"!"


ssh -vT git@github.com

## ping github.com time out?
### 配置--同目录下touch config
Host github.com
User jonoz@qq.com
Hostname ssh.github.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_rsa
Port 443


	
# 网站
## Git Magic：
http://www-cs-students.stanford.edu/~blynn/gitmagic/intl/zh_cn/index.html
## 廖雪峰Git教程：
http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000
## 常用命令整理：
http://justcoding.iteye.com/blog/1830388