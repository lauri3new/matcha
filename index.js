const toType = (t) => {
  if (typeof t === 'boolean') {
    return t ? 'True' : 'False';
  }
  return t && t.constructor && t.constructor.name ? t.constructor.name : typeof t === 'undefined' ? 'undefined' : 'null';
}

const match = (...args) => (thing) => {
  for (let i = 0; i < args.length; i++) {
    let currentCase = args[i][0];
    let currentExec = args[i][1];
    // if type from symbol
    if (typeof currentCase === 'symbol') {
      // basic type checking
      const symDesc = currentCase.toString().slice(7, -1);
      if (symDesc === '$__wildcard__$') {
        return currentExec(thing);
      }
      if (symDesc === '_') {
        return currentExec();
      }
      if (toType(thing) === symDesc) {
        return currentExec(thing);
      }
    }

    // match specific strings
    if (typeof currentCase === 'string') {
      if (thing === currentCase) {
        return currentExec(thing);
      }
    }

    // match arrays
    if (Array.isArray(currentCase) && Array.isArray(thing)) {
      let predA = false;
      let predB = currentCase.every((item, index) => {
        if (typeof item === 'symbol') {
          const symDescA = item.toString().slice(7, -1);
          if (symDescA === '$__wildcard__$') {
            return true;
          }
          if (symDescA === '$__rest__$') {
            predA = true;
          }
          if (toType(thing[index]) === symDescA) {
            return true;
          }
        }
        if (typeof item === 'string' || typeof item === 'number') {
          if (thing[index] === currentCase) {
            return true;
          }
        }
      })
      if (predA || predB && (currentCase.length === thing.length)) {
        return currentExec(thing);
      }
    }
    // match


    // if predicate function
    if (typeof currentCase === 'function') {
      if (currentCase(thing)) {
        return currentExec(thing);
      }
    }
  }
  throw('no match');
}

let a = 'string';
let b = 'number';
let c = [];
let d = {};

class Dog {

  constructor(name) {
    this.name = name;
  }

}

class Pug extends Dog {

  constructor(name, size) {
    super(name);
    this.size = size;
  }

}

let e = new Dog('john');
let f = new Pug('jim', 12);
let W = Symbol('$__wildcard__$');
let _W = Symbol('$__rest__$');
let _ = Symbol('_');
let string = Symbol('String');
let dog = Symbol('Dog');
let pug = Symbol('Pug');

let matcha = match(
  [ W, (a) => `hello` ],
  [ string, a => `matched a string: ${a}`],
  [ dog, () => 'woof woof'],
  [ pug, ({ name }) => `im a pug and my name is ${name}`],
  [ 'string', a => `matched specific string: ${a}`],
  [ 'number', a => `matched specific string: ${a}`],
  [ _, () => 'catch all stuff']
);

console.log(matcha(f));

// doubleOddIndices:: [Integer] -> [Integer]
// doubleOddIndices [] = []
// doubleOddIndices (x:[]) = [x]
// doubleOddIndices (x:(y:z)) = x : ((2 * y) : doubleOddIndices(z))

let doubleOddIndices = match(
  [ a => a.length === 0, () => [] ],
  [ a => a.length === 1, a => a ],
  [ a => a.length > 1, a => [a[0]].concat([a[1]*2]).concat(doubleOddIndices(a.slice(2)))]
)

console.log(doubleOddIndices([1,2,3,4,5]));

let doubleOddIndices$ = match(
  [ [], () => [] ],
  [ [W], a => a ],
  [ [W, _W], ([a, b, ...c]) => [a].concat([b*2]).concat(doubleOddIndices(c)) ]
)

console.log(doubleOddIndices$([1,2,3,4,5]));

module.exports = match;

// def printType(o: Any): Unit = {
//   o match {
//     case s: String =>
//       println(s"It's a string: $s")
//     case i: Int =>
//       println(s"It's an int: $i")
//     case b: Boolean =>
//       println(s"It's a boolean: $b")
//     case _ =>
//       println("It's something else")
// }

// def parse(str: String, magicKey: Char): String = {
//   str.map {
//     case c if c == magicKey =>
//       "magic"
//     case c if c.isDigit =>
//       "digit"
//     case c if c.isLetter =>
//       "letter"
//     case c if c.isWhitespace =>
//       " "
//     case c =>
//       "char"
//   }
// }

// d match {
//   case YMD(year, month, day) =>
//     Date(year.toInt, month.toInt, day.toInt)
//   case MDY(month, day, year) =>
//     Date(year.toInt, month.toInt, day.toInt)
//   case DMY(day, month, year) =>
//     Date(year.toInt, month.toInt, day.toInt)
//   case _ =>
//     throw new Exception("Invalid date!")
// }