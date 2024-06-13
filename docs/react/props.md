---
sidbar_position: 6
---

# Props

Props (short for properties) are are used to pass data from from a parent
component to a child component. This makes components reusable and helps
maintain a clear data flow in your application.

Props are read-only, meaning a child component cannot modify the props it
receives. This immutability ensures that data flows in one direction (from
parent to child), which simplifies understanding how data changes in the
application. If child components could modify props, it would be harder to track
the state and data flow.

## Reverse Data Flow

there are scenarios where child components need to communicate changes back to
their parent components. This is typically done using callback functions passed
via props.

1. Create a function in the parent component that will handle the data or event.
2. Pass the callback function to the child component as a prop.
3. In the child component, invoke the callback function (e.g., in response to
   user input or other events).

```javascript
function ParentComponent() {
  const [data, setData] = React.useState('');

  const handleDataChange = (newData) => {
    setData(newData);
  };

  return <ChildComponent onDataChange={handleDataChange} />;
}

function ChildComponent({ onDataChange }) {
  const handleInputChange = (event) => {
    onDataChange(event.target.value);
  };

  return <input type="text" onChange={handleInputChange} />;
}
```
