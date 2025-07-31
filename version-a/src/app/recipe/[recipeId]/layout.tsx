import Link from 'next/link';
import styles from './recipe-layout.module.css';

type RecipeLayoutProps = Readonly<{ children: React.ReactNode; }>;

export default function RecipeLayout({ children }: RecipeLayoutProps) {
  return (
    <>
      <header className={styles.recipeHeader}>
        <Link href='/' className='button'>&lt; Back</Link>
        <span className={styles.title}>Recipe Details</span>
        <button className={styles.hidden}>&lt; Back</button>
      </header>
      <section>
        {children}
      </section>
    </>
  )
}