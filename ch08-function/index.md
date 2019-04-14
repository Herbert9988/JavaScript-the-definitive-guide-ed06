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
1. 通过它们的 call()和 apply()方法间接调用

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

JavaScript 函数也是对象，也可以包含方法。其中 2 个方法 [call()][function.call] 和 [apply()][function.apply] 方法可以用来间接地调用函数。这两个方法都允许显示指定调用所需的 this 值，也就是说任何函数都可以作为任意对象的方法来调用，哪怕这个函数不是那个对象的方法。两个方法都可以指定调用的实参。call()方法使用自有的实参列表作为函数的实参，apply()方法则要求以数组的形式传入参数。[8.7.3 节](<#8.7.3-call()-方法和-apply()-方法>)会有关这 2 个方法的详细讨论。

[function.call]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
[function.apply]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply

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
   - 如果这些嵌套函数对象被保存在外部函数中，那么它们也会和对象 o 一样被垃圾回收掉。参见[例 8.6.1](#例-8.6.1)。
   - 如果这个函数定义了嵌套的函数，并将它作为返回值或者存储到某处的属性中，这是就会有一个外部引用指向这个嵌套的函数。它就不会被回收，变量 o 也不会被回收。 参见[例 8.6.2](#例-8.6.2)。

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

### 8.7.3 call() 方法和 apply() 方法
