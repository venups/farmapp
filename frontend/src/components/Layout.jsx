"""
Main layout component.
"""
import { Link } from "react-router-dom";
import styles from "./Layout.module.css";

function Layout({ children }) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Travel Planner</h1>
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>Dashboard</Link>
          <Link to="/trips" className={styles.navLink}>My Trips</Link>
          <Link to="/trips/create" className={styles.navLink}>New Trip</Link>
        </nav>
      </header>
      
      <main className={styles.main}>
        {children}
      </main>
      
      <footer className={styles.footer}>
        <p>Travel Planner &copy; 2024</p>
      </footer>
    </div>
  );
}

export default Layout;
