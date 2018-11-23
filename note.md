

##笔记

前言:
2016年国庆松之苍入坑, 现在签到771天, 我可以很负责任地说: 这游戏很养生, 一点都不肝(滑稽)
所以我才决定利用这些闲出来的时间(滑稽)整理一下式神的语音台词, 其实NGA已经有最全的台词整理了, 我只是把它搬运到小程序上, 顺便做了一些补充:
1, 视频和音频素材
2, 日语单词的假名注音
3, 录音功能(阴险)

关于小程序:
今年4月份开始, 从购买服务器/域名, 备案, 到设计/开发等等全部都是因为个人的兴趣, 小程序不会涉及任何形式的商业盈利.
我爱阴阳师, 阴阳师是我活着的意义(滑稽)

除此之外, 我还写了一个五十音主题的连连看, 如果你是日语萌新或者在学习五十音, 可以来体验一下"假名●连连看"

本帖的目的主要是记录整理和分享, 顺便提高自己的日语水平(大概)

签到--超级玛丽?
===


实验室简介
===

商店(主题曲)
===

准考证?
===

t_paper
paper_id,
title,
description,
level,
difficulty,
total,
status,
uploader,
c_date,

--

t_question
paper_id,
question_id,
option_a,
option_b,
option_c,
option_d,
content,
right_option,
explain,
point,
type,
src_sound,
src_image,
article,
uploader,
c_date

--
t_answer_tmp
openid,
paper_id,
answer,
spend,
status,
c_date

--
t_answer
openid,
paper_id,
answer,
spand,
point,
status,
c_date

--

update t set A = case when B=条件 then '111' else '222' end


--
t_user
skin
coin
status
coin_date
heart_date
latest_date
--
t_record
(record_id,file_id,src_record,master_id,heart,status,c_date)
--
t_heart
primary key (record_id,user_id)
record_id = file_id + new Date().getTime()
(record_id,user_id,file_id,master_id,status)


====
insert into t_heart (record_id,user_id,file_id,master_id,status) values ('110','Jon','555','uon',1);
insert into t_heart (record_id,user_id,file_id,master_id,status) values ('111','Jon','555','fon',1);
insert into t_heart (record_id,user_id,file_id,master_id,status) values ('110','Foo','555','uon',1);
insert into t_heart (record_id,user_id,file_id,master_id,status) values ('123','Jon','666','fon',1);

insert into t_record (record_id,file_id,src_record,master_id,heart,status) values ('112','555','srccrd','uon',1,1)
insert into t_record (record_id,file_id,src_record,master_id,heart,status) values ('113','555','src333','Foo',1,1)
insert into t_record (record_id,file_id,src_record,master_id,heart,status) values ('114','666','src44','Foo',1,1)

--初始master-判断是否已点赞
select * from t_record where file_id = 555
select * from t_heart where file_id = '555' and user_id = 'Jon'

--点赞
--如果  多次提交  会触发主键冲突?(点击太快的处理,与取消点赞(coin不变)--status=0为取消点赞状态)
--尝试insert 如果成功 coin+1,heart+1,self.coin +1?

insert t_heart (record_id,user_id,file_id,master_id,status,now()) values()
update t_record set heart = heart+1 where record_id = 114

--[取消点赞]放在[...]
update t_heart set status = 1 where record_id = '110' and user_id='Jon'
update t_record set heart = heart-1 where record_id = 114


====


select rc.*,ht.user_id from t_record rc left join t_heart ht on (rc.record_id = ht.record_id) where rc.file_id = 555

update t_record set heart = heart+1 where record_id = ?
insert t_heart (record_id,user_id,file_id,master_id,status,now()) values()

--签到
update t_user set coin = (case when to_days(now()) == to_days(coin_date) then coin else coin + 1 end),coin_date = now() where user_id = 


ON DUPLICATE KEY UPDATE status = 1

update t_heart set status = 0 where record_id = ? and user_id = ?

update t_user set nick_name = "Jon" where openid = 'ocVQY4-dF2m4IiYTTJZFo6k-NZbE'

--本周排序--
select th.user_id tud,tre.*,to_days(now()) - to_days(tre.c_date) dday FROM t_record tre left join t_heart th on (th.record_id = tre.record_id) order by case when to_days(now()) - to_days(tre.c_date) < 3 then 0 else 1 end,heart desc