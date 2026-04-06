# Calculator

This is a two-in-one simple calculator and base converter.
The simple calculator mostly behaves how you would expect it to.
The base converter works with unsigned integers only, supports the basic four operations (but only integer division), and lets you choose the current base between 2 and 60 at any time.

Some extra features:
- Keyboard support works everywhere (if it's a valid action). Digits, operators, and the decimal point are given (plus Enter is Equal); Backspace is, well, Backspace; Escape is Clear; Alt is sqrt; Space is sign change; Shift + Tab is Expand; Tab is entering or exiting Base input.
- If you press multiple operators, it won't continue; it just saves the last operator pressed (and gives a visual feedback by coloring the active operator).
- If you press Equal right after an operator, it uses the first operand for the second too.
- If you press Equal multiple times, it repeats the last operation. (Easy way to find out the powers of 2.)
- Backspace works for removing operators too.
- There is a maximum (and minimum, as a negative) number: 999,999,999,999,999. It won't let you beyond that, even in expanded mode.
- If a base change would make the number too large, it'll just convert it to the biggest possible number.
- If a number would be too long (as a decimal fraction), it'll get rounded to the display.
- Floating point inaccuracies are fixed; 0.1 + 0.2 finally equals 0.3.
- In expanded mode, copy-paste works, but only by keyboard (ctrl-c + ctrl-v).
- Don't divide by zero or take the root of a negative number. The machine might not like it.

## Some miscellaneous stuff

This is my submission for [the final assignment for the Foundations path of The Odin Project.](https://www.theodinproject.com/lessons/foundations-calculator)

The basic calculator was fun (especially with the QoL features I implemented), but I wanted to do something extra with it; eventually, I made a base converter in which the user can choose the base between 2 and 60 inclusive, use copy-paste, and even do basic operations in any chosen base (albeit only with unsigned integers). I included both in this app, so the user can choose which one they need.

In terms of active hours, it didn't take too long; however, there are two things called "life" and "work", which stretched it out to be almost a month. Still, I enjoyed the process; however, I think I'm quite ready for another adventure. There are other projects to overcomplicate.

## Screenshots
<img width="196" height="300" alt="image" src="https://github.com/user-attachments/assets/3fb17933-52b1-4897-ad8f-4d5bee623027" /> 

<img width="376" height="300" alt="image" src="https://github.com/user-attachments/assets/e26d9d8c-713e-4f01-b637-370ed51ff757" />


**No generative AI was used for this project.**
