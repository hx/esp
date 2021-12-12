import React, { FC } from 'react'

export const Welcome: FC<{projection: null}> = () =>
  <div>
    <h2>Next steps</h2>
    <p>It looks like you’re up and running with ESP. Nicely done.</p>
    <p>To change what you see here, you’ll need to edit <code>src/index.ts</code>.</p>
    <p>
      ESP comes with three examples, including this static one. You can comment out <code>welcome</code>, and
      uncomment <code>order</code> or <code>chess</code>, to have a play with one of the others.
    </p>
    <p>
      Follow the examples, or check out the <a href="https://github.com/hx/esp#readme">README</a> for more on how to create
      your own model.
    </p>
    <p>Happy modelling!</p>
    <p><cite>Neil</cite> 💙</p>
    <p className="small">👈 P.S. that column’s intentionally blank at the moment.</p>
  </div>
