
Finance Simulator is what I use to predict my finances.  It allows you to define multiple accounts and financial events and plots the results over time.  
An event can be a deposit, withdrawal, transfer, change in interest rate, etc...

It's fairly accurate, but serves best as an approximation *(unless you factor in every single transaction perfectly!)*.  

The algorithm for computing the data is O(n) for all dimensions and runs in a webworker spawned by the app!  1000 years of daily interest rates for one account takes roughly 10 seconds to compute, but you will likely only look a couple years ahead.  Running it in javascript gives a 5x performance boost compared to python, so I've opted to keep everything on the front end.

The way it works is each Event inherits a Functor unique to the kind of event.  The simulation will iterate over all scheduled events and apply the Functors to a state held by each Account.  That state encodes things like the current balance, the Account's ability to initiate transfers, interest accrual, etc.  There are some complexities involved with transfers and order of events that would take too long to explain here, but I'm quite happy with the algorithm I came up with that you can see in the Functor method of `Transfer.ts`.

For now, since there is no working backend, loading/downloading the JSON is the only way to persist user data.  

I have many more ideas for quality of life improvements I will add in the future, but will have to wait until I migrate from plotly to a custom SVG graph.  



## TODO:

1) move to tailwindcss
2) Optimize events before start time
3) 'New Graph' button with automatic date ranges (based on today)