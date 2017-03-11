Examples to promisify the `johnny-five` with ES7 `async/await`.

The ability to read pin value asynchronously will really relieve me of the burden when writing code according to the value, a long and nested callback can make people crazy. Luckily, ES7 have supported `async/await`! Just write the program as run with `--harmony`:

``` js
$ node --harmony /path/file_to_run.js
```

To be honest, at first I did not realize this support, so I tried `asyncawait` lib and compile ES7 code with `babel`, they are both workable polyfill and can be useful when we run nodejs version less than 7.x.


##

`bluebird`

I will first demonstrate how to use 