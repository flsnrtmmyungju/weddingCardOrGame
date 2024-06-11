import MainFrame from './component/MainFrame';
import fs from 'fs';
import path from 'path';
export default function Home() {
  const filePath = path.join(process.cwd(), 'public', 'openCard.html');
  const htmlContent = fs.readFileSync(filePath, 'utf-8');
  return (
    <div style={{ width: 1830, height: 1020 }}>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />

      {/* <MainFrame /> */}
    </div>
  );
}
