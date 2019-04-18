# Chapter 08：JavaScript 函数

## 概述

[函数 (function)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions) 在 JavaScript 中只定义一次，但可能被执行或调用任意次。函数是参数化的，函数的定义会包括一个称为 **形参 parameter** 的标识符列表，这些参数在函数体中像局部变量一样工作。函数调用会为形参提供 **实参 argument** 的值。函数使用它们实参的值来计算返回值，成为该函数调用表达式的值。除了实参之外，每次调用还会拥有另一个值--本次调用的上下文 context--也就是 [this 关键字][this] 的值。

[this]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this

如果函数挂载在一个对象上，作为对象的一个属性，就称它为对象的方法。当通过这个函数来调用函数时，该对象就是此次调用的上下文 context，也就是 this 的值。用于初始化一个新创建的对象的函数称为构造函数 constructor。

在 JavaScript 里，函数即对象，可以像对象一样操作它们。比如：可以把函数赋值给变量，或者作为参数传给其他函数。还可以给函数设置属性，甚至调用它们的方法。

JavaScript 的函数可以嵌套在其他函数中定义，这样它们就可以访问它们被定义时所处作用域中的任何变量。这意味着 JavaScript 函数构成了一个[闭包 closure][closure]，这给 JavaScript 带来了非常强劲的编程能力。

[closure]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures

## 8.1 函数定义

函数使用 function 关键字来定义，它可以用在函数定义表达式 function expression 和函数声明语句 function declaration 里。函数定义从 function 关键字开始，后面跟随以下内容：

- 函数名称标识符。函数名称是函数声明语句必须的部分。它的用途就像变量的名字，新定义的函数对象会赋值给这个变量。对函数定义表达式来说，这个名字是可选的。
- 一对圆括号，其中包含 0 个或多个用逗号隔开的标识符组成的列表。这些标识符是函数的参数名称，它们就像函数体中的局部变量一样。
- 一对花括号，其中包含 0 条或多条 JavaScript 语句。这个语句都成了函数体：一旦调用函数，就会执行这些语句。

下面是一些例子：

    // 计算阶乘(函数声明)
    function factorial(x) {
      if (x <= 1) return 1;
      return x * factorial(x - 1);
    }

    // 计算平方(函数表达式)
    var squre = function(x) {
      return x * x;
    };

    // 函数表达式可以包含名称，在递归的时候很有用
    var f = function fact(x) {
      return x <= 1 ? 1 : x * fact(x - 1);
    };
    // 也可以定义成这样：
    var f = function fact(x) {
      return x <= 1 ? 1 : x * f(x - 1);
    };

    // 函数表达式也可以作为参数传给其他函数
    data.sort(function(a, b) {
      return a - b;
    });

    // 函数表达式也可以定义后立即执行
    var square9 = (function(x) { return x * x })(9);
    /**
     * 下面这种写法不推荐，用在赋值语句中是OK的。但是如果不是用在赋值语句中，直接写右边的表达式，会报出如下语法错误：
     * Uncaught SyntaxError: Unexpected token (
     */
    var square6 =  function(x) { return x * x } (6);
    var square3 = (function(x) { return x * x } (3));

一条函数声明语句实际上声明了一个变量，并把一个函数对象赋值给它。如果一个函数定义表达式包含名称，函数的局部作用域将会包含一个绑定到函数对象的名称。实际上，函数的名称将成为函数内部的一个局部变量。  
通常而言，以表达式定义函数时都不需要名称，这会让定义它们的代码更加紧凑。函数定义表达式特别适合用来定义那些只会用到一次的函数。

函数声明语句"被提前"到外部脚本或者外部函数作用域的顶部，所以可以在它的定义之前调用。但是给变量赋值不会提前，因此表达式定义的函数无法提前调用。

    console.log(g()) // => 5, 声明被提前了
    function g() { return 5 }

    console.log(f()) // Uncaught TypeError: f is not a function
    var f = function() { return 3 }

return 语句导致函数停止执行，并返回它的表达式（如果有的话）的值给调用者。否则，函数返回 undefined 给调用者。

    (function() { return 3 })() // => 3
    (function() { return })()   // undefined
    (function() { })()          // undefined

### 嵌套函数

函数可以嵌套到其他函数里。嵌套函数可以访问嵌套它们（或多重嵌套）的函数的参数和变量。

ES 规范中，函数定义表达式可以出现在任意地方，但是，以语句声明定义的函数不能出现在以下语句中：

- 循环
- 条件判断
- try/catch/finally 块
- with 语句

然而，目前很多浏览器并没有严格遵守以上规则，没有做出相应的限制。

## 8.2 函数的调用

有以下 4 种方式来调用 JavaScript 函数：

1. 作为函数
1. 作为方法
1. 作为构造函数
1. 通过它们的 [call()][function.call] 和 [apply()][function.apply] 方法间接调用

[function.call]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
[function.apply]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply

### 8.2.1 函数调用

使用调用表达式 invocation expression 可以进行普通的函数调用也可进行方法调用。一个调用表达式由多个函数表达式组成，每个函数表达式都是由一个函数对象和左圆括号，参数列表和右圆括号组成，参数列表是由逗号分隔的 0 个或多个参数表达式组成。如：

    factorial(10)
    var probability = factorial(5) / factorial(8)

在一个调用中，每个参数表达式（圆括号之间的部分）都会计算出一个值，计算的结果作为参数传递给另一个函数。这些值作为实参传递给声明函数时定义的形参。在函数体中存在一个形参的引用，指向当前传入的实参列表，通过它可以获得参数的值。

对于普通的函数调用，函数的返回值成为调用表达式的值。如果该函数返回是因为解释器到达结尾，返回值就是 undefined。如果函数返回是因为解释器执行 return 语句，返回值就是 return 之后的表达式的值，如果 return 没有返回值，则返回 undefined。

调用上下文(this 的值)是全局对象。然而在严格模式下，this 的值则是 undefined。

    console.log((function a(){return this}()))     // Window
    /**
     * 这个语句的前面必须有分号(;)， 否则会抛出以下异常：
     * Uncaught TypeError: console.log(...) is not a function
     * 这是因为ASI检测到新行以左圆括号"("开头时，不会给上一行代码自动添加分号。
     * 所以必须给上一行代码添加分号，或者在左圆括号"("的前面添加分号。
     */
    ;(function() {
      "use strict"
      console.log((function a(){return this})())   // undefined
    })();

ASI(automatic semicolon insertion)相关的内容参见[这里][automatic-semicolon-insertion]。

[automatic-semicolon-insertion]: http://2ality.com/2011/05/semicolon-insertion.html

可以用以下方法判断当前是否是严格模式。

    var isStrictMode = (function() {return !this}())

### 8.2.2 方法调用

一个方法就是保存在一个对象的属性里的 JavaScript 函数。如果有一个函数 f 和一个对象 o，则可以给对象 o 定义一个名为 m()的方法，该方法指向函数 f。

    o.m = f;

调用它时，就像下面这样：

    o.m()      // 无参数
    o.m(x, y)  // 带参数

对方法调用的参数和返回值的处理，和上一节中的普通函数调用完全一致。但是这两者的有一个重要的区别，即：调用上下文。属性访问表达式由 2 部分组成：对象（上列中的 o）和属性名称（m）。在这样的方法调用表达式里，对象 o 成为调用上下文，函数体可以使用 this 关键字引用该对象。

    var calculator = {
      op1: 1,
      op2: 2,
      add: function() {
        // 注意this的用法，这里的this指代当前calculator对象
        this.result = this.op1 + this.op2;
      }
    }

    calculator.add()
    calculator.result // =>3

大多数方法调用使用点符号来访问属性，同样也可以使用方括号。

    var o = { m: function(x, y) {
        return x + y;
      }
    };

    var x = 1, y = 2;
    o["m"](x, y);     // => 3, 方括号中使用直接量

    var method = "m";
    o[method](x, y);  // => 3, 方括号中使用变量

方法调用可能包括更复杂的属性访问表达式。

    customer.surname.toUpperCase() // 调用customer对象的surname方法
    f().m()                        // 在f()调用结束之后，继续调用返回值对象中的m()方法

方法和 this 关键字是面向对象编程范例的核心。任何函数只要作为方法调用，实际上都会传入一个隐式的实参--这个实参是一个对象，方法调用的母体就是这个对象。通常来说，基于那个对象的方法可以执行多种操作，方法调用的语法已经很清晰地表明了函数将基于一个对象进行操作。比如：

    rect.setSize(width, height)  // 基于对象的操作
    setSize(rect, width, height) // 常作为静态的工具方法使用

上面例子中第一行的方法表明函数执行的载体是 rect 对象，函数中的所有操作都基于这个对象。当方法不需要返回值时，可以返回 this 对象。这样就可以进行**链式调用**的风格来编程。

    shape.setX(100).setY(100).setSize(50).setOutline("red").setFill("blue").draw()

需要注意的是，this 是一个关键字，不是变量也不是属性名。JavaScript 不允许给 this 赋值。

    // Uncaught ReferenceError: Invalid left-hand side in assignment
    this = 1

和变量不同，关键字 this 没有作用域的限制，嵌套函数不会从调用它的函数中继承 this。如果嵌套函数作为方法调用，其 this 指向调用它的对象。如果嵌套函数作为函数调用，其 this 值就是全局对象(非严格模式)或 undefined(严格模式)。很多人误以为调用嵌套函数时 this 会指向调用外层函数的上下文。如果你想访问这个外部函数的 this 值，通常需要先将 this 的值保存在一个变量(通常使用 self)里，这个变量和内部函数都在同一个作用域内。比如：

    var o = {
      m: function() {
        var self = this;
        console.log(this === o);      // => true, this就是对象o
        f();

        function f() {
          console.log(self === o);    // => true, self指向外部函数的this值
          console.log(this === self); // => false, this指向全局对象
          console.log(this);          // => Window, 全局对象
        }
      }
    };

    o.m()

### 8.2.3 构造函数调用

如果函数或者方法调用之前带有**new 关键字**，它就构成构造函数调用。构造函数调用和普通的函数调用以及方法调用在实参处理，调用上下文和返回值方面都有不同。

如果构造函数调用在圆括号内包含一组实参列表，先计算这些实参表达式，然后传入函数内，这和函数调用，方法调用是一致的。但如果构造函数没有形参，JavaScript 构造函数调用是允许省略实参列表和圆括号的。凡是没有形参的构造函数调用都可以省略圆括号，比如下面 2 行代码是等价的：

    var o = new Object()
    var o = new Object

**构造函数调用创建一个新的空对象，这个对象继承自构造函数的 prototype 属性。** 构造函数试图初始化这个新创建的对象，并将这个对象用作其调用上下文，因此构造函数可以使用 this 关键字来引用这个新创建的对象。注意，尽管构造函数看起来像一个方法调用，它依然会使用这个新对象作为调用上下文。也就是说，在表达式 new o.m()中，调用上下文并不是 o。例如：

    var o = { m: function() {
        // 这里的this指向新创建的对象
        // 也就是下面定义的对象p，并非对象o
        this.x = 5;
      }
    }
    var p = new o.m()
    o.x // undefined
    p.x // 5

构造函数通常不使用 return 关键字，它们通常初始化新对象，当构造函数的函数体执行完毕时，它会显示返回这个新对象。然而如果构造函数显示地使用 return 语句返回一个对象，那么调用表达式的值就返回这个对象。如果使用 return 语句但没有指定返回值，或者返回一个原始值，那么这时将忽略返回值，同时使用这个新对象作为调用结果。

    var o = {};
    function f1() { return o } // 返回对象
    // 使用return的对象o作为构造函数f1调用的返回值
    o === new f1();            // => true

    var s = "abc";
    function f2() { return s } // 返回字符串
    // 构造函数f2调用的返回新创建的对象，return的字符串s被忽略
    s === new f2()             // => false

### 8.2.4 间接调用

JavaScript 函数也是对象，也可以包含方法。其中 2 个方法 [call()][function.call] 和 [apply()][function.apply] 方法可以用来间接地调用函数。这两个方法都允许显示指定调用所需的 this 值，也就是说任何函数都可以作为任意对象的方法来调用，哪怕这个函数不是那个对象的方法。两个方法都可以指定调用的实参。call()方法使用自有的实参列表作为函数的实参，apply()方法则要求以数组的形式传入参数。[8.7.3 节](<#873-call()-方法和-apply()-方法>)会有关这 2 个方法的详细讨论。

## 8.3 函数的实参和形参

JavaScript 中的函数定义并未指定参数的类型，函数调用也未对传入的实参值做任何类型检查。实际上，JavaScript 函数调用甚至不检查传入参数的个数。下面几节将讨论传入的实参和声明的形参个数不匹配时出现的状况，同样说明了如何显示测试函数实参的类型，以避免非法的实参传入函数。

### 8.3.1 可选形参

当调用函数的时候，传入的实参比声明的形参个数要少时，剩下的形参都将被设置为 undefined。因此在调用函数时形参是否可选以及是否可以省略应当保持较好的适应性。为了做到这一点，应当给省略的参数赋一个合理的默认值，例如：

    /**
     * 将对象o中的可枚举属性添加到a中
     * 如果省略a，则创建一个新数组并返回
     */
    function getPropertyNames(o, /*optional*/ a) {
      if (a === undefined) a = [];
      for (var p in o) a.push(p);
      return p;
    }

    var a = getPropertyNames(o); // 将对象o的属性存储到一个新数组中
    getPropertyNames(p, a);      // 将对象p的属性追加到a中

上例中的第一行代码，还有一种使用||的习惯用法：

    // 这种写法必须先声明a，否则报错Uncaught ReferenceError: a is not defined
    // 这里因为在函数形参中已经声明过a了，所以可以直接使用。
    a = a || [];

如果函数的可选参数不在参数列表的最后，那么这个可选参数就不能省略，必须传入一个无意义的占位符(常用 undefined 或 null)。注意在函数注释中加入/\*optional\*/来表明参数是可选的。例如：

    function f(a, /*optional*/ b, c) {}
    f(3, null, 5);

### 8.3.2 可变长的实参列表：实参对象

当传入的实参个数超过了定义的形参个数时，没有办法直接获得未命名的值的引用，但是可以通过实参对象来解决这个问题。在函数体内，标识符 arguments 是指向实参对象的引用，实参对象是一个类数组对象，可以通过下标来获得传入函数的实参的值。

实参对象有一个很重要的用途，就是让函数可以操作任意数量的实参。下面的函数可以接受任意数量的实参，并返回其中的最大值。

    function max(/* ... */) {
      var max = -Infinity;
      for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] > max) max = arguments[i];
      }
      return max;
    }

    max(3, 5, 9, 7) // => 9

这种可以接收任意个数实参的函数，也称为**不定实参函数**(varargs function)。

注意：arguments 不是真正的数组，它是一个对象，只是碰巧具有以数字为索引的属性。在非严格模式下，形参名称和实参对象中对应数组元素是同一个实参的不同命名，修改其中一个值，会同步影响另外一个值。下面是一个例子：

    function f(x) {
      console.log(x);             // => 调用时传入的初始值
      arguments[0] = null;
      console.log(x);             // => null
      x = 5;
      console.log(arguments[0]);  // => 5
    }

ES5 中，移除了实参对象的上述特殊特性。在严格模式下，arguments 变成了一个保留字，无法使用 arguments 作为形参名或局部变量名，也不能给 arguments 赋值。

    function f(x) {
        "use strict"
        console.log(x);             // => 调用时传入的初始值
        console.log(arguments[0]);  // => 调用时传入的初始值

        // Uncaught SyntaxError: Unexpected eval or arguments in strict mode
        // var arguments = [];      // 不能定义为局部变量
        // Uncaught SyntaxError: Unexpected eval or arguments in strict mode
        // arguments = [];          // 不能给arguments赋值

        arguments[0] = 9;           // 不影响x的值
        console.log(x);             // => 调用时传入的初始值

        x = 5;                      // 不影响arguments[0]的值
        console.log(arguments[0]);  // => 9
    }

### callee 和 caller 属性

除了数组元素，实参对象还定义了 [callee][arguments.callee] 和 [caller][arguments.caller] 属性。在 ES5 严格模式中，对这 2 个属性的读写操作都会产生一个类型错误。而在非严格模式下，callee 属性指代当前正在执行的函数。caller 是非标准的，但是大多数浏览器都实现了，它指代调用当前正在执行的函数的函数。通过 caller 可以访问调用栈。

[arguments.caller]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments/caller
[arguments.callee]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments/callee

callee 函数有时非常有用，比如，可以在匿名函数中使用 callee 来递归调用自身。

    var factorial = function(x) {
      return x <= 1 ? 1 : x * arguments.callee(x - 1);
    };

### 8.3.3 将对象属性用作实参

当一个函数超过 3 个形参时，要记住调用函数中的实参顺序往往是一件令人头疼的事。为了解决这个问题，可以通过一个对象的名/值对的形式来传入参数，这样参数的顺序就无关紧要了。

    function copy(args) {
      dosomething(args.name, args.age, args.sex);
      dosomething2(args.name, args.weight, args.hight);
      // ...
    }

### 8.3.4 实参类型

JavaScript 方法的形参并未声明类型，在实参传入函数体之前也未作任何类型检查。可以采用语义化的单词来给函数实参命名或在函数中添加形参的类型注释。

    function arrayCopy(
      /* array */ from, /*index*/ from_start,
      /* array */ to, /*index*/ to_start,
      /*integer* */ length
    ) {}

    function max(/* number... */) {} // ...表示任意数量

除非你所写的函数是只用到一两次的"用完即丢"的函数，多数情况下（尤其是工具，公共类库函数），应当添加实参类型检查逻辑。因为宁愿在传入非法值时报错，也不愿非法值导致程序在执行时报错，相比而言，后者的报错信息不甚清楚且更难跟踪和处理。

    /**
     * 返回数组a的累加和
     * @param {Array} a
     */
    function sum(a) {
      if (Array.isArray(a)) {
        // do something...
      } else throw new Error("sum(): argument must be array-like.");
    }

JavaScript 是一种非常灵活的弱类型语言，有时适合编写实参类型和实参个数都不确定的函数。

    function flexisum(/* args... */) {
      var total = 0;
      for (var i = 0; i < arguments.length; i++) {
        var element = arguments[i];
        if (element == null) continue;                // 忽略null和undefined
        var n;
        if (Array.isArray(element)) {                 // 如果实参是数组
          n = flexisum.apply(this, element);          // 递归计算累加和
        } else if (typeof element === "function") {   // 如果实参是函数
          n = Number(element());                      // 调用它并转换成数字
        } else {
          n = Number(element);                        // 否则，直接转换成数字
        }

        if (isNaN(n))                                 // 如果无法转化成数字，则抛出异常
          throw new Error("flexisum(): can't convert " + element + " to number");

        total += n;
      }
      return total;
    }

## 8.4 作为值的函数

在 JavaScript 中，函数可以作为值。可以将函数赋值给变量，存储在对象的属性或者数组的元素中，作为参数传给另一个函数等。

下面这个例子中，创建了一个新的函数对象，并将其赋值给变量 square。函数的名字实际上是看不见的，它(square)仅仅是变量的名字，这个变量指代函数对象。

    function square(x) { return x * x }

下面是一些函数作为值的例子：

    // 函数赋值给另一个变量
    var s = square;
    square(4);            // 16
    s(4);                 // 16

    // 函数赋值给对象的属性
    var o = {
      square: function(x) { return x * x }
    };
    var y = o.square(5);  // 25

    // 函数赋值给数组元素
    var a = [
      function(x) { return x * x },
      20
    ];
    a[0](a[1]);           // 400

### 自定义函数属性

当函数需要一个“静态”变量来在调用时保持某个值不变，最方便的方式就是给函数定义属性，而不是全局变量。

    uniqueInteger.count = 0;
    // 每次调用都会返回一个递增的整数值
    function uniqueInteger() {
      // 不能用this.count++，这里this指代全局对象
      return uniqueInteger.count++;
    }

下面这个 factorial 函数使用自身的属性(将自身当作数组来使用)来缓存上一次个结果。

    function factorial(n) {
      if (isFinite(n) && n > 0 && n == Math.round(n)) { // 有限的正整数
        if (!(n in factorial)) {                        // 如果没有缓存结果
          factorial[n] = n * factorial(n - 1);          // 结算结果并缓存它
        }
        return factorial[n];                            // 返回缓存值
      }
    }
    factorial[1] = 1;                                   // 初始化基本情况

## 8.5 作为命名空间的函数

在函数中声明的变量在整个函数体内是可见的（包括在嵌套的函数中），在函数外部是不可见的。不在任何函数内声明的变量是全局变量，在整个 JavaScript 程序中都是可见的。

我们常常简单地定义一个函数用作临时的命名空间，在这个命名空间内定义的变量都不会污染到全局命名空间。常见的作法是定义一个匿名函数，并立即执行它。很多应用的初始化处理经常使用这种方法。简单代码如下：

    // function之前的左圆括号是必须的，
    // 否则解释器会试图将关键字function解析为函数声明语句
    ;(function() {
      // 模块代码
    }())  // 结束模块代码并立即调用它

## 8.6 闭包

和其他大多数现在编程语言一样，JavaScript 也采用词法作用域(lexical scoping)，也就是说，函数的执行依赖变量作用域，这个作用域是在函数定义时决定的，而不是函数调用时决定的。为了实现这种词法作用域，JavaScript 函数对象的内部状态不仅包含函数的代码逻辑，还必须引用当前的作用域链。函数对象可以通过作用域链相互关联起来，函数体内部的变量都可以保存在函数作用域内，这种特性就是闭包 [closures][closures]。

[closures]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures

从技术的角度讲，所有的 JavaScript 函数都是闭包：它们都是对象，它们都关联到作用域链。定义大多数函数时的作用域链在调用函数时依然有效，但这并不影响闭包。当调用函数时闭包所指向的作用域链和定义函数时的作用域链不是同一个作用域链时，事情变得有意思了。当一个函数嵌套了另一个函数，外部函数将嵌套的函数对象作为返回值的时候往往发生这种事情。有很多强大的编程技术都利用到了这类嵌套的函数闭包，以至于这种编程模式在 JavaScript 中非常常见。

理解闭包首先要了解嵌套函数的词法作用域规则。先看一个将容易理解的例子：

### 例 8.6.1

    var scope = "global scope";     // 全局变量
    function checkscope() {
      var scope = "local scope";    // 局部变量
      function f() { return scope } // 在作用域中返回这个值
      return f();
    }
    checkscope();                   // => "local scope"

将上面例子稍微改变一下：

### 例 8.6.2

    var scope = "global scope";     // 全局变量
    function checkscope() {
      var scope = "local scope";    // 局部变量
      function f() { return scope } // 在作用域中返回这个值
      return f;
    }
    checkscope()();                   // ??? 这里会得到什么？

很多人以为这里会返回"global scope"，实际上它将返回"local scope"。这是为什么呢？回想一个词法作用域的基本规则：JavaScript 函数的执行用到了作用域链，这个作用域链是函数定义的时候创建的。嵌套函数 f()定义在这个作用域链里，其中的变量 scope 是局部变量，不管在何时何地执行 f()，这种绑定在执行 f()时依然有效。简而言之，闭包的这个特性强大到让人吃惊：它捕捉并保存了外部函数(定义它的)的局部变量(和形参 parameter)，并在函数执行时，可以获取到这些值。

### 实现闭包

如果理解了词法作用域的规则，就能很容易理解闭包：函数执行时使用的作用域链是在函数定义时生成的。

很多人认为外部函数中的局部变量在函数返回后就不存在了，实际上并非这么简单。如果函数的局部变量定义在 cpu 的栈中，那么函数返回时它们的确就不存在了。但是回想一下作用域链是如果定义的。我们将作用域链描述为一个对象列表，而不是绑定到栈上。  
每次调用 JavaScript 函数的时候，都会为之创建一个新的对象(为了后续描述方便，称它为 o)用来保存局部变量，并把 o 到作用域链中。当函数返回的时候，就从作用域链上将 o 删除掉。这时，有以下几种可能发生的情况：

1. 如果不存在嵌套的函数，也没有其他引用指向对象 o，它就会被当作垃圾回收掉。
1. 如果定义了嵌套函数，那么每个嵌套的函数都有一个对 o 的引用。
   - 如果这些嵌套函数对象被保存在外部函数中，那么它们也会和对象 o 一样被垃圾回收掉。参见[例 8.6.1](#例-861)。
   - 如果这个函数定义了嵌套的函数，并将它作为返回值或者存储到某处的属性中，这是就会有一个外部引用指向这个嵌套的函数。它就不会被回收，变量 o 也不会被回收。 参见[例 8.6.2](#例-862)。

之前的 uniqueInteger 方法可以在外部修改 count 的值，可能被恶意篡改。下面将通过定义私有变量的方式，提供一个更加完善的版本：

    var uniqueInteger = (function() {
      // count变量只有嵌套函数可以访问，其他任何地方都不行
      var count = 0;
      return function() {
        return count++;
      };
    })();

像 count 一样的私有变量不是只能用在一个单独的闭包内，在同一个外部函数内定义的多个嵌套函数也可以访问它，这多个嵌套函数都共享一个作用域链，看下面这段代码：

    function counter() {
      var n = 0;
      return {
        count: function() { return n++ },
        reset: function() { n = 0 }
      };
    }

    var c = counter(), d = counter()
    c.count() // => 0
    d.count() // => 0：它们互不干扰
    c.reset() // reset()和count()方法共享状态
    c.count() // => 0：c被重置了
    d.count() // => 1：d不受影响

从技术角度来看，其实可以将上面的闭包技术和属性存取器方法 getter/setter 结合起来使用。下面所示的 counter 函数版本中，私有状态的实现就是利用了闭包，而不是普通的对象属性（普通的对象属性是可以被外部修改的，没有真正实现变量私有）。

    function counter(n) {
      return {
        get count() {
          return n++;
        },
        set count(m) {
          if (m < n) throw Error("count can only be set to a larger value");
          n = m;
        }
      };
    }

    var c = counter(1000);
    c.count;           // 1000
    c.count;           // 1001
    c.count = 2000;
    c.count;           // 2000
    // Uncaught Error: count can only be set to a larger value
    c.count = 2000;

上述方法并未定义私有变量，而是使用了形参 n 来保存私有状态。

下面的例子是利用闭包技术来共享私有状态的通用做法。

    function addPrivateProperty(o, name, predicate) {
      var value; // 这个私有变量不在对象o中，只有下面的setter和getter可以访问

      o["get" + name] = function() {
        return value;
      };

      o["set" + name] = function(v) {
        if (predicate && !predicate(v))
          throw Error("set " + name + ": invalid value: " + v);

        value = v;
      };
    }

    var o = {};
    addPrivateProperty(o, "Name", function(x) {
      return typeof x == "string";
    });

    o.setName("Bob")
    o.getName()      // "Bob"
    // Uncaught Error: set Name: invalid value: 0
    o.setName(0)

我们已经给出了很多例子，在同一个作用域链中，定义两个闭包，这两个闭包共享同样的私有变量或变量。这是一种非常重要的技术，但是 **_要特别小心那些不希望共享的变量往往不经意间共享给了其他的闭包。_** 看一下下面这段代码：

    function constfunc(v) {
      return function() {
        return v;
      };
    }

    var funcs = [];
    for (var i = 0; i < 10; i++) {
      funcs[i] = constfunc(i);
    }

    funcs[5]() // => 5

这段代码创建了很多闭包，当写类似这种代码的时候往往会犯一个错误：那就是试图将循环代码移入定义这个闭包的函数之内，比如：

    function constfuncs() {
      var funcs = [];
      for (var i = 0; i < 10; i++) {
        funcs[i] = function() {
          return i;
        };
      }
      return funcs;
    }

    var funcs = constfuncs();
    funcs[5](); // ??? 这里返回什么？

上面这段代码创建了 10 个闭包，并将它们存储到一个数组中。constfuncs()返回时 i 的值是 10，所有的闭包全部共享这个值，因此，数组中的函数返回值都是同一个值 10，这不是我们想要的结果。关联到闭包的作用域链都是“活的”，记住这一点非常重要。嵌套的函数不会对作用域做一份私有拷贝，也不会对变量绑定做任何静态快照。

书写闭包的时候还需要注意一件事情，this 是 JavaScript 的关键字，而不是变量。正如之前所讨论的，每一个函数调用都有一个 this 值，闭包函数不能访问它的外部函数的 this 值，除非外部函数把 this 的值保存到一个变量中:

    // 保存外部函数的this值，它的嵌套函数可以通过self变量来访问
    var self = this

同理，还有 arguments 关键字也与之类似。

    var outerArguments = arguments

## 8.7 函数属性，方法和构造函数

在 JavaScript 中，函数是值。对函数执行 typeof 运算会返回字符串 "function"，但是函数是 JavaScript 中的特殊对象，它们也可以拥有自己的属性和方法。甚至可以用 Function()构造函数来创建新的函数对象。

### 8.7.1 length 属性

在函数体内，arguments.length 表示传入函数的实参的个数。而函数本身的 length 属性是只读属性，表示函数形参的个数，也就是函数定义时给出的参数个数，通常也是在函数调用时期望传入的参数个数。

以下例子用于检测实参个数是否形参的个数一致：

    // 使用了arguments.callee，因此它不能在严格模式下工作
    function check(args) {
      var actual = args.length;
      var expected = args.callee.length;
      if (actual != expected)
        throw Error("Excepted " + expected + " args; got " + actual);
    }

    function f(x, y, z) {
      check(arguments);
      return x + y + z;
    }

每一个函数都包含一个 prototype 属性，这个属性是指向一个对象的引用，这个对象称作原型对象 prototype object。每一个函数都包含不同的原型对象。当将函数用作构造函数的时候，新创建的对象会从原型对象上继承属性。

### 8.7.3 call() 方法和 apply() 方法

通过 [call()][function.call] 和 [apply()][function.apply] 方法，我们可以把函数当作对象的方法来调用。call()和 apply()函数的第一个参数是要调用的函数的母对象，它是调用上下文，在函数体内通过 this 来获得对它的引用。要想以对象 o 的方法来调用函数 f()，可以这样使用：

    f.call(o);
    f.apply(o);

每行代码和下面代码的功能类似（假设对象 o 中预先不存在名为 m 的属性）

    o.m = f;
    o.m();
    delete o.m

在 ES5 中，call()和 apply()方法的第一个参数都会变成 this 的值，哪怕传入的实参是原始值甚至是 null 或 undefined。在 ES3 和非严格模式，传入 null 或 undefined 都会被全局对象代替，而其他的原始值会被相应的包装对象 wrapper object 所替代。

    "use strict"
    function f() { console.log(this.x) }
    // Uncaught TypeError: Cannot read property 'x' of null
    f.apply(null)

第一个调用上下文之后的所有参数就是要传入待调用函数的值。这些参数在 call()方法中用逗号隔开，而在 apply()方法中需要存放到数组（或类数组）中。例如：

    f.call(o, 1, 2)
    f.apply(o, [1, 2])

下面的 trace()方法接收两个参数，一个对象和一个方法名，它将指定的方法替换成一个新方法，这种动态修改已有修改方法的做法也叫 monkey patching。

    function trace(o, m) {
      var original = o[m];
      o[m] = function() {
        console.log(new Date(), "Entering:", m);
        var result = original.apply(this, arguments);
        console.log(new Date(), "Exiting:", m);
        return result;
      };
    }

### 8.7.4 bind()方法

[bind()][function.bind] 方法是 ES5 新增的方法，它的主要作用就是将函数绑定至某个对象。在 ES3 中也能很容易实现 bind()方法：

[function.bind]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind

    function bind(f, o) {
      if (f.bind) return f.bind(o);
      return function() {
        f.apply(o, arguments);
      };
    }

下面是一个 bind()方法的例子：

    function f(y) {     // 待绑定的函数
      return this.x + y;
    }
    var o = { x: 1 };   // 将要绑定的对象
    var g = f.bind(o);  // 通过调用g(x)来调用o.f(x)
    g(2)                // => 3

bind()方法不仅仅可以将函数绑定到一个对象上，你还可以在第一个参数之后传入更多的实参，在调用绑定函数时，这些实参会按顺序绑定到函数的形参上。在函数式编程中，这是一种常见的编程技术，叫做偏函数应用 partial application，有时也叫柯里化 currying。例如：

    var sum = function(x, y) {
      return x + y;
    };
    // 创建一个类似sum的新函数，但this值绑定到null
    // 并且第一个参数绑定到1，这个新函数期望只传入一个值
    var succ = sum.bind(null, 1);
    succ(2);  // => 3

    function f(y, z) {
      return this.x + y + z;
    }
    var g = f.bind({ x: 1 }, 2); // 绑定this和y
    g(3)                         // => 6: this.x绑定到1，y绑定到2，z是传入的参数3

我们也可以在 ES3 中实现 Function.bind()方法：

    if (!Function.prototype.bind) {
      Function.prototype.bind = function(o /*, args*/) {
        var self = this,
          boundArgs = arguments;
        return function() {
          var args = [];
          for (var i = 1; i < boundArgs; i++) args.push(boundArgs[i]);
          for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
          return self.apply(o, args);
        };
      };
    }

ES5 定义的 bind()方法有一些属性是上述代码无法模拟的。首先，真正的 bind()方法返回的是一个函数，这个函数的 length 属性是绑定函数的形参个数减去绑定时传入的实参个数(第一个参数除外)，length 的值不能小于 0。

    function add(x, y, z) {
      return x + y + z;
    }

    var add2 = add.bind(null, 2, 3)
    add2.length     // => 1

再者，ES5 的 bind()方法也可以用作构造函数，但是在生产环境中不应该这样去使用。

### 8.7.5 toString()方法

函数的 [toString()][function.tostring] 方法返回一个字符串。大多数的函数的 toString()方法直接返回函数的完整源码。内置函数往往返回一个类似 [native code] 的字符串作为函数体。

    // 自定义函数
    var add = function(a,b) {return a + b}
    // function(a,b) {return a + b}
    add.toString()

    // 内置函数
    // function toString() { [native code] }
    Object.prototype.toString.toString()

    // 使用Function()构造函数创建的函数，会使用"anonymous"作为函数名
    var f = new Function("x", "y", "return x*y;");
    /**
     * function anonymous(x,y
     *  ) {
     *   return x*y;
     * }
     */
    f.toString()

[function.tostring]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/toString

### 8.7.6 Function()构造函数

不管是通过函数表达式还是函数直接量表达式，函数的定义都要使用 function 关键字。但函数还可以 [Function()][function] 构造函数来定义，比如：

[function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function

    var f = new Function("x", "y", "return x * y;");

这一行代码创建一个新的函数，这个函数和通过下面代码定义的函数几乎等价：

    var f = function(x, y) {return x*y;}

Function()构造函数可以传入任意数量的字符串实参，最后一个实参所表示的文本就是函数体：他可以包含任意的 JavaScript 语句，每 2 条语句之间用分号分隔。传入构造函数的其他所有的实参字符串是指定函数的形参名字的字符串。如果定义的函数不包含任何参数，只需给构造函数简单地传入一个字符串(函数体)即可。

Function()构造函数创建的是一个匿名函数，因此不需要传入实参指定函数名。

关于 Function()构造函数有几点需要特别注意：

- Function()构造函数允许 JavaScript 在运行时动态地创建并编译函数。
- 每次调用 Function()构造函数都会解析函数体，并创建新的函数对象。如果是在一个循环体内或者多次调用的函数中执行这个构造函数，执行效率会受影响。相比之下，**循环中的嵌套函数和函数定义表达式则不会每次执行时都重新编译**(但是会生成多个函数)。
- 最后一点，也是关于 Function()构造函数非常重要的一点，就是它所创建的函数并不是使用词法作用域，相反，函数体的代码的编译总是会在顶层函数(全局作用域)执行，正如下面代码所示：

      var scope = "global";
      function constructFunction() {
        var scope = "local";
        return new Function("return scope");
      }

      // 使用全局作用域
      constructFunction(); // => global

使用 Function()构造函数构建的函数无法被现代 js 引擎优化，容易带来性能问题。在实际编程中，应该尽量避免使用。

### 8.7.7 可调用的对象

可调用对象 callable object 是一个对象，可以在函数调用表达式中调用这个对象。所有的函数都是可调用的，但是并非所有的可调用对象都是函数。

有两种情况的可调用对象不是函数。第一种，IE8 浏览器及之前版本实现的客户端方法(比如 Window.alert()和 Document.getElementById)，使用了可调用的宿主对象，而不是内置的函数对象。IE9 把它们修改成了真正的函数对象，因此这类可调用对象越来越罕见了。

另外一个常见的可调用对象就是正则表达式 RegExp。比起调用它的 exec()方法，你可以更加便捷地直接调用正则表达式对象。在 JavaScript 中，这是一个彻头彻尾的非标准特性。代码最好不要对可调用的 RegExp 对象有太多依赖，这个特性在未来可能会废弃并删除。对 RegExp 执行 typeof 运算，有的浏览器返回"function"，有的浏览器返回"object"。

如果想检测一个对象是否是真正的函数对象(并且具有函数方法)，可以检测它的 class 属性。比如：

    function isFunction(x) {
      return Object.prototype.toString.call(x) === "[object Function]";
    }

## 8.8 函数式编程

JavaScript 并非函数式编程语言，但在 JavaScript 中可以像操控对象一样操控函数，因此可以在 JavaScript 中应用函数式编程技术。ES5 的数组方法（比如 map 和 reduce）就特别适合函数式编程风格。接下来的几节将会介绍 JS 中的函数式编程技术，你将体会到 JS 函数非常强大，而不仅仅是学习一种编程风格而已。

### 8.8.1 使用函数处理数组

假设有一个数组，其元素都是数字，我们想要计算这些元素的平均值和标准差。若使用非函数式编程风格的话，代码会是这样：

    // 计算平均值
    var data = [1, 1, 3, 5, 5];
    var total = 0;
    for (var i = 0; i < data.length; i++) {
      total += data[i];
    }
    var mean = total / data.length;

    // 计算标准差
    total = 0;
    for (var i = 0; i < data.length; i++) {
      var deviation = data[i] - mean;
      total += deviation * deviation;
    }
    var stddev = Math.sqrt(total / (data.length - 1));

可以使用数组的 map()和 reduce()方法来实现同样的计算：

    var data = [1, 1, 3, 5, 5];
    var mean =
      data.reduce(function(accumulator, currentValue) {
        return accumulator + currentValue;
      }) / data.length;

    var stddev = Math.sqrt(
      data.map(function(item) {
          return item - mean;
        }).reduce(function(a, c) {
          return a + c * c;
        }, 0) / (data.length - 1)         // 这里的reduce方法中，必须设置初始值为0
    );

还可以使用下面这种实现，看起来更加简洁：

    var sum = function(x, y) {return x + y;};
    var square = function(x) {return x * x;};

    var mean = data.reduce(sum) / data.length;
    var deviations = data.map(function(x) {
      return x - mean;
    });
    var stddev = Math.sqrt(
      deviations.map(square).reduce(sum) / (data.length - 1));

在 ES3 中，数组并不包含 map 和 reduce 方法。我们可以自定义这两个函数：

    var map = Array.prototype.map
      ? function(a, f) {
          return a.map(f);
        }
      : function(a, f) {
          var result = [];
          for (var i = 0, len = a.length; i < len; i++) {
            // result.push(f(a[i], i, a));
            if (i in a) {
              result[i] = f.call(null, a[i], i, a);
            }
          }
          return result;
        };

    var reduce = Array.prototype.reduce
      ? function(a, f, initial) {
          if (arguments.length > 2) return a.reduce(f, initial);
          return a.reduce(f);
        }
      : function(a, f, initial) {
          // 这个算法来自ES5规范
          var i = 0,
            len = a.length,
            accumulator;

          // 以传入的初始值开始，否则第一个值取自a
          if (arguments.length > 2) {
            accumulator = initial;
          } else { // 找到数组中第一个已定义的索引
            if (len === 0) throw TypeError();
            while (i < len) {
              if (i in a) {
                accumulator = a[i++];
                break;
              }
              i++;
            }
            if (i === len) throw TypeError();
          }

          // 对数组中剩下的元素依次调用f()
          while (i < len) {
            if (i in a) accumulator = f.call(undefined, accumulator, a[i], i, a);
            i++;
          }

          return accumulator;
        };

使用以上自定义的函数来重写求平均值和标准差的代码就变成下面这样：

    var data = [1, 1, 3, 5, 5];
    var sum = function(x, y) {
      return x + y;
    };
    var square = function(x) {
      return x * x;
    };
    var mean = reduce(data, sum) / data.length;
    var deviations = map(data, function(x) {
      return x - mean;
    });
    var stddev = Math.sqrt(
      reduce(map(deviations, square), sum) / (data.length - 1)
    );

### 8.8.2 高阶函数

所谓高阶函数 high-order function 就是操作函数的函数，它接收一个或多个函数作为参数，并返回一个新函数，来看这个例子：

    // 这个高阶函数返回一个新函数，这个新函数将它的实参传入f()
    // 并返回f的返回值的逻辑非
    function not(f) {
      return function() {
        return !f.apply(this, arguments);
      };
    }

    var even = function(x) {
      return x % 2 === 0;
    };

    var odd = not(even);
    [1, 1, 3, 5, 5].every(odd);

下面是一个 mapper 函数的例子，用到了上一节中的 map 函数。

    // 所返回的函数的参数应当是一个实参数组，并对每个数组元素执行函数f()
    // 并返回所有计算结果组成的数组。
    function mapper(f) {
      return function(a) {
        return map(a, f);
      };
    }

    var increment = function(x) {
      return x + 1;
    };
    var incrementer = mapper(increment);
    incrementer([1, 2, 3]); // => [2, 3, 4]

这里是一个更常见的例子，它接收 2 个参数 f 和 g，并返回一个新的函数用以计算 f(g()):

    // 返回的函数h()将它所有的实参传入g()，然后将g的返回值传入f()
    // 调用f()和g()时的this值和调用h()时的this值是同一个值。
    function compose(f, g) {
      return function() {
        return f.call(this, g.apply(this, arguments));
      };
    }
    var sum = function(x, y) {
      return x + y;
    };
    var square = function(x) {
      return x * x;
    };
    var squareOfSum = compose(square, sum);
    squareOfSum(2, 3); // => 25

后续两节讨论的 partial()和 memorize()函数，是两个非常重要的高阶函数。

### 8.8.3 不完全函数

利用不完全函数 Partial Application of Functions，可以编写一些有意思的代码，利用已有的函数来编写新的函数。先看一些基础的工具函数:

    // 将类数组对象转换成对象
    function array(a, n) {
      return Array.prototype.slice.call(a, n || 0);
    }

    // 这个函数按从左往右的顺序传递实参
    function partialLeft(f /*, ...  */) {
      var args = arguments;             // 保存外部实参数组
      return function() {
        var a = array(args, 1);         // 添加外部实参，除去第一个函数f
        a = a.concat(array(arguments)); // 添加内部实参
        return f.apply(this, a);        // 基于上述2步处理后的实参列表调用函数f
      };
    }

    // 这个函数按从右往左的顺序传递实参
    function partialRight(f /*, ... */) {
      var args = arguments;
      return function() {
        var a = array(arguments);
        a = a.concat(array(args, 1));
        return f.apply(this, a);
      };
    }

    // 这个函数的实参列表被用作模板
    // 实参列表中的undefined值都被填充
    function partial(f /*, ... */) {
      var args = arguments;
      return function() {
        var a = array(args, 1);
        for (var i = 0, j = 0, len = a.length; i < len; i++) {
          if (a[i] === undefined) {
            a[i] = arguments[j++];
          }
        }
        a = a.concat(array(arguments, j));
        return f.apply(this, a);
      };
    }

    var f = function(x, y, z) {
      return x * (y - z);
    };

    partialLeft(f, 2)(3, 4);         // => -2: 等价f(2, 3, 4)
    partialRight(f, 2)(3, 4);        // =>  6: 等价f(3, 4, 2)
    partial(f, undefined, 2)(3, 4);  // => -6: 等价f(3, 2, 4)

下面是一些通过已有函数来编写新的函数的例子：

    var increment = partialLeft(sum, 1);        // 等价sum(1, x)
    var cuberoot = partialRight(Math.pow, 1/3); // 等价Math.pow(x, 1/3)
    String.prototype.first = partial(String.prototype.charAt, 0);
    String.prototype.last = partial(String.prototype.substr, -1, 1);

当将不完全调用和其他高阶函数整合在一起的时候，事情变得有意思了。比如，上一节中定义的 not()函数，我们还可以这样写：

    var opposite = function(x) {return !x};
    var not = partialLeft(compose, opposite);
    var even = function(x) {
      return x % 2 === 0;
    };

    var isNumber = not(isNaN);
    var odd = not(even);
    odd(5) // => 5: 等价于opposite(even(5));

思考一下，我们如果把 partialLeft 替换成 partialRight 会发生什么？

    var f = partialRight(compose, opposite);
    var f2 = f(even);
    f2(5) // 想想这里的表达式是什么？

f2(5)实际上会转换成 even(opposite(5))。opposite(5)返回 false，调用 even 方法时会把 false 值转换成数字，变成 0。0 是偶数，因此 f2(5)会返回 true。

我们现在可以使用 partial application 来重写我们的求均值和标准差的代码了，这是一种存粹的函数式编程风格：

    var data = [1, 1, 3, 5, 5];
    var sum = function(x, y) {
      return x + y;
    };
    var product = function(x, y) {
      return x * y;
    };
    var neg = partial(product, -1);                    // product(-1, y)
    var square = partial(Math.pow, undefined, 2);      // Math.pow(x, 2)
    var sqrt = partial(Math.pow, undefined, 0.5);      // Math.pow(x, .5)
    var reciprocal = partial(Math.pow, undefined, -1); // Math.pow(x, -1)

    var mean = product(reduce(data, sum), reciprocal(data.length));
    var stddev = sqrt(
      product(
        reduce(
          map(
            data,
            compose(
              square,
              // 为了描述方便，称下面这个函数叫dev函数
              // dev(x)等价于sum(-mean, x), 也就是x-mean
              // x为data中的元素，neg(mean)就是-mean
              partial(sum, neg(mean))
            ) // 等价square(dev(x))
          ),
          sum // 对元素和均值的差的平方求和
        ),
        reciprocal(sum(data.length, -1))
      )
    );

### 8.8.4 记忆化

在 8.4.1 节中定义了一个阶乘函数，它可以将上次的计算结果缓存起来。在函数式编程中，这种缓存技巧叫做记忆化 memorization。下面的代码展示了一个高阶函数，memorize()接收一个函数作为实参，并返回带有记忆能力的函数。

    function memorize(f) {
      var cache = {};
      return function() {
        var key = arguments.length + Array.prototype.join.call(arguments, ",");
        if (key in cache) return cache[key];
        else return (cache[key] = f.apply(this, arguments));
      };
    }

memorize()方法创建一个新的对象，这个对象被当作缓存(的宿主)并赋值给一个局部变量，因此对于这个返回函数来说，它是私有的(在闭包中)。

    // Return the Greatest Common Divisor of two integers, using the Euclidian
    // algorithm: http://en.wikipedia.org/wiki/Euclidean_algorithm
    function gcd(a, b) {
      // Type checking for a and b has been omitted
      var t; // Temporary variable for swapping values
      if (a < b) (t = b), (b = a), (a = t); // Ensure that a >= b
      while (b != 0) (t = b), (b = a % b), (a = t); // This is Euclid's algorithm for GCD
      return a;
    }
    var gcdmemo = memoize(gcd);
    gcdmemo(85, 187); // => 17
    // Note that when we write a recursive function that we will be memoizing,
    // we typically want to recurse to the memoized version, not the original.
    var factorial = memoize(function(n) {
      return n <= 1 ? 1 : n * factorial(n - 1);
    });
    factorial(5); // => 120. Also caches values for 4, 3, 2 and 1.
