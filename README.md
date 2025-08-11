# Finance Simulator
```
git clone https://github.com/Casey-Litmer/finance-simulator
```
---

Finance Simulator is what I use to predict my finances.  It allows you to define multiple accounts and financial events and plots the results over time.  
An event can be a deposit, withdrawal, transfer, change in interest rate, etc...

It's fairly accurate, but best serves as an approximation or a projection *(unless you factor in every single transaction perfectly!)*.  

The algorithm for computing the data is O(n) for all dimensions and runs in a webworker spawned by the app!  1000 years of daily interest rates for one account takes roughly 10 seconds to compute, but you will likely only look a couple years ahead.  Running it in javascript gives a 5x performance boost compared to python, so I've opted to keep everything on the front end.

The way it works is each Event inherits a Functor unique to the kind of event. 
The simulation will iterate over all scheduled events and apply the Functors to a state held by each Account.  That state encodes things like the current balance, the Account's ability to initiate transfers, interest accrual, etc.  There are some complexities involved with transfers and order of events that would take too long to explain here, but I'm quite happy with the algorithm I came up with that you can see in the Functor method of `Transfer.ts`.  There is a main loop that runs over all accounts and time steps, as well as a loop that iterates over a stack of events within that range.  A Transfer runs a new stack loop over the opposite account's remaning events to catch up and closes itself like a knot when the progress of their calculations are synchronized!  Not a super big detail, but I just thought that was cool.

For now, since there is no working backend, loading/downloading the JSON is the only way to persist user data.  It's annoying but works for now! 

I have many more ideas for quality of life improvements I will add in the future, but will have to wait until I migrate from plotly to a custom SVG graph.  Some ideas are:

- User markers on the graph
- Event labels (as well for reoccuring events)
- Warnings for overdrafts



## TODO:

- Add value change breakpoints to all periodic events (Kindof like embedded versions of change interest rate)
- Update the fonts and color pallete to be more readable

0) Host this!
1) Move to tailwindcss
2) Optimize events before start time
3) 'New Graph' button with automatic date ranges (based on today)
