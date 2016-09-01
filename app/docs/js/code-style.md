# JavaScript Code Style

Code styles are defined here to help us write consistent JavaScript and to provide a reference point during code review. If you discuss a convention during a code review which doesn't exist here, please add it.

## Configure your editor!

Almost all of our code style choices are reflected in the repo dotfiles and you can configure your editor to give you inline feedback. Install plugins for:

- [Editorconfig](http://editorconfig.org/)
- [JSHint](http://www.jshint.com/install/)
- [JSCS](https://www.npmjs.org/package/jscs)

Disagree with any of the settings? Make a PR and open a discussion.


## Code style guide

* Use camelCase

* Stick to double quotes

* Please don't use comma first

* Try to avoid single character variable names, words are easier to read and we have installed programs to minify code

* Name collections (arrays, objects, sets, maps) in plural, ie: `badger` is a thing, `badgers` is a collection of `badger`s

* Please preface functions that are intended to be private (I.E., not intended to be called) with an underscore:

```javascript
// private function convention
var _foo = function() {
  // statements
}
```

* Declare variables at the top of their scope:

```javascript
function balloon() {
  var wizard,
      dog = getShibe(),
      partyHat = "^";
  // some statements and stuff
}
```

* Use a $ prefix for jQuery objects:

```javascript
var selector = ".js-btn",
    $button = $(selector)
```


* Use truthiness to your advantage:

```javascript

// Good
if (collection.length) ...
if (string) ...
if (truthyThing)

// Bad
if (collection.length > 0) ...
if (string !== "")
if (truthyThing === true)
```

* No space before paren in function declaration:

```javascript
function getDressed(hat, suit, scarf, cane) {
  // statements, innit
}
```

* Put comments before the line or block they are about. Don't use eol comments

```javascript

// Good

// sanitize animals for collection by spooks
var animalSanitizer = function(animal) {
  animal.cut(animal.hair).shampoo().rinse();
}

// Bad

var animalSanitizer = function(animal) {
  animal.cut(animal.hair).shampoo().rinse(); // sanitizes animals for collection by spooks
}
```

## Typechecking


```javascript
typeof thing == "string"

typeof thing == "number"

typeof thing == "boolean"

jQuery.isFunction(thing)

object.nodeType

thing == null
```

### Chaining
When using a function that chains (particularly, but not only limited to jQuery), the following style should be used...

```javascript
$(selector)
  .methodA()
  .find("some-other-thing")
    .methodA()  // indent if you do a change in element
    .methodB()
  .end() // Come back when you end that chain group
  .methodD()
```

Keep in mind, don't overuse chaining, but it can be helpful in certain circumstances. Big long chains can be hard to debug, so keep that in mind.

## AMD Modules
* Use strict as the first line inside your require function

```javascript
require([
  "website"
], function(website) {

  "use strict";

  website.respond();
  website.enhance({ method: "progressive" });
});
```

* When listing dependencies, put each module name on a new line:

```javascript
require([
  "lib/godliness"
  "lib/cleanliness"
], function(Godliness, Cleanliness) {
```

## ES6 (2015) Guide

### Variable Declarations

* Use `let` almost always, and declare in correct scope. No more need to hoist all declarations

* Use `const` when needing a **primitive** value (aka string, number, boolean) to never change
* You can use `const` on objects and array's too, just keep in mind you can still change properties on objects, and call `push`, `pop`, `etc` on arrays

* Use `var` only in legacy code

```javascript
function StacksComponent() {
  // Height never changes
  const height = 100;
  let options = {};

  for (let i = 0; i < arguments.length; i++) {
    options[arguments[i]] = arguments[i];
  }

  if (options.foo) {
    let foo = "bar";
  }

  console.log(i, foo, options); // "undefined", "undefined", "{}"... isn't `let` great!
}
```

### Destructuring
* Rather than setting individual variables off of an object, utilize destructuring

```javascript
// bad
let name = this.user.name,
    age = this.user.age,
    location = this.user.location;

// good
let { name, age, location } = this.user;
```

### Arrow functions
* Arrow functions should be used by default, except in rare cases where it's not possible

```javascript
let componentState = {
  setInitialState: (initial) => {

  }
};
```

* Use implicit return and no curly braces for simple statements

```javascript
let state = {};

let componentState = {
  getInitialState: () => state,
  setInitialState: (initial) => _.assign(state, initial)
};
```

### Classes
* Utilize ES2015 `class` now instead of simply using functions

```javascript
// bad
function StacksComponent() {

}

// good
class StacksComponent
```

* Use `extends` for setting up prototype inheritance

```javascript
class StacksComponent extends BaseComponent {

}
```

### Modules
* Import code into modules with `import`

* Export code with `export`

* Use the `default` keyword if the intent of the module is to only export one thing

```javascript
import BaseComponent from "../core/baseComponent";

class StacksComponent extends BaseComponent {

}

export default StacksComponent
```

* You can export an object such as utilities as well

```javascript
// core/utils.js
import assign from "lodash/object/assign";

let utilities = {
  foo: () => {},
  bar: () => {},
  baz: () => {}
};

export default utilities;

// components/stacks_component.js
import { foo } from "../core/utils";
foo();

OR

import * as utils from "../core/utils"
utils.foo();
utils.bar();
utils.baz();
```

### Map, and Set
There are 2 new collection structures available in ES6.


* Use the new `Set` object in place of an array or object in the case where you need to prevent duplicate values

```javascript
let names = new Set(["steve", "eric", "jonathan", "amanda", "joe", "steve"]);
set.size; // 5
set.add("eric"); // fail
set.has("amanda"); // true

for (let name of set.values()) {
    console.log(name);
}

// OR
names.forEach((val1, val2, set) => {
  val1; // "steve"
  val2; // "eric"
});
```

* Use `Map` when you want to create an object or array with unique keys (the keys don't have to be strings in a Map either)

```javascript
let state = new Map();

state.set("name": "Component");
state.set("height", 450);
state.set(100, "abc"); // Whoa you can totes do that
state.size; // 3

state.get("name"); // Component

for (let val of set.values()) {
  console.log(val);
}

for (let keys of set.values()) {
  console.log(val);
}

for (let [key, val] of set.entries()) {
  console.log(key, val);
}

state.forEach(function(value, key) {
  console.log(key, val);
});
```

### Array comprehension
* If an array needs to be created or manipulated from a given set of data, utilize [array comprehension](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Array_comprehensions)

```javascript
// Rather than...

numbers.map(function (i) { return i * i });

// Use
[for (i of numbers) i*i]
```
