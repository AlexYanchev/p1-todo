import { Outlet } from 'react-router-dom';
import styles from './app.module.css';
import Footer from './components/Footer/Footer';
import Menu from './components/Menu/Menu';

function App() {
  return (
    <section className={styles.container}>
      <Menu />
      <Outlet />
      <Footer />
    </section>
  );
}

export default App;
