import './globals.css';
import NavBar from './components/NavBar';

export const metadata = {
  title: '명주마유결혼해요!!',
  description: '명주마유청첩장이애오!!',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        {/* <NavBar /> */}
        {children}
      </body>
    </html>
  );
}
