# Chapter 06：JavaScript 对象

## 概述

1. 对象是从字符串到值的映射。除了字符串，数字，true，false，null，undefined 之外，Javascript 中的值都是对象。
1. 除了保持自有的属性，Javascript 对象还可以从原型继承属性。对象的方法通常是继承的属性。
1. 对象的常见用法是创建 create，设置 set，查询 query，删除 delete，检测 test，枚举 enumerate 它的属性。
1. 除了名字和值之外，每个属性还有属性特性(property attribute):
   - writable，是否可以设置该属性。
   - enumerable，是可以通过 for/in 循环返回该属性。
   - configurable，是否可以删除或者修改该属性。
1. 除了包含属性之外，每个对象还有 3 个对象特性(object attribute)。
   - 对象的原型 prototype 指向另一个对象，本对象的属性继承自他的原型对象。
   - 对象的类 class 是一个标识对象类型的字符串。
   - 对象的扩展标记 extensible flag 指明是否可以向该对象添加新属性。（ES5）
1. 对象可以分为 native object, host object(如浏览器定义的 HTMLElement 等对象), user-defined object。属性可以分为 own property, inherited property(从原型继承)。

## 6.1 创建对象

可以通过以下 3 种方法创建对象：

1. 对象直接量
1. 关键字 new
1. [Object.create()][object.create] 方法（ES5）

[object.create]: (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create)

### 6.1.1 对象直接量

对象直接量是由若干名/值对组成的映射表，名/值对中间用冒号分割，名/值对之间用逗号分隔，整个映射表用花括号括起来。

**_兼容问题：最后一个属性后如果有逗号，在 IE 浏览器中会报错。_**

    var empty = {}
    var point = { x: 0, y: 0 }
    var point2 = { x: point.x, y: point.y + 1 }
    var book = {
        "main title": "Javascript",           // 属性名有空格，必须加引号用字符串表示
        "sub-title": "The Definitive Guide",  // 属性名有连字符-，需要加引号
        "for": "all audiences",               // for是关键字，需要加引号
        author: {                             // 属性值是一个对象
            firstname: "David",               // 这里的属性名加不加引号都OK
            "surname": "Flanagan"
        }
    }

对象直接量是一个表达式，**每次运算都将创建并初始化一个新的对象。** 如果在一个循环内部使用可对象直接量，它将创建很多新对象，并且每次创建的属性值也有可能不同。

例：

    var num = 0;
    var temp;
    var values = [];
    for (var i = 0; i < 5; i++) {
        var obj = {value: num++}
        if (temp !== obj) {
            values.push(obj.value)
        }
        temp = obj
    }

    // output: 5 object(s) created, values are 0, 1, 2, 3, 4
    console.log(values.length + " object(s) created, values are " + values.join(", "))

### 6.1.2 通过 new 创建对象

关键字 new 后面跟随一个函数调用。这里函数称作构造函数 constructor，用以初始化一个新创建的对象。Javascript 的原始类型都包含内置构造函数。

    var o = new Object()
    var a = new Array()
    var d = new Date()
    var r = new RegExp()

### 6.1.3 原型

每一个 Javascript 对象(null 除外)都和原型对象相关联，每一个对象都从原型继承属性。

- 所有通过对象直接量创建的对象都具有同一个原型对象——Object.prototype。
- 通过关键字 new 和构造函数调用创建的对象的原型就是构造函数的 prototype 属性的值。因此 new Array()对象的原型是 Array.prototype，new Date()对象的原型是 Date.prototype，new Object()对象的原型是 Object.prototype

没有原型的对象为数不多，Object.prototype 就是其中之一。它不继承任何属性。  
其他原型对象都是普通对象，普通对象都具有原型。举例说明如下：

    function f() {}
    var o = new f()
    var p = Object.getPrototypeOf(o) // o的原型对象p就是普通对象，一个空的object对象{}
    Object.getPrototypeOf(p) === Object.prototype // => true p的原型对象是Object.prototype

所有内置的构造函数(以及大部分自定义的构造函数)都具有一个继承自 Object.prototype 的原型。例如 Date.prototype 就是继承自 Object.prototype，因此 new Date()创建的对象的属性同时继承自 Date.prototype 和 Object.prototype。这一系列链接的原型对象就是 **原型链(prototype chain)**

### 6.1.4 Object.create()

ES5 定义了 [Object.create()][object.create] 方法，第一个参数是这个对象的原型，第二个可选参数可以进一步描述对象的属性。

    var o1 = Object.create({x:1, y:2})       // o1继承了属性x和y
    var o2 = Object.create(null)             // o2没有原型对象，就连基础方法toString等都没有，不能和+连接符正常工作
    var o3 = Object.create(Object.prototype) // o3和{}, new Object()一样

## 6.2 属性的查询和设置

可以通过 **点(.)** 或者 **方括号([])** 来获取和设置属性的值。
点的右侧必须是一个属性名称命名的简单标识符。方括号内必须是一个计算结果为字符串的表达式。

    // 设置属性的值
    var author = book.author
    var title = book["main title"]

    // 查询属性的值
    book.edition = 6;
    book["main title"] = "ECMAScript"

[MY-EX] 更加复杂的例子：

    var a = {};
    var b = {};

    var f = function() {};
    var g = function() {};

    var d = new Date();

    var obj = {
        [a]: a, [b]: b, [f]: f, [g]: g, [d]: d.getTime(),
        null: null, undefined: undefined, NaN: NaN
    };

    console.log(obj);

输出结果如下：

    {[object Object]: {…}, function() {}: ƒ,
    Wed Apr 10 2019 22:50:01 GMT+0800 (中国标准时间): 1554907801674,
    null: null, undefined: undefined, NaN: NaN}

可以看到：输出结果中，2 个 Object 对象被合并成一个了(2 个 function 对象同理)。这是因为 Object 对象的 toString 方法返回的是它的 protype 对象，而 2 个 Object 对象的 protype 是一样的， key 出现了重复，前一个的值就会被后一个覆盖。

### 6.2.1 作为关联数组的对象

使用方括号([])运算符可以在运行时动态添加属性值，而点(.)运算的标识符是静态的，不能动态修改。

    function addstock(portfolio, stockname, shares) {
        portfolio[stockname] = shares
    }

### 6.2.2 继承

假设要查询对象 o 的属性 x，如果 o 中不存在 x，那么将会在 o 的原型对象 p 中查找 x。如果 p 中也没有 x，而且 p 也有原型，那么在 p 的原型中继续查找，直到找到 x 或者找到一个原型是 null 的对象为止。

对象的原型属性构成了一个“链”，通过这个“链”可以实现属性的继承。

    function inherit(p) {
        if (p == null) throw TypeError();

        if (Object.create) {
            return Object.create(p);
        }

        if (typeof p !== "object" && typeof p !== "function") throw TypeError();

        var f = function () { };
        f.prototype = p;
        return new f();
    }

    // 读取继承的属性
    var o = {};           // o从Object.prototype继承对象的方法
    o.x = 1;
    var p = inherit(o);   // p继承o和Object.prototype
    p.y = 2;
    var q = inherit(p);   // q继承p, o和Object.prototype
    q.z = 3;
    var s = q.toString(); // toString继承自Object.prototype
    q.x + q.y;            // => 3 x, y分别自o和p继承

给对象 o 的属性 k 赋值只可能是一下 3 种情况之一：

1. 赋值失败。不允许赋值的情况，比如继承一个只读的属性，对该属性赋值是不允许的
1. 在对象 o 中，创建一个新的属性 k。适用于对象 o 中原本没有属性 k 的情况
1. 在对象 o 中，设置属性 k 的新值。适用于对象 o 中原本有属性 k 的情况

**属性赋值总是修改原始对象，而不会去修改原型链。**
只有在查询属性时才能体会到继承的存在，而设置属性和继承无关。

    var unitcircle = { r: 1 };
    var c = inherit(unitcircle); // c继承属性r
    c.x = 1;c.y = 1; // c自定义2个属性
    c.r = 2; // c覆盖继承的属性r的值
    unitcircle.r; // =>1 原型对象没有修改

### 6.2.3 属性访问错误

查询一个并不存在的属性，返回 undefined。但是，**如果对象不存在，试图查询这个并不存在的对象的属性就会报错。** null 和 undefined 都没有属性，查询它们的属性会报错。

    null.a      // Uncaught TypeError: Cannot read property 'a' of null
    undefined.a // Uncaught TypeError: Cannot read property 'a' of undefined

    var len = book.subtitle.length // 如果subtitle属性不存在，这里就会报错

避免报错的常见方法

    var len = book && book.subtitle && book.subtitle.length

**_在非严格模式，设置属性失败可能不会报错。_**

    Object.portotype = { x:1 }  // 赋值失败，Object.portotype没有修改，但是没有报错

**_在严格模式下，任何失败的属性设置操作都会抛出一个类型错误异常。_**

    // 严格模式下，赋值失败，会报类型错误
    "use strict"

    /**
     * Uncaught TypeError: Cannot assign to read only property 'prototype' of
     * function 'function Object() { [native code] }'
     */
    Object.prototype = {}

给 null 和 undefined 设置属性也会报类型错误。

    // Uncaught TypeError: Cannot set property 'a' of null
    null.a = 1

以下场景给对象 o 设置属性 p 也会失败：

- o 中的属性 p 是只读的：不能给只读属性重新赋值（defineProperty()方法中属性的 configurable 为 true 的时候例外）
- o 中的属性 p 是继承的，且它是只读的：不能通过同名自有属性覆盖只读的继承属性
- o 中不存在自有属性 p：o 没有使用 setter 方法继承属性 p，并且 o 的可扩展性 extensible attribute 是 false。如果 o 中不存在 p,而且没有 setter 方法可供调用，则 p 一定会添加至 o 中。但是如果 o 不是可扩展的，那么在 o 中不能定义新属性。

举例说明：

    var o = Object.defineProperty({}, "p", { value: 0, writable: false });
    o.p = 1; // 赋值失败，但不报错，严格模式下会报错
    o.p; // => 0 还是原来的值

    var o = Object.defineProperty({}, "p", { value: 0, writable: false, configurable: true });
    /**
     * 赋值失败，但不报错。
     * 严格模式下会报错：Uncaught TypeError: Cannot assign to read only property 'p' of object '#<Object>'
     */
    o.p = 1;
    o.p; // => 0 还是原来的值
    Object.defineProperty(o, "p", { value: 2 }); // 修改成功
    o.p; // => 2

    var pro = Object.defineProperty({}, "p", { value: 0, writable: false }); // 设置pro的p属性为只读
    var o = Object.create(pro) // pro是o的原型
    o.p = 1; // 赋值失败，但不报错。严格模式下报类型错误
    o.p // => 0

    var o = {};
    o.p2 = 5;                    // 赋值成功
    Object.preventExtensions(o); // o是不可扩展的
    o.p = 2;                     // 赋值失败，但是不报错
    o.p;                         // => undefined
    o.p2                         // => 5

    var pro = { set p2(value) { this.value = value * 2 } };
    var o = Object.create(pro)
    o.value = 0;
    Object.preventExtensions(o)
    /**
     * 赋值失败，但不报错。
     * 严格模式下会报错：Uncaught TypeError: Cannot add property p, object is not extensible
     */
    o.p = 5;
    o.p2 = 10; // p2是继承属性，赋值成功
    o.value    // => 20

## 6.3 删除属性

delete 运算符可以删除对象的属性。它的操作数应当是一个属性访问表达式。

    delete book.author // book不再有属性author

**_delete 只是断开属性和宿主对象的联系，而不会直接从内存中销毁该属性_**

    o = { p: { x: 1 } };
    p = o.p;
    delete o.p;
    p.x;        // => 1  这种不严谨的代码可能引起内存泄漏。在销毁对象的时候，需要尤其注意。

delete 只能删除自有属性，不能删除继承属性。要删除继承属性必须从定义这个属性的原型对象上删除它，这会影响到所有继承自这个原型的对象。

    var p = { x: 1 };
    var o1 = Object.create(p);
    var o2 = Object.create(p);

    o1.x = 2;
    delete o1.x;             // o1中定义的x属性被删除
    delete o2.x;             // 无法删除原型p中的x属性
    console.log(o1.x, o2.x); // => 1 1

    delete p.x;              // 原型对象中的x属性被删除，o1和o2对象都会受到影响
    console.log(o1.x, o2.x); // => undefined undefined

当 delete 删除成功，或者没有任何副作用（比如删除不存在的属性）时，它返回 true。如果 delete 后面不是一个属性访问表达式，delete 也返回 true。

    o = {x: 1}
    delete o.x         // => true 删除成功
    delete o.x         // => true 什么也不做（x不存在了）
    delete o.toString  // => true toString是继承来的，什么也不做
    delete 1           // => true 无意义

**delete 不能删除那些可配置性为 false 的属性。**  
某些内置对象的属性是不可配置的，比如通过变量声明和函数声明创建的全局对象的属性。  
在严格模式中，删除一个不可配置属性会报一个类型错误。在非严格模式中，delete 会返回 false

    delete Object.prototype // 不能删除，属性是不可配置的
    var x = 1;              // 声明一个全局变量
    delete this.x;          // 不能删除全局变量
    function f() {};        // 声明一个全局函数
    delete this.x;          // 不能删除全局函数

在非严格模式删除全局对象的可配置属性时，可以省略对全局变量的引用。

    this.x = 1; // 创建一个可配置的全局属性（没有用var）
    delete x;

在严格模式中，必须显示指定对象以及属性，否则会报语法错误

    "use strict"
    this.x = 1
    delete x      // Uncaught SyntaxError: Delete of an unqualified identifier in strict mode.
    delete this.x // 正常工作

## 6.4 检测属性

判断某个属性是否在某个对象中，可以通过以下方法完成：

1. in 运算符
1. hasOwnProperty()方法
1. propertyIsEnumerable()方法
1. 属性查询(o.p !== undefined)

in 运算符左侧是属性名(字符串)，右侧是对象。如果对象的**自有属性或者继承属性**包含这个属性则返回 true

    var o = { x: 1 }
    "x" in o         // true 自有属性
    "y" in o         // false 该属性不存在
    "toString" in o  // true 继承属性

对象的 hasOwnProperty 方法用来检测给定的名字是否是对象的**自有属性**。继承属性将会返回 false。

    var o = { x: 1 };
    o.hasOwnProperty("x");        // true 自有属性
    o.hasOwnProperty("y");        // false 属性不存在
    o.hasOwnProperty("toString"); // false 继承属性

对象的 propertyIsEnumerable()方法只有检测到 **自有属性且该属性的可枚举性为 true** 时，它才返回 true。  
某些内置属性是不可枚举的。通常由 JavaScript 代码创建的属性都是可枚举的，除非在 ES5 中明确指定属性的可枚举性。

    var o = Object.create({ y: 2 });
    o.x = 1;
    o.propertyIsEnumerable("x"); // true
    o.propertyIsEnumerable("y"); // false 继承属性
    Object.prototype.propertyIsEnumerable("toString"); // false 不可枚举

使用!==判断一个属性是否 undefined

    var o = { x: 1 };
    o.x !== undefined; // true
    o.y !== undefined; // false
    o.toString !== undefined; // true

当对象的属性值为 undefined 的时候，只能使用 in 运算符来代替上述方法

    var o = { x: undefined };
    o.x !== undefined; // false 属性存在，但是值为undefined
    o.y !== undefined; // false 属性不存在
    "x" in o;          // true  属性存在
    "y" in o;          // false 属性不存在
    delete o.x;
    "x" in o;          // false 属性不存在

## 6.5 枚举属性

通常使用 for/in 循环遍历对象中所有可枚举的属性（包括自有属性和继承属性），把属性名称赋值给循环变量。

    var o = { x: 1, y: 2, z: 3 };
    o.propertyIsEnumerable("toString"); // false
    for (p in o) console.log(p);        // 只会输出x, y, z， 不会输出toString

有许多使用工具库给 Object.prototype 添加了新的方法或者属性。ES5 之前，这些新添加的方法都是可枚举的（不能定义为不可枚举），因此在 for/in 循环中都可以枚举出来。为了避免这种情况，常使用下面 2 种方式过滤返回的属性:

    for (p in o) {
        if (!o.hasOwnProperty(p)) continue;
    }
    for (p in o) {
        if (typeof o[p] === "function") continue;
    }

以下是一些有用的工具函数来操控对象的属性

    /**
    * 把base中的可枚举属性赋值到o中，并返回o。
    * 如果o和base中含有同名属性，则覆盖o中的属性。这点和面向对象的继承方式不同。
    * 这个函数不处理getter和setter以及属性复制。
    */
    function extend(o, base) {
        for (p in base) {
            o[p] = base[p];
        }
        return o;
    }

    /**
    * 把base中的可枚举属性赋值到o中，并返回o。
    * 如果o和base中含有同名属性，o中的属性不受影响。这点和面向对象的继承方式相同。
    * 这个函数不处理getter和setter以及属性复制。
    */
    function merge(o, base) {
        for (p in base) {
            if (o.hasOwnProperty(p)) continue;
            o[p] = base[p];
        }
    }

    /**
    * 返回一个数组，这个数组包含的是o中可枚举的自有属性的名字
    */
    function keys(o) {
        if (typeof o !== "object") throw TypeError();
        var result = [];
        for (p in o) {
            if (o.hasOwnProperty(p)) result.push(p);
        }
        return result;
    }

ES5 提供了 2 个函数用来枚举对象的属性名称

- Object.keys()返回对象中全部可枚举的自有属性名称
- Object.getOwnPropertyNames()返回对象中所有的自有属性名称，包括不可枚举的属性。ES3 无法实现该功能。

## 6.6 属性 getter 和 setter

ES5 中，属性值可以用 getter 和 setter 方法来定义，这种属性叫做**存取器属性(accessor property)**。它不同于我们常见的数据属性(data property)，数据属性只有一个简单值。

当查询存取器属性的值时，JavaScript 调用 getter 方法（无参数），获取其返回值即可。当设置一个存取器属性的值时，JavaScript 调用 setter 方法，将赋值表达式右侧的值当作参数传入 setter。

存取器属性不具有可写性 writable attribute。如果它只有 getter 方法，那么它是一个只读属性。如果它只有 setter 方法，那么它是一个只写属性。getter/setter 方法都有的情况下，它是一个读/写属性。**这 3 种存取器属性都可以被 for/in 运算符遍历。**

使用对象直接量是定义存取器属性最简单的方法。

    var o = {
        // 普通的数据属性
        data_prop: value,

        // 存取器属性是成对定义的函数
        get accessor_prop() {
            /* 这里是函数体 */
        },
        set accessor_prop(value) {
            /* 这里是函数体 */
        }
    };

    var p = {
        x: 1.0,
        y: 1.0,

        // 可读写的存取器属性
        set r(newvalue) {
            var oldvalue = Math.sqrt(this.x * this.x + this.y * this.y);
            var ratio = newvalue / oldvalue;
            this.x *= ratio;
            this.y *= ratio;
        },
        get r() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },

        // 只读的存取器属性
        get theta() {
            return Math.atan2(this.y, this.x);
        }
    };

和数据属性一样，存取器属性是可以继承的。

    var q = Object.create(p);
    q.x = 3, q.y = 4;
    console.log(q.r); // => 5 可以使用继承的存取器属性

[MY-EX] **_在 getter 和 setter 方法中使用访问器属性自己的值时候，极容易出现无限递归，造成堆栈溢出。_**

    var o = {
        x: 0,
        get x() {
            return this.x;
        },
        set x(value) {
            this.x = value;
        }
    };

    // 读写的时候都会报错
    o.x = 1 // Uncaught RangeError: Maximum call stack size exceeded
    o.x     // Uncaught RangeError: Maximum call stack size exceeded

**同一个对象中，同名的属性，后定义的会覆盖前面定义的。** 上述例子中，x 就是一个存取器属性，数据属性被覆盖了。  
下面的列子中，x 就是一个数据属性，存取器属性被覆盖了。

    var o = {
        get x() {
            return this.x;
        },
        set x(value) {
            this.x = value;
        },
        x: 0
    };

## 6.7 属性的特性(property attribute)

ES5 可以标识属性可写，可枚举，和可配置的特性，ES3 中无法设置这些特性。

对于库的开发者来说非常重要，因为：

- 可以给原型对象添加方法，将它们设置成不可枚举的，这让他们看起来更像内置方法。
- 可以给对象定义不能修改或删除的属性，借此“锁定”这个对象

数据属性的 4 个特性分别是

1. 值 value
1. 可写性 writable
1. 可枚举型 enumerable
1. 可配置性 configurable

存取器属性的 4 个特性分别是

1. 读取 get
1. 写入 set
1. 可枚举型 enumerable
1. 可配置性 configurable

ES5 定义了“属性描述符”property descriptor 的对象，用来代表那 4 个特性。通过调用 Object.getOwnPropertyDescriptor()可以获取某个对象特定属性的属性描述符。

    // => {get: ƒ, set: ƒ, enumerable: true, configurable: true}
    Object.getOwnPropertyDescriptor(p, "r")

    // => {value: 1, writable: true, enumerable: true, configurable: true}
    Object.getOwnPropertyDescriptor({x:1}, "x")

    // 对于继承属性和不存在的属性，返回undefined
    Object.getOwnPropertyDescriptor({}, "x")         // => undifined 属性不存在
    Object.getOwnPropertyDescriptor({}, "toString")  // => undefined 继承属性

要想设置属性的特性，需要调用 [Object.defineProperty()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 方法，传入要修改的对象，要创建或修改的属性的名称以及属性描述符对象。**Object.defineProperty()只能创建或修改自有属性，不能修改继承属性。**

    var o = {};
    // 添加一个不可枚举的数据属性x，并赋值为1
    Object.defineProperty(o, "x", {
        value: 1,
        writable: true,
        enumerable: false,
        configurable: true
    });

    // 属性是存在的，但是不可枚举
    o.x; // 1
    Object.keys(o); // []

    // 让x变成只读
    Object.defineProperty(o, "x", { writable: false });

    // 试图修改x的值
    o.x = 2; // 赋值失败但不会报错，在严格模式下抛出类型错误异常

    o.x; // => 1

    // 属性是可配置的，可以修改属性的值
    Object.defineProperty(o, "x", { value: 2 });
    o.x; // => 2

    // 将x从数据属性修改为存取器属性
    Object.defineProperty(o, "x", {
        get: function() {
            return 0;
        }
    });
    o.x; // => 0

要同时修改或者创建多个属性，可以使用 [Object.defineProperties()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties) 方法。

    Object.defineProperties({}, {
        x: { value: 1, writable: true, configurable: true, enumerable: true },
        y: { value: 1, writable: true, configurable: true, enumerable: true },
        r: {
          get: function() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
          },
          configurable: true,
          enumerable: true
        }
      }
    );

Object.defineProperty()和 Object.defineProperties()方法必须遵循下列规则，否则会抛出类型错误异常。

1. 如果对象是不可扩展的，则可以编辑已有的自有属性，但不能给它添加新属性。
1. 如果属性是不可配置的，则不能修改它的可配置性和可枚举性。
1. 如果存取器属性是不可配置的，则不能修改其 getter 和 setter 方法，也不能将它转换成数据属性。
1. 如果数据属性是不可配置的，则不能将它转换成存取器属性。
1. 如果数据属性是不可配置的，则不能将它的可写性从 false 修改为 true，但是可以从 true 修改为 false。
1. 如果数据属性是不可配置且不可写的，则不能修改它的值。然而可配置但不可写属性的值是可以修改的（实际上是先标记为可写，修改它的值之后，转换成不可写的）。

以下是一些例子和说明

    // 1. 如果对象是不可扩展的，则可以编辑已有的自有属性，但不能给它添加新属性。
    var o = { x: 1 };
    Object.preventExtensions(o);               // 将对象设置为不可扩展的
    Object.defineProperty(o, "x", {value: 2}); // 可以编辑已有的属性
    o.x // => 2
    // Uncaught TypeError: Cannot define property y, object is not extensible
    Object.defineProperty(o, "y", {value: 1});


    // 2. 如果属性是不可配置的，则不能修改它的可配置性和可枚举性。
    var o = Object.defineProperty({}, "x", {
      value: 0,
      enumerable: true,
      configurable: false
    });
    // Uncaught TypeError: Cannot redefine property: x
    Object.defineProperty(o, "x", { configurable: true });
    // Uncaught TypeError: Cannot redefine property: x
    Object.defineProperty(o, "x", { enumerable: false });


    // 3. 如果存取器属性是不可配置的，则不能修改其 getter 和 setter 方法，也不能将它转换成数据属性。
    var o = Object.defineProperty({}, "x", {
      get: function() { return 0 },
      configurable: false
    });
    // Uncaught TypeError: Cannot redefine property: x
    Object.defineProperty(o, "x", { get: function() { return 0 }} )
    // Uncaught TypeError: Cannot redefine property: x
    Object.defineProperty(o, "x", {value: 2})


    // 4. 如果数据属性是不可配置的，则不能将它转换成存取器属性。
    var o = Object.defineProperty({}, "x", { value: 0, configurable: false, writable: true });
    Object.defineProperty(o, "x", { value: 1 }); // OK
    o.x // => 1
    // Uncaught TypeError: Cannot redefine property: x
    Object.defineProperty(o, "x", { get: function() { return 1 } });


    // 5. 如果数据属性是不可配置的，则不能将它的可写性从 false 修改为 true，但是可以从 true 修改为 false。
    var o = Object.defineProperty({}, "x", {value: 0, configurable: false, writable: true});
    Object.defineProperty(o, "x", { writable: false }); // OK
    // Uncaught TypeError: Cannot redefine property: x
    Object.defineProperty(o, "x", { writable: true });


    // 6. 如果数据属性是不可配置且不可写的，则不能修改它的值。然而可配置但不可写属性的值是可以修改的。
    var o = Object.defineProperty({}, "x", {value: 0, configurable: false, writable: false});
    // Uncaught TypeError: Cannot redefine property: x
    Object.defineProperty(o, "x", { value: 1 });
    var o2 = Object.defineProperty({}, "x", {value: 0, configurable: true, writable: false});
    Object.defineProperty(o2, "x", { value: 1 }); // OK
    o2.x // => 1

现在，我们的 extend 方法不再简单复制名和值，还可以包含属性的特性了

    /**
     * 给Object.prototype添加一个不可枚举的extend方法
     * 这个方法继承自调用它的对象，将作为参数传入的对象的属性一一复制
     * 除了值之外，也会复制属性的所有特性，除非在目标对象中存在同名属性
     */
    Object.defineProperty(Object.prototype, "extend", {
      writable: true,
      configurable: true,
      enumerable: false,
      value: function(o) {
        // 得到所有的自有属性，包括不可枚举的
        var names = Object.getOwnPropertyNames(o);
        for (var i = 0; i < names.length; i++) {
          var name = names[i];
          // 如果属性已经存在，则跳过
          if (name in this) continue;
          var desc = Object.getOwnPropertyDescriptor(o, name);
          Object.defineProperty(this, name, desc);
        }
      }
    });

## 6.8 对象的 3 个属性

每一个对象都有与之相关联的原型 prototype，类 class 和可扩展性 extensible attribute

### 6.8.1 原型属性

对象的原型属性是用来继承属性的。原型属性在实例对象创建之初就设置好的：

- 通过对象直接量创建的对象，原型是 Object.prototype。
- 使用 new 创建的对象，原型是构造函数的 prototype 属性
- 通过 Object.create()方法创建的对象，使用第一个参数作为原型

ES5 中，将对象作为参数传入 [Object.getPrototypeOf()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf) 可以查询它的原型。要检测一个对象是否是另一个对象的原型（或处于原型链中），需要使用 [isPrototypeOf()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isPrototypeOf) 方法。

    var p = { x: 1 };
    var o = Object.create(p);
    p.isPrototypeOf(o);                 // => true
    Object.prototype.isPrototypeOf(o);  // => true

    // both are true
    Object.getPrototypeOf(o) === p
    Object.getPrototypeOf(p) === Object.prototype

### 6.8.2 类属性

对象类属性 class attribute 是一个字符串，用来表示对象的类型信息。ES3 和 ES5 中没有设置该属性的方法，并且只有一种间接的方法来查询它。  
默认的 toString()方法(继承自 Object.prototype)返回[Object *class*]格式的字符串，这里的 _class_ 就是我们要找的类属性的值。

    function classof(o) {
        if (o === null) return "NUll";
        if (o === undefined) return "Undefined";
        // 防止toString被重写，这里调用Object.prototype中原始的toString方法
        return Object.prototype.toString.call(o).slice(8, -1);
    }

    classof(null)       // Null
    classof(undefined)  // Undefined
    classof(1)          // Number
    classof("")         // String
    classof(true)       // Boolean
    classof({})         // Object
    classof([])         // Array
    classof(/./)        // Regexp
    classof(new Date()) // Date
    classof(window)     // Window
    function f() {}
    classof(new f())    // Object

### 6.8.3 可扩展性

对象的可扩展性表示是否可以给对象添加新属性。所有内置对象和自定义对象都是可扩展的，宿主对象的可扩展性由 JavaScript 引擎定义。

ES5 中可以使用 [Object.isExtensible()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible) 方法来判断对象是否可扩展。要设置对象的可扩展性，需要使用 [Object.preventExtensions()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions) 方法，该方法只影响对象本身的可扩展性，原型对象不受印象。注意：**该方法一旦设置后，将无法逆转**。

可扩展性的目的是将对象“锁定”，以避免外界的干扰。通常和属性的可配置性和可写性配合使用。

[Object.seal()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal) 方法除了可以将对象设置为可以扩展之外，还可以将对象的所有自有属性都设置为不可配置的。也就是说，不能给这个对象添加新属性，而且它已有的属性也不能删除或者配置。但是已经的可写属性依然可以设置新值。该方法同样不可逆，可以使用 [Object.isSealed()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isSealed) 方法来检查对象是否封闭。

    var o = { p: 1 };
    Object.seal(o);
    o.p = 2;    // OK
    o.p;        // => 2
    delete o.p; // => false 删除失败
    o.p;        // => 2

[Object.freeze()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) 方法更严格地锁定对象，除了 seal 的操作之外，它可以将它自有的所有数据属性设置为只读(有 setter 方法的存取器属性不受影响)。使用 [Object.isFrozen()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen) 方法来检测对象是否冻结。

上面 3 个方法都返回传入的对象，所以可以函数嵌套的方式调用它们。

    var o = Object.seal(
        Object.create(Object.freeze({ x: 1 }, { y: { value: 2, writable: true } }))
    );

## 6.9 序列化对象

**对象序列化 serialization**是指将对象的状态转换成字符串，也可以将字符串还原成对象。

ES5 提供了内置函数[JSON.stringify()][json.stringify]和[JSON.parse()][json.parse]来序列化和还原 JavaScript 对象。ES3 中可以从<http://json.org>引入 json2.js 模块来使用这些函数。

[json.stringify]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
[json.parse]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
[json]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON

[JSON][json] 的语法是 JavaScript 语法的子集，它并不能表示 JavaScript 里的所有值。支持以下数据类型，并且可以序列化和还原它们：

1. object
1. array
1. string
1. number
1. boolean
1. null

NaN, Infinity 和-Infinity 序列化的结果是 null，日期对象序列化的结果是 ISO 格式的日期字符串(参考[Date.toJSON][date.tojson]方法)，但是 JSON.parse()依然保留它们的字符串形态，而不会将它们还原为原始日期对象。

[date.tojson]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toJSON

当属性值为以下数据类型时，将不能被序列化和还原：

1. function 函数
1. RegExp
1. Error 对象
1. undefined 值

对于一个不能序列化的属性来说，在序列化后的输出字符串中会将这个属性省略掉。

    var o = { a: 1, b: undefined, c: function() {}, undefined: 5 };
    JSON.stringify(o); // => {"a":1,"undefined":5}

JSON.stringify()只能序列化对象可枚举的自有属性。[JSON.stringify()][json.stringify]和[JSON.parse()][json.parse]都可以接收第二个可选参数，自定义序列化和还原操作，详情参见对应的文档。

## 6.10 对象方法

### 6.10.1 toString() 方法

[toString()方法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)返回一个表示调用这个方法的对象值的字符串。在需要将对象转换为字符串的时候，JavaScript 都会调用这个方法，比如使用“+”连接对象和字符串的时候。

默认的 toString 方法返回的信息很少，很多类都带有自定义的 toString 方法。

### 6.10.2 toLocaleString() 方法

[toLocaleString()方法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toLocaleString)返回本地化的字符串。Date 和 Number 定制了该方法。

### 6.10.3 toJSON() 方法

Object.prototype 中没有 toJSON()方法， 但对于需要执行序列化的对象来说，JSON.stringify()会调用它的 toJSON()方法。如果在待序列化的对象中存在这个方法，则调用它，返回值就是序列化的结果。参见[JSON.stringify()的描述](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#Description)。

### 6.10.4 valueOf() 方法

当 JavaScript 需要将对象转换成某种原始值而非字符串的时候才会调用 [valueOf()方法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf)，尤其时当转换为数字的时候。
