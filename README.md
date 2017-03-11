## All things start

Recently I'm messing around with [`johnny-five` lib](https://github.com/rwaldron/johnny-five), which is a wonderful javascript lib to control many types of boards, i.e. Arduino Uno/Leonardo/Mega, BotBoarduino, Intel Edison Mini, Raspberry Pi 3/2/1 to name a few. In fact, it deal with Arduino on the fly, other boards are not fully supported(for example, stepper control on many other boards). But back to my situation, I need to use arduino mega2560 to control camera movement via there stepper(6-dof describes camera movement better you may wonder, but I will go step by step). So at least it fits, and after almost one week's digging around, I find write hardware controlling system with a much more high level language than C or C++ make me wonder the possibility of everyone being a hardware hacker: all they need is a board, some sensors maybe some motors and/or steppers to form a homemade robot and write some unreasonably easy javascript scripts and boom. You can find many awesome demos on the [official site of `johnny-five`](http://johnny-five.io/articles/).

There are there sub-projects in this repo(by far!), I will give a brief description to them, look in the specific dictionary for more info.

### promisify-johnny-five

Promisify `johnny-five` lib and use `async` and `await` to avoid callbacks and make code more readable.

Reading value of one or more than one at the same time is used to demonstrate.

### mega2560_pins

I still remember last year almost the same time, I was also assigned to make the 6-dof camera platform better(funny enough, the better can always be true, better than last better). Anyway at that time when play with Raspberry Pi, I found a splendid lib to show the states of GPIO pins of Pi -- [`WebIOPi`](http://webiopi.trouch.com/), and I failed to find a corresponding lib or script for Arduino(Mega2560)(Chances are that I missed when searching github). So how do you think of this one:

![mega2560_pins](pics/mega2560_pins.png)

Personally, I pretty enjoy the UI.(Thanks give to [`echarts`]http://echarts.baidu.com/).

### stepper

At the time of writing, stepper 2.x have not been implemented on the firmware...