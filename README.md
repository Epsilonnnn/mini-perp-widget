# Mini-Perp Widget

### Features

- See the latest price of BTC Yield-Perp
- Submit a market order (long/short, fixed size).
- View an updating position PnL panel.


### Quick start

**Install deps:**

```
npm ci
```

**Run:**

```
npm run preview
```

**Dev mode:**

```
npm run dev
```



### Project structure and architecture

The project is built and structured based on [FSD architecture](https://feature-sliced.design/). This approach displays a verbose and explicit view of the project's business logic.


### Project tech stack

**State management**: *Jotai* - really good performance for rapidly changing data, fine-grained reactivity - only affected atoms trigger re-renders

**BTC market data**: *Coinbase WebSocket API* - performant and fast api with zero authentication requirements (good fit for the task)

**Styles**: *Tailwind*

**Code style and formatting**: *Eslint*, *Prettier*