# `getRandomInt()`

## gets a pseudo random number within a given range

Throttling is a technique that limits how often a function can be called in a given period of time. It is useful for improving the performance and responsiveness of web pages that have event listeners that trigger heavy or expensive operations, such as animations, scrolling, resizing, fetching data, etc.

For example, if you have a function that fetches some data from an API every time the user scrolls the page, you might want to throttle it so that it only makes one request every second, instead of making hundreds of requests as the user scrolls. This way, you can avoid overloading the server or the browser with unnecessary requests and reduce the bandwidth consumption.

### Why Use Throttling?

Throttling can improve the performance and user experience of web pages by reducing the number of unnecessary or redundant operations. It can also prevent some issues such as:

- Overloading the server or the browser with too many requests or calculations
- Exceeding the rate limits or quotas of APIs or services
- Wasting bandwidth or resources on operations that are not visible or relevant to the user
- Creating janky or laggy animations or interactions

### When to Use Throttling?

Throttling is suitable for scenarios where you want to limit how often a function can be called, but you don’t want to miss any calls. For example, you might want to use throttling for:

- Fetching data from an API or a database when the user scrolls, resizes, or types
- Updating or animating elements on the page when the user scrolls, resizes, or moves the mouse
- Logging or tracking user actions or events when they occur frequently

### Code

```js
function throttle(mainFunction, delay) {
  let timerFlag = null; // Variable to keep track of the timer

  // Returning a throttled version 
  return (...args) => {
    if (timerFlag === null) { // If there is no timer currently running
      mainFunction(...args); // Execute the main function 
      timerFlag = setTimeout(() => { // Set a timer to clear the timerFlag after the specified delay
        timerFlag = null; // Clear the timerFlag to allow the main function to be executed again
      }, delay);
    }
  };
}
```

### Use case

```js
// Define a function that fetches some data from an API
function fetchData() {
  console.log("Fetching data...");
  // Simulate an API call with a random delay
  setTimeout(() => {
    console.log("Data fetched!");
  }, Math.random() * 1000);
}

// Throttle the fetchData function with a delay of 5000 ms
const throttledFetchData = throttle(fetchData, 5000);

// Add an event listener to the window scroll event that calls the throttledFetchData function
window.addEventListener("scroll", throttledFetchData);
```

In this example, we define a `throttle()` *function* that takes a *callback* and a *delay* as **arguments**. The `throttle()` *function* returns a **new** *function* that **wraps** the *callback* with a *logic* that uses `setTimeout` to **create** a *timer*. The *timer* ensures that the *callback* is only called once within the *delay* period. If the *returned* *function* is called again before the *timer* expires, it does nothing.

We then define a `fetchData()` *function* that simulates an **API call** with a **random** *delay*. We use the `throttle()` *function* to **create** a `throttledFetchData()` *function* that has a *delay* of 5000 *ms*. We add an event listener to the window scroll event that **calls** the `throttledFetchData()` function.

If you run this code and scroll the page, you will see that the fetchData function is only called once every 5 second, regardless of how fast or slow you scroll.
