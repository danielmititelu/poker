# Overview

This projects aims to offer a virtual implementation of the [planning poker game](https://en.wikipedia.org/wiki/Planning_poker).

# Goals 

1. Scrum master enters the websites and creates a room with specific cards (Fibonacci sequence, playing cards etc.)
2. Provides a link of the room to his peers
3. Each user can vote on a task with the cards provided
4. The scrum master reveals all cards 
5. Repeat step 3 for all the tasks 

# Assumption

- no login required 
- rooms are ephemeral and can be deleted after everyone leaves
- a link is necessary to enter a room

# Approach 

Firebase + Svelte

## Firebase

Firebase solves a lot of requirements out of the box:
- real-time database 
- hosting 

Firebase real-time database is a good fit for the back-end part. When a user places a card down the entire room will be notified by this change.

The [free tier](https://firebase.google.com/pricing) should be enough.

## Svelte

"All code is buggy. It stands to reason, therefore, that the more code you have to write the buggier your apps will be."
-Rich Harris

https://svelte.dev/blog/write-less-code