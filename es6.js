


//---优雅的---ES6---优雅的---:
//$ is undefined
window.onload=function(){}

//数组方法
arr = [1,2,3,4,5,6]
//排序
arr = [{"age":23},{"age":21},{"age":15},{"age":21},{"age":8}]
arr.sort((a,b)=> {return a.age - b.age}) //顺序

arr.includes(5)
//关于for of in
//of 遍历value,in 遍历key {} no of
for (let v of arr.values() ){
    console.log(v)
}
arr.forEach((item) =>{
    item += 1
})

//let 解决了var 的变量域提升
    const funcs = []
    for (var i = 0; i < 10; i++) {
        console.log(i)
        //0-10
        funcs.push(function() {
            console.log(i)
        })
    }
//
    funcs.forEach(func => func())
    //10*10

//参数处理
    let name='Jon'
    console.log(`hello ${Jon}`) //hello Jon

//换行等--原格式处理
    const template = `<div>
        <span>hello world</span>
    </div>`

// 1.includes：判断是否包含然后直接返回布尔值
    let str = 'hahay'
    console.log(str.includes('y')) // true
// 2.repeat: 获取字符串重复n次
    let s = 'he'
    console.log(s.repeat(3)) // 'hehehe'

//默认参数
    function action(num = 200) {
        console.log(num)
    }

//--箭头函数
//-不需要 function 关键字来创建函数
//-省略 return 关键字
//-继承当前上下文的 this 关键字
//例如：
    [1,2,3].map(x => x + 1)
    
//等同于：
    [1,2,3].map((function(x){
        return x + 1
    }).bind(this))

//当你的函数有且仅有一个参数的时候，是可以省略掉括号的。
//当你函数返回有且仅有一个表达式的时候可以省略{} 和 return；例如:
    var people = name => 'hello' + name
    
//参数name就没有括号
//作为参考

    var people = (name, age) => {
        const fullName = 'h' + name
        return fullName
    } 
    //如果缺少()或者{}就会报错

//键值同名可以省略
    function people(name, age) {
        return {
            name,
            age
        };
    }

//省略冒号与 function 关键字
    const people = {
        name: 'Jon',
        getName: function() {
            console.log(this.name)
        }
    }
//ES6通过省略冒号与 function 关键字，将这个语法变得更简洁

    const people = {
        name: 'Jon',
        getName(){
            console.log(this.name)
        }
    }

//浅复制
const objA = { name: 'Jon', age: 18 }
    const objB = { address: 'gz' }
    const objC = {} // 这个为目标对象
    const obj = Object.assign(objC, objA, objB)

    // 我们将 objA objB objC obj 分别输出看看
    console.log(objA)   // { name: 'cc', age: 18 }
    console.log(objB) // { address: 'gz' }
    console.log(objC) // { name: 'cc', age: 18, address: 'gz' }
    console.log(obj) // { name: 'cc', age: 18, address: 'gz' }

    // 是的，目标对象ObjC的值被改变了。
    // so，如果objC也是你的一个源对象的话。请在objC前面填在一个目标对象{}
    const newObj = Object.assign({}, objC, objA, objB)

//解构
    const people = {
        name: 'Jon',
        age: 20
    }
    const { name, age } = people
    console.log(`${name} --- ${age}`)
    //数组
    const color = ['red', 'blue']
    const [first, second] = color
    console.log(first) //'red'
    console.log(second) //'blue'

// 请使用 ES6 重构一下代码
    // 第一题
    var jsonParse = require('body-parser').jsonParse

    // 第二题
    var body = request.body
    var username = body.username
    var password = body.password
    
    //------------
    const {jsonParse} = require('body-parser')
    const {body, {username, password} } = request
    
//展开符
//数组
    const color = ['red', 'yellow']
    const colorful = [...color, 'green', 'pink']
    console.log(colorful) //[red, yellow, green, pink]
    
    //对象
    const alp = { fist: 'a', second: 'b'}
    const alphabets = { ...alp, third: 'c' }
    console.log(alphabets) //{ "fist": "a", "second": "b", "third": "c"
//数组
    const number = [1,2,3,4,5]
    const [first, ...rest] = number
    console.log(rest) //2,3,4,5
    //对象
    const user = {
        username: 'Jon',
        gender: 'female',
        age: 19,
        address: 'peking'
    }
    const { username, ...rest } = user
    console.log(rest) //{"address": "peking", "age": 19, "gender": "female"

    const first = {
        a: 1,
        b: 2,
        c: 6,
    }
    const second = {
        c: 3,
        d: 4
    }
    const total = { ...first, ...second }
    console.log(total) // { a: 1, b: 2, c: 3, d: 4 }

//导入导出import export
//全部导入
    import people from './example'

    //有一种特殊情况，即允许你将整个模块当作单一对象进行导入
    //该模块的所有导出都会作为对象的属性存在
    import * as example from "./example.js"
    console.log(example.name)
    console.log(example.age)
    console.log(example.getName())

    //导入部分
    import {name, age} from './example'

    // 导出默认, 有且只有一个默认
    export default App

    // 部分导出
    export class App extend Component {};

//
    1.当用export default people导出时，就用 import people 导入（不带大括号）

    2.一个文件里，有且只能有一个export default。但可以有多个export。

    3.当用export name 时，就用import { name }导入（记得带上大括号）

    4.当一个文件里，既有一个export default people, 又有多个export name 或者 export age时，导入就用 import people, { name, age } 

    5.当一个文件里出现n多个 export 导出很多模块，导入时除了一个一个导入，也可以用import * as example
    
//Promise
    fetch('/api/todos')
      .then(res => res.json())
      .then(data => ({ data }))
      .catch(err => ({ err }));
      
//题目

