import "./App.css";

function App() {
  const handle = () => {
    alert("gg");
  };
  return (
    <div className="App">
      <form onSubmit={handle}>
        <input type="file"></input>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
