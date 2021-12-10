# ESP

**Event Source Prototyping**

A tool for quickly sketching and demonstrating event-sourced models using TypeScript and React.

## Setup

You'll need Node.js installed. ESP was mostly tested on Node 16, but it should work on at least some older versions.

First, clone this repository, and install its dependencies.

```shell
git clone git@github.com:hx/esp
cd esp
npm i
```

Then run the dev server. It'll open the GUI in a browser window.

```shell
npm run serve
```

Edit `webpack.config.js` if you want to enable hot reloading or tweak any other settings.

## Overview

ESP presents a two-column view. Events are created and displayed on the left, and the resulting model is displayed on the right.

To create a model that can be built by ESP, you'll need to implement:

- A view that can render your model; and
- A function that, for any given state of your model, tells ESP what events can occur, and how they change the model.

Model state can be any TypeScript type you like.

You can organise your TypeScript files however you like with the [src](/src) directory.

### Views

Your model's view will be rendered on the right half of the screen. It should be implemented as a React component that
accepts a single prop, `model`, of the type you've chosen as your model's state.

```typescript jsx
interface TodoList {
  todos: Todo[]
}

export const TodoListView: FC<{ model: TodoList }> = ({model}) =>
  <li className="todo-list">
    …
  </li>
```
#### Styles

ESP uses good ol' [Bootstrap](https://getbootstrap.com/) and [SCSS](https://sass-lang.com/) for its styling needs. Add an `@import` to [src/css/app.scss](src/css/app.scss) if you need extra CSS for your view.

### Aggregates

Aggregates are a combination of a seed state and a function that will be called repeatedly to set up possible events.

```typescript jsx
const todoList: TodoList = {Todos: []}

const todoListAggregate = createAggregate(todoList, (todoList, add) => {
  // More on how this works below
})
```

### Putting them together

Boot ESP to build a model using an aggregate created by `createAggregate`, and a view with a `model` prop, by editing [src/index.ts](src/index.ts), which should call `boot` exactly once.

```typescript jsx
boot(todoListAggregate, TodoListView)
```

## Defining events

Define an event by first declaring a named type using `EventBase`:

```typescript jsx
type NewTodo = EventBase<'newTodo'>
```

We can now tell ESP to render a button that triggers a `newTodo` event of type `NewTodo`, and how that event should mutate our model.

```typescript jsx
const todoListAggregate = createAggregate(todoList, (todoList, add) => {
  add<NewTodo>('newTodo', 'New').handle(() => ({todos: [...todoList.todos, {description: ''}]}))
})
```

The second argument passed to `add` is the text to be displayed on the button.

The return value of the function passed to `handle` should be the new model. It can reference the existing model, but must not mutate it. The function is essentially a reducer.

Events don't always have to be available. For example, you could limit your TODO list to 5 items by only making "New" available when there are fewer than 5 items in the list.

```typescript jsx
if (todoList.todos.length < 5) {
  add<NewTodo>('newTodo', 'New').handle(() => ({todos: [...todoList.todos, {description: ''}]}))
}
```

### Arguments

Most event need to have information attached to them. You can add arguments to events, for which ESP will display form inputs when triggering those events.

```typescript jsx
type NewTodo = EventBase<'newTodo', {
  description: string
}>

const todoListAggregate = createAggregate(todoList, (todoList, add) => {
  const newTodoEvent = add<NewTodo>('newTodo', 'New')
  newTodoEvent.addArgument('description', 'Description')
  newTodoEvent.handle(({event: {description}}) => ({todos: [...todoList.todos, {description}]}))
})
```

Now, a "Description" text input will be displayed when triggering a "New" event.

### Validation

Argument validation can be performed by your event handler.

```typescript jsx
newTodoEvent.handle(({event: {description}, reject}) => {
  if (description.trim() === '') {
    return reject('Description must not be blank.')
  }
  …
})
```

Error messages will be displayed in the context of the entire event. You cannot specifically associate an error message with a particular argument.

### Argument types and defaults

You can set an argument default by adding an optional third argument.

```typescript jsx
newTodoEvent.addArgument('description', 'Description', 'New item')
```

Defaults are used to determine argument types. If you want an argument to be parsed as a number, you'll need to give it a numeric default value. To display a checkbox, specify the default as `true` or `false`.

### Enums

Enums can be used not just for fixed choices of arguments, but to reference existing parts of a model.

Let's define another event type for deleting todos:

```typescript jsx
type DeleteTodo = EventBase<'deleteTodo', {
  index: number
}>
```

When defining this event, we can define an argument that allows selection of an existing todo by its index and description:

```typescript jsx
if (todoList.todos[0]) {
  const deleteTodoEvent = add<DeleteTodo>('deleteTodo', 'Delete')
  deleteTodoEvent.addArgument('index', 'Todo').options(
    todoList.todos.map((todo, index) => ({
      value:       index, 
      displayName: `${index + 1}. ${todo.description}`
    }))
  )
  deleteTodoEvent.handle(({event}) => ({todos: [
    ...todoList.todos.slice(0, event.index), 
    ...todoList.todos.slice(event.index + 1)
  ]}))
}
```

### Dependent arguments

When you have multiple arguments, you can use the input state of other arguments to conditionally show/hide arguments, change options, labels, etc.

Check out [chess/aggregate.ts](src/examples/chess/aggregate.ts) for an example of the `getArgument` function.

### Cleaning up

It's worth noting that most of our applicators use the original `todoList` passed to the main processing function, relying on its closure scope to access that value.

Once your process gets big enough, you may want to refactor your handlers into their own separate functions, which means this scope will no longer be available.

Along with `event` and `reject`, which we've covered above, the payload passed to event handlers also has a `model` property. The handler above could be extracted by replacing `todoList` with `model`:

```typescript jsx
const handleDeleteTodoEvent: EventHandler<TodoList, DeleteTodo> = ({event, model}) => ({todos: [
  ...model.todos.slice(0, event.index),
  ...model.todos.slice(event.index + 1)
]})
```

This can make the main process a bit neater:

```typescript jsx
add<DeleteTodo>('deleteTodo', 'Delete').handle(handleDeleteTodoEvent)
```

## Contributing

Open a PR, be nice, and be patient. Please be aware of the [license](LICENSE).
