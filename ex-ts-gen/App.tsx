import './App.css'
import IEntity, { Payment, Product, User } from './extra';
import { EntityDisplay } from './GenApp';



function App() {

  const user = new User("1", "Alice", "123-456-7890");
  const product = new Product("2", "Laptop", 1500);
  const payment = new Payment("3", "Paid in full", 1500);

  return (
    <>
      <EntityDisplay entity={user} />
      <EntityDisplay entity={product} />

      <EntityDisplay entity={payment} />

    </>
  )
}

export default App
